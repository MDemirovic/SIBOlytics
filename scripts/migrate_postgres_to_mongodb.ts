import 'dotenv/config';
import crypto from 'node:crypto';
import {MongoClient} from 'mongodb';
import {Pool, PoolClient} from 'pg';

type JsonMap = Record<string, {h2: number; ch4: number; h2s?: number}>;

function mustEnv(name: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Missing ${name} in environment variables.`);
  }
  return trimmed;
}

async function tableExists(client: PoolClient, tableName: string): Promise<boolean> {
  const result = await client.query(
    `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = $1
    ) AS exists
    `,
    [tableName]
  );
  return Boolean(result.rows[0]?.exists);
}

function normalizePointsJson(value: unknown): JsonMap {
  let source = value;
  if (typeof source === 'string') {
    try {
      source = JSON.parse(source);
    } catch {
      return {};
    }
  }

  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return {};
  }

  const entries: Array<[number, {h2: number; ch4: number; h2s?: number}]> = [];
  for (const [minuteKey, payload] of Object.entries(source as Record<string, unknown>)) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) continue;
    const minute = Number(minuteKey);
    if (!Number.isFinite(minute) || minute < 0) continue;

    const h2 = Number((payload as any).h2);
    const ch4 = Number((payload as any).ch4);
    if (!Number.isFinite(h2) || h2 < 0 || !Number.isFinite(ch4) || ch4 < 0) continue;

    const rawH2s = (payload as any).h2s;
    const h2s =
      rawH2s === undefined || rawH2s === null
        ? undefined
        : Number(rawH2s);
    if (h2s !== undefined && (!Number.isFinite(h2s) || h2s < 0)) continue;

    entries.push([
      minute,
      {
        h2,
        ch4,
        ...(h2s !== undefined ? {h2s} : {}),
      },
    ]);
  }

  entries.sort((a, b) => a[0] - b[0]);
  const normalized: JsonMap = {};
  for (const [minute, payload] of entries) {
    normalized[String(minute)] = payload;
  }
  return normalized;
}

function normalizeDateKey(value: unknown): string {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
    throw new Error(`Invalid date string: ${trimmed}`);
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  throw new Error(`Invalid date value: ${String(value)}`);
}

async function main() {
  const legacyDatabaseUrl = mustEnv(
    'LEGACY_DATABASE_URL (or DATABASE_URL)',
    process.env.LEGACY_DATABASE_URL ?? process.env.DATABASE_URL
  );
  const mongoUri = mustEnv('MONGODB_URI', process.env.MONGODB_URI);
  const mongoDbName = (process.env.MONGODB_DB_NAME ?? 'sibolytics').trim() || 'sibolytics';

  const pgPool = new Pool({connectionString: legacyDatabaseUrl});
  const mongoClient = new MongoClient(mongoUri);

  await mongoClient.connect();
  const db = mongoClient.db(mongoDbName);

  const usersCollection = db.collection('users');
  const sessionsCollection = db.collection('sessions');
  const onboardingProfilesCollection = db.collection('onboarding_profiles');
  const symptomEntriesCollection = db.collection('symptom_entries');
  const foodLogEntriesCollection = db.collection('food_log_entries');
  const breathTestRunsCollection = db.collection('breath_test_runs');

  await usersCollection.createIndex({email: 1}, {unique: true, name: 'uq_users_email'});
  await sessionsCollection.createIndex({tokenHash: 1}, {unique: true, name: 'uq_sessions_token_hash'});
  await sessionsCollection.createIndex({expiresAt: 1}, {expireAfterSeconds: 0, name: 'idx_sessions_expires_ttl'});
  await onboardingProfilesCollection.createIndex({userId: 1}, {unique: true, name: 'uq_onboarding_user'});
  await symptomEntriesCollection.createIndex({userId: 1, entryDate: -1, updatedAt: -1}, {name: 'idx_symptom_entries_user_date'});
  await symptomEntriesCollection.createIndex({userId: 1, entryDate: 1}, {unique: true, name: 'uq_symptom_entries_user_date'});
  await foodLogEntriesCollection.createIndex({userId: 1, createdAt: -1}, {name: 'idx_food_log_entries_user_created'});
  await breathTestRunsCollection.createIndex({userId: 1, testDate: -1, createdAt: -1}, {name: 'idx_breath_test_runs_user_date_created'});

  const client = await pgPool.connect();
  try {
    if (!(await tableExists(client, 'users'))) {
      throw new Error('Source PostgreSQL table "users" does not exist.');
    }

    const users = await client.query(
      `
      SELECT id, email, name, password_hash, has_completed_onboarding, email_verified, created_at, updated_at
      FROM users
      `
    );
    if (users.rows.length > 0) {
      await usersCollection.bulkWrite(
        users.rows.map((row) => ({
          replaceOne: {
            filter: {id: String(row.id)},
            replacement: {
              id: String(row.id),
              email: String(row.email),
              name: String(row.name),
              passwordHash: String(row.password_hash),
              hasCompletedOnboarding: Boolean(row.has_completed_onboarding),
              emailVerified: Boolean(row.email_verified),
              createdAt: new Date(row.created_at),
              updatedAt: new Date(row.updated_at),
            },
            upsert: true,
          },
        })),
        {ordered: false}
      );
    }

    if (await tableExists(client, 'sessions')) {
      const sessions = await client.query(
        `
        SELECT token_hash, user_id, expires_at, created_at
        FROM sessions
        `
      );

      if (sessions.rows.length > 0) {
        await sessionsCollection.bulkWrite(
          sessions.rows.map((row) => ({
            replaceOne: {
              filter: {tokenHash: String(row.token_hash)},
              replacement: {
                tokenHash: String(row.token_hash),
                userId: String(row.user_id),
                expiresAt: new Date(row.expires_at),
                createdAt: new Date(row.created_at),
              },
              upsert: true,
            },
          })),
          {ordered: false}
        );
      }
    }

    if (await tableExists(client, 'onboarding_profiles')) {
      const onboardingProfiles = await client.query(
        `
        SELECT user_id, data, created_at, updated_at
        FROM onboarding_profiles
        `
      );

      if (onboardingProfiles.rows.length > 0) {
        await onboardingProfilesCollection.bulkWrite(
          onboardingProfiles.rows.map((row) => ({
            replaceOne: {
              filter: {userId: String(row.user_id)},
              replacement: {
                userId: String(row.user_id),
                data: (row.data ?? {}) as Record<string, unknown>,
                createdAt: new Date(row.created_at),
                updatedAt: new Date(row.updated_at),
              },
              upsert: true,
            },
          })),
          {ordered: false}
        );
      }
    }

    if (await tableExists(client, 'symptom_entries')) {
      const symptoms = await client.query(
        `
        SELECT id, user_id, entry_date::text AS entry_date, pain, stress, sleep, stool, bloating, diarrhea, energy, overall_gut, notes, created_at, updated_at
        FROM symptom_entries
        `
      );

      if (symptoms.rows.length > 0) {
        await symptomEntriesCollection.bulkWrite(
          symptoms.rows.map((row) => ({
            replaceOne: {
              filter: {id: String(row.id)},
              replacement: {
                id: String(row.id),
                userId: String(row.user_id),
                entryDate: normalizeDateKey(row.entry_date),
                pain: Number(row.pain),
                stress: Number(row.stress),
                sleep: Number(row.sleep),
                stool: Number(row.stool),
                bloating: Number(row.bloating),
                diarrhea: Number(row.diarrhea),
                energy: Number(row.energy),
                overallGut: Number(row.overall_gut),
                notes: String(row.notes ?? ''),
                createdAt: new Date(row.created_at),
                updatedAt: new Date(row.updated_at),
              },
              upsert: true,
            },
          })),
          {ordered: false}
        );
      }
    }

    if (await tableExists(client, 'food_log_entries')) {
      const foods = await client.query(
        `
        SELECT id, user_id, name, amount, status, notes, created_at
        FROM food_log_entries
        `
      );

      if (foods.rows.length > 0) {
        await foodLogEntriesCollection.bulkWrite(
          foods.rows.map((row) => ({
            replaceOne: {
              filter: {id: String(row.id)},
              replacement: {
                id: String(row.id),
                userId: String(row.user_id),
                name: String(row.name),
                amount: String(row.amount),
                status: String(row.status),
                notes: String(row.notes ?? ''),
                createdAt: new Date(row.created_at),
              },
              upsert: true,
            },
          })),
          {ordered: false}
        );
      }
    }

    if (await tableExists(client, 'breath_test_runs')) {
      const breathTests = await client.query(
        `
        SELECT id, user_id, test_date::text AS test_date, substrate, units, notes, file_name, points_json, created_at
        FROM breath_test_runs
        `
      );

      if (breathTests.rows.length > 0) {
        await breathTestRunsCollection.bulkWrite(
          breathTests.rows.map((row) => {
            const pointsJson = normalizePointsJson(row.points_json);
            return {
              replaceOne: {
                filter: {id: String(row.id)},
                replacement: {
                  id: String(row.id),
                  userId: String(row.user_id),
                  testDate: row.test_date ? normalizeDateKey(row.test_date) : undefined,
                  substrate: String(row.substrate ?? 'unknown'),
                  units: String(row.units ?? 'ppm'),
                  notes: String(row.notes ?? ''),
                  fileName: String(row.file_name ?? ''),
                  pointsJson,
                  pointsJsonCanonical: JSON.stringify(pointsJson),
                  createdAt: new Date(row.created_at),
                },
                upsert: true,
              },
            };
          }),
          {ordered: false}
        );
      }
    } else {
      console.warn('Skipping breath test migration: source table "breath_test_runs" not found.');
    }

    console.log('PostgreSQL -> MongoDB migration completed successfully.');
  } finally {
    client.release();
    await pgPool.end();
    await mongoClient.close();
  }
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
