import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { requireSuperAdmin, verifyToken } from '../auth/authMiddleware.js';
import authRouter from './auth.js';
import { createResourceRouter } from './resource.js';
import auditRouter from './audit.js';

const router = Router();

async function prepareUserEntries(entries) {
  const output = [];
  for (const [key, value] of entries) {
    if (key !== 'password') {
      output.push([key, value]);
      continue;
    }
    if (typeof value !== 'string') {
      throw new Error('Password must be a string.');
    }
    if (!value) continue;
    output.push(['password_hash', await bcrypt.hash(value, 12)]);
  }
  return output;
}

async function getServiceWithRelations(serviceId, request, response) {
  const rawBranchId = request.query.branch_id;
  if (rawBranchId !== undefined
    && (typeof rawBranchId !== 'string'
      || !/^[1-9]\d*$/.test(rawBranchId)
      || !Number.isSafeInteger(Number(rawBranchId)))) {
    response.status(400).json({ error: 'branch_id must be a positive integer.' });
    return null;
  }
  const branchId = rawBranchId === undefined ? null : Number(rawBranchId);

  const serviceResult = await pool.query(
    `SELECT id, branch_id, name_en, name_ar, category, description_en,
      description_ar, details, created_at, updated_at, is_deleted, deleted_at,
      created_by, updated_by, deleted_by
    FROM services WHERE id = $1 AND is_deleted = false`,
    [serviceId],
  );
  const service = serviceResult.rows[0];
  if (!service) return null;

  const [mediaResult, callFlowResult] = await Promise.all([
    pool.query(
      `SELECT id, service_id, branch_id, title_en, title_ar, caption_en, caption_ar,
        thumbnail_url, full_url, download_url, file_type, tags
      FROM media WHERE service_id = $1
        AND ($2::INTEGER IS NULL OR branch_id = $2 OR branch_id IS NULL)
        AND is_deleted = false
      ORDER BY id`,
      [serviceId, branchId],
    ),
    branchId === null
      ? pool.query(
        `SELECT id, service_id, branch_id, step_order, label_en, label_ar,
          content_en, content_ar, tip_en, tip_ar
        FROM call_flow_steps
        WHERE service_id = $1 AND branch_id IS NULL AND is_deleted = false
        ORDER BY step_order`,
        [serviceId],
      )
      : pool.query(
        `SELECT id, service_id, branch_id, step_order, label_en, label_ar,
          content_en, content_ar, tip_en, tip_ar
        FROM call_flow_steps
        WHERE service_id = $1 AND (branch_id = $2 OR branch_id IS NULL)
          AND is_deleted = false
        ORDER BY step_order`,
        [serviceId, branchId],
      ),
  ]);
  const media = mediaResult.rows.map((item) => ({
    ...item,
    type: item.file_type,
    external_url: item.file_type === 'video' ? item.download_url : null,
  }));
  const branchSteps = branchId === null
    ? []
    : callFlowResult.rows.filter((step) => step.branch_id === branchId);
  const selectedCallFlow = branchSteps.length > 0
    ? branchSteps
    : callFlowResult.rows.filter((step) => step.branch_id == null);
  const steps = selectedCallFlow.map((step) => ({
    ...step,
    order: step.step_order,
  }));

  return {
    ...service,
    media,
    call_flow_steps: steps,
    callFlow: { title_en: '', title_ar: '', steps },
  };
}

const resources = [
  {
    path: 'branches',
    table: 'branches',
    fields: [
      'name_en', 'name_ar', 'city_en', 'city_ar', 'phone', 'email',
      'address_en', 'address_ar', 'latitude', 'longitude', 'google_maps_url', 'is_active',
    ],
    required: ['name_en', 'name_ar', 'google_maps_url'],
    urlFields: ['google_maps_url'],
  },
  {
    path: 'services',
    table: 'services',
    fields: ['branch_id', 'name_en', 'name_ar', 'category', 'description_en', 'description_ar', 'details'],
    required: ['name_en', 'name_ar'],
    queryFields: ['branch_id'],
    includeNullFor: ['branch_id'],
    getById: getServiceWithRelations,
  },
  {
    path: 'media',
    table: 'media',
    fields: [
      'service_id', 'branch_id', 'title_en', 'title_ar', 'caption_en', 'caption_ar',
      'thumbnail_url', 'full_url', 'download_url', 'file_type', 'tags',
    ],
    queryFields: ['service_id', 'branch_id'],
    includeNullFor: ['branch_id'],
  },
  {
    path: 'call-flows',
    table: 'call_flow_steps',
    fields: [
      'service_id', 'branch_id', 'step_order', 'label_en', 'label_ar',
      'content_en', 'content_ar', 'tip_en', 'tip_ar',
    ],
    required: ['step_order'],
    queryFields: ['service_id', 'branch_id'],
    includeNullFor: ['branch_id'],
    orderBy: 'step_order, id',
  },
  {
    path: 'quick-replies',
    table: 'quick_replies',
    fields: ['branch_id', 'category', 'title_en', 'title_ar', 'body_en', 'body_ar', 'tags'],
    queryFields: ['branch_id'],
    includeNullFor: ['branch_id'],
  },
  {
    path: 'offers',
    table: 'offers',
    fields: [
      'branch_id', 'title_en', 'title_ar', 'description_en', 'description_ar',
      'valid_until', 'is_active',
    ],
    queryFields: ['branch_id'],
    includeNullFor: ['branch_id'],
  },
  {
    path: 'prices',
    table: 'prices',
    fields: ['service_id', 'branch_id', 'price', 'currency'],
    required: ['service_id'],
    getList: async (request, response) => {
      const branchId = request.query.branch_id;
      if (branchId !== undefined
        && branchId !== 'null'
        && (typeof branchId !== 'string'
          || !/^[1-9]\d*$/.test(branchId)
          || !Number.isSafeInteger(Number(branchId)))) {
        response.status(400).json({ error: 'branch_id must be a positive integer or null.' });
        return [];
      }
      const values = [];
      let branchCondition = '';
      if (branchId === 'null') {
        branchCondition = 'AND p.branch_id IS NULL';
      } else if (branchId !== undefined) {
        values.push(Number(branchId));
        branchCondition = `AND (p.branch_id = $${values.length} OR p.branch_id IS NULL)`;
      }
      const result = await pool.query(
        `SELECT p.id, p.service_id, p.branch_id, p.price, p.currency,
          s.name_en AS service_name_en, s.name_ar AS service_name_ar,
          p.created_at, p.updated_at, p.is_deleted, p.deleted_at,
          p.created_by, p.updated_by, p.deleted_by
        FROM prices p JOIN services s ON s.id = p.service_id
        WHERE p.is_deleted = false AND s.is_deleted = false ${branchCondition}
        ORDER BY p.id`,
        values,
      );
      return result.rows;
    },
    getDeletedList: async () => {
      const result = await pool.query(
        `SELECT p.id, p.service_id, p.branch_id, p.price, p.currency,
          s.name_en AS service_name_en, s.name_ar AS service_name_ar,
          p.created_at, p.updated_at, p.is_deleted, p.deleted_at,
          p.created_by, p.updated_by, p.deleted_by
        FROM prices p LEFT JOIN services s ON s.id = p.service_id
        WHERE p.is_deleted = true ORDER BY p.deleted_at DESC NULLS LAST, p.id`,
      );
      return result.rows;
    },
  },
  {
    path: 'users',
    table: 'users',
    fields: ['username', 'password_hash', 'role', 'branch_id'],
    required: ['username', 'password_hash'],
    excludedFromRead: ['password_hash'],
    inputFields: ['password'],
    prepareEntries: prepareUserEntries,
    trackActors: false,
  },
];

router.use('/api/auth', authRouter);

const writeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const protectWrites = (request, response, next) => (
  writeMethods.has(request.method) ? verifyToken(request, response, next) : next()
);
for (const path of [
  '/api/branches', '/api/services', '/api/media', '/api/call-flows',
  '/api/quick-replies', '/api/offers', '/api/prices',
]) {
  router.use(path, protectWrites);
}
router.use('/api/users', verifyToken, requireSuperAdmin);

router.put('/api/call-flows/reorder', verifyToken, async (request, response) => {
  const { ids } = request.body || {};
  if (!Array.isArray(ids) || ids.length === 0
    || ids.some((id) => !Number.isSafeInteger(id) || id < 1)
    || new Set(ids).size !== ids.length) {
    response.status(400).json({ error: 'ids must be a non-empty list of unique positive integer call-flow IDs.' });
    return;
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const selected = await client.query(
      `SELECT id, service_id, branch_id FROM call_flow_steps
      WHERE id = ANY($1::INTEGER[]) AND is_deleted = false FOR UPDATE`,
      [ids],
    );
    if (selected.rowCount !== ids.length) {
      throw new Error('Every call-flow step must exist and be active.');
    }
    const { service_id: serviceId, branch_id: branchId } = selected.rows[0];
    if (selected.rows.some((row) => row.service_id !== serviceId || row.branch_id !== branchId)) {
      throw new Error('Call-flow steps can only be reordered within one service and branch.');
    }
    for (const [index, id] of ids.entries()) {
      const result = await client.query(
        `UPDATE call_flow_steps SET step_order = $1, updated_at = NOW(), updated_by = $3
        WHERE id = $2 AND is_deleted = false`,
        [index + 1, id, request.user?.id ?? null],
      );
      if (result.rowCount !== 1) throw new Error(`Call flow step ${id} was not found.`);
    }
    await client.query('COMMIT');
    response.json({ updated: ids.length });
  } catch (error) {
    await client.query('ROLLBACK');
    response.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});

router.use('/api/audit', auditRouter);

for (const resource of resources) {
  router.use(`/api/${resource.path}`, createResourceRouter(resource));
}

export default router;
