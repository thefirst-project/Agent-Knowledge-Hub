import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

const auditedTables = [
  ['branches', "COALESCE(name_en, 'Branch #' || id::TEXT)"],
  ['services', "COALESCE(name_en, 'Service #' || id::TEXT)"],
  ['media', "COALESCE(title_en, 'Media #' || id::TEXT)"],
  ['call_flow_steps', "COALESCE(label_en, 'Call flow step #' || id::TEXT)"],
  ['quick_replies', "COALESCE(title_en, 'Quick reply #' || id::TEXT)"],
  ['offers', "COALESCE(title_en, 'Offer #' || id::TEXT)"],
  ['prices', "'Price #' || id::TEXT"],
  ['users', "COALESCE(username, 'User #' || id::TEXT)"],
];

router.get('/', async (_request, response) => {
  const records = await Promise.all(auditedTables.map(async ([table, recordName]) => {
    const result = await pool.query(
      `SELECT
        $1::TEXT AS table_name,
        id AS record_id,
        CASE
          WHEN is_deleted THEN 'deleted'
          WHEN created_at >= updated_at - INTERVAL '2 seconds' THEN 'created'
          ELSE 'updated'
        END AS action,
        CASE WHEN is_deleted THEN deleted_at ELSE updated_at END AS timestamp,
        ${recordName} AS record_name
      FROM "${table}"
      WHERE is_deleted = true OR updated_at IS NOT NULL`,
      [table],
    );
    return result.rows;
  }));

  response.json(records.flat()
    .sort((first, second) => new Date(second.timestamp).getTime() - new Date(first.timestamp).getTime())
    .slice(0, 100));
});

export default router;
