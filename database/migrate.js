import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import pg from 'pg';
import { services } from '../src/data/services.js';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is required. Add it to a local .env file before migrating.');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: true },
});

try {
  const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8');
  const seed = await readFile(new URL('./seed.sql', import.meta.url), 'utf8');
  const migrationDirectory = new URL('./migrations/', import.meta.url);
  const migrations = (await readdir(migrationDirectory))
    .filter((fileName) => /^\d+.*\.sql$/i.test(fileName))
    .sort((first, second) => first.localeCompare(second, undefined, { numeric: true }));
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query(schema);
    for (const fileName of migrations) {
      const migration = await readFile(new URL(fileName, migrationDirectory), 'utf8');
      console.log(`Running migration ${fileName}...`);
      await client.query(migration);
    }
    await client.query(
      'UPDATE services SET branch_id = NULL WHERE name_en = ANY($1::TEXT[])',
      [services.map((service) => service.name)],
    );
    await client.query(seed);
    for (const service of services) {
      const details = {
        shortDescription: service.shortDescription,
        shortDescriptionAr: service.shortDescriptionAr,
        benefits: service.benefits,
        benefitsAr: service.benefitsAr,
        suitableFor: service.suitableFor,
        suitableForAr: service.suitableForAr,
        treatmentAreas: service.treatmentAreas,
        treatmentAreasAr: service.treatmentAreasAr,
        importantNotes: service.importantNotes,
        importantNotesAr: service.importantNotesAr,
        commonQuestions: service.commonQuestions,
      };
      await client.query(
        "UPDATE services SET details = $1::JSONB WHERE name_en = $2 AND details = '{}'::JSONB",
        [JSON.stringify(details), service.name],
      );
    }
    await client.query('COMMIT');
    console.log('Database schema and placeholder seed data applied successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
} catch (error) {
  console.error('Database migration failed:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
