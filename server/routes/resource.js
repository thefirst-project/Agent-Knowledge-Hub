import { Router } from 'express';
import { pool } from '../db.js';

const identifierPattern = /^[1-9]\d*$/;
const auditFields = ['updated_at', 'is_deleted', 'deleted_at', 'created_by', 'updated_by', 'deleted_by'];

export function createResourceRouter({
  table,
  fields,
  required = [],
  urlFields = [],
  excludedFromRead = [],
  queryFields = [],
  includeNullFor = [],
  orderBy = 'id',
  inputFields = [],
  prepareEntries,
  trackActors = true,
  getList,
  getDeletedList,
  getById,
}) {
  const router = Router();
  const columns = new Set(fields);
  const visibleFields = fields.filter((field) => !excludedFromRead.includes(field));
  const selectFields = [
    '"id"',
    ...visibleFields.map((field) => `"${field}"`),
    '"created_at"',
    ...auditFields.filter((field) => trackActors || !['created_by', 'updated_by', 'deleted_by'].includes(field))
      .map((field) => `"${field}"`),
  ].join(', ');

  function getPayload(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return { error: 'Request body must be a JSON object.' };
    }

    const entries = Object.entries(body).filter(([key]) => key !== 'id' && key !== 'created_at');
    const allowed = new Set([
      ...[...columns].filter((field) => !excludedFromRead.includes(field)),
      ...inputFields,
    ]);
    const unknownFields = entries.map(([key]) => key).filter((key) => !allowed.has(key));

    if (unknownFields.length > 0) {
      return { error: `Unsupported field(s): ${unknownFields.join(', ')}.` };
    }

    if (entries.length === 0) {
      return { error: 'Provide at least one supported field.' };
    }

    return { entries };
  }

  function validateEntries(entries, requiredFields = []) {
    const values = new Map(entries);
    const missingFields = requiredFields.filter((field) => {
      const value = values.get(field);
      return value == null || (typeof value === 'string' && value.trim() === '');
    });
    if (missingFields.length > 0) {
      return `Required field(s): ${missingFields.join(', ')}.`;
    }

    for (const field of urlFields) {
      if (!values.has(field)) continue;
      const value = values.get(field);
      if (typeof value !== 'string' || value.trim() === '') {
        return `${field} must be a valid URL.`;
      }
      try {
        const url = new URL(value);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid protocol.');
      } catch {
        return `${field} must be a valid HTTP or HTTPS URL.`;
      }
    }
    return null;
  }

  function validateId(id, response) {
    if (!identifierPattern.test(id) || !Number.isSafeInteger(Number(id))) {
      response.status(400).json({ error: 'ID must be a positive integer.' });
      return false;
    }
    return true;
  }

  router.get('/deleted', async (request, response) => {
    if (getDeletedList) {
      const records = await getDeletedList(request, response);
      if (!response.headersSent) response.json(records);
      return;
    }
    const result = await pool.query(
      `SELECT ${selectFields} FROM "${table}" WHERE is_deleted = true ORDER BY deleted_at DESC NULLS LAST, id`,
    );
    response.json(result.rows);
  });

  router.post('/:id/restore', async (request, response) => {
    if (!validateId(request.params.id, response)) return;
    const result = await pool.query(
      `UPDATE "${table}"
      SET is_deleted = false, deleted_at = NULL, updated_at = NOW()
      ${trackActors ? ', deleted_by = NULL, updated_by = $2' : ''}
      WHERE id = $1 AND is_deleted = true
      RETURNING ${selectFields}`,
      trackActors
        ? [Number(request.params.id), request.user?.id ?? null]
        : [Number(request.params.id)],
    );
    if (result.rowCount === 0) {
      response.status(404).json({ error: 'Deleted record not found.' });
      return;
    }
    response.json(result.rows[0]);
  });

  router.delete('/deleted/:id', async (request, response) => {
    if (!validateId(request.params.id, response)) return;
    const result = await pool.query(
      `DELETE FROM "${table}" WHERE id = $1 AND is_deleted = true RETURNING ${selectFields}`,
      [Number(request.params.id)],
    );
    if (result.rowCount === 0) {
      response.status(404).json({ error: 'Deleted record not found.' });
      return;
    }
    response.json(result.rows[0]);
  });

  router.get('/', async (request, response) => {
    if (getList) {
      const records = await getList(request, response);
      if (!response.headersSent) response.json(records);
      return;
    }

    const filters = Object.entries(request.query).filter(([field]) => queryFields.includes(field));
    const values = [];
    const conditions = ['is_deleted = false'];
    for (const [field, rawValue] of filters) {
      if (typeof rawValue !== 'string') {
        response.status(400).json({ error: `Invalid ${field} filter.` });
        return;
      }
      if (rawValue === 'null') {
        conditions.push(`"${field}" IS NULL`);
        continue;
      }
      if (!identifierPattern.test(rawValue) || !Number.isSafeInteger(Number(rawValue))) {
        response.status(400).json({ error: `${field} must be a positive integer or null.` });
        return;
      }
      values.push(Number(rawValue));
      const parameter = `$${values.length}`;
      conditions.push(includeNullFor.includes(field)
        ? `("${field}" = ${parameter} OR "${field}" IS NULL)`
        : `"${field}" = ${parameter}`);
    }
    const result = await pool.query(
      `SELECT ${selectFields} FROM "${table}" WHERE ${conditions.join(' AND ')} ORDER BY ${orderBy}`,
      values,
    );
    response.json(result.rows);
  });

  router.get('/:id', async (request, response) => {
    if (!validateId(request.params.id, response)) return;
    const record = getById
      ? await getById(Number(request.params.id), request, response)
      : (await pool.query(
        `SELECT ${selectFields} FROM "${table}" WHERE id = $1 AND is_deleted = false`,
        [Number(request.params.id)],
      )).rows[0];
    if (response.headersSent) return;
    if (!record) {
      response.status(404).json({ error: 'Record not found.' });
      return;
    }
    response.json(record);
  });

  router.post('/', async (request, response) => {
    const payload = getPayload(request.body);
    if (payload.error) {
      response.status(400).json({ error: payload.error });
      return;
    }

    const entries = prepareEntries ? await prepareEntries(payload.entries) : payload.entries;
    const validationError = validateEntries(entries, required);
    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }
    const names = entries.map(([key]) => `"${key}"`).join(', ');
    const values = entries.map(([, value]) => value);
    if (trackActors) values.push(request.user?.id ?? null, request.user?.id ?? null);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    const result = await pool.query(
      `INSERT INTO "${table}" (${names}${trackActors ? ', created_by, updated_by' : ''}, updated_at)
      VALUES (${placeholders}, NOW())
      RETURNING ${selectFields}`,
      values,
    );
    response.status(201).json(result.rows[0]);
  });

  const update = async (request, response) => {
    if (!validateId(request.params.id, response)) return;
    const payload = getPayload(request.body);
    if (payload.error) {
      response.status(400).json({ error: payload.error });
      return;
    }

    const entries = prepareEntries ? await prepareEntries(payload.entries) : payload.entries;
    const validationError = validateEntries(entries);
    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }
    if (entries.length === 0) {
      const current = await pool.query(
        `SELECT ${selectFields} FROM "${table}" WHERE id = $1 AND is_deleted = false`,
        [Number(request.params.id)],
      );
      if (current.rowCount === 0) {
        response.status(404).json({ error: 'Record not found.' });
      } else {
        response.json(current.rows[0]);
      }
      return;
    }
    const assignments = entries
      .map(([key], index) => `"${key}" = $${index + 1}`)
      .join(', ');
    const values = entries.map(([, value]) => value);
    if (trackActors) values.push(request.user?.id ?? null);
    values.push(Number(request.params.id));
    const result = await pool.query(
      `UPDATE "${table}" SET ${assignments}, updated_at = NOW()
      ${trackActors ? `, updated_by = $${values.length - 1}` : ''}
      WHERE id = $${values.length} AND is_deleted = false
      RETURNING ${selectFields}`,
      values,
    );
    if (result.rowCount === 0) {
      response.status(404).json({ error: 'Record not found.' });
      return;
    }
    response.json(result.rows[0]);
  };

  router.put('/:id', update);
  router.patch('/:id', update);

  router.delete('/:id', async (request, response) => {
    if (!validateId(request.params.id, response)) return;
    const result = await pool.query(
      `UPDATE "${table}"
      SET is_deleted = true, deleted_at = NOW(), updated_at = NOW()
      ${trackActors ? ', deleted_by = $2' : ''}
      WHERE id = $1 AND is_deleted = false
      RETURNING ${selectFields}`,
      trackActors
        ? [Number(request.params.id), request.user?.id ?? null]
        : [Number(request.params.id)],
    );
    if (result.rowCount === 0) {
      response.status(404).json({ error: 'Record not found.' });
      return;
    }
    response.json(result.rows[0]);
  });

  return router;
}
