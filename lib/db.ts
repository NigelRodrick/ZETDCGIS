import { openDatabaseSync, type SQLiteDatabase } from "expo-sqlite";

let db: SQLiteDatabase | null = null;

export type ObservationListItem = {
  id: number;
  title: string;
  notes: string;
  siteId: string;
  featureType: string;
  condition: string;
  collectorName: string;
  createdAt: string;
  latitude: number | null;
  longitude: number | null;
};

export type ObservationMapPin = {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  namespace: "observation" | "meter";
};

export type NewObservation = {
  title: string;
  notes: string;
  siteId: string;
  featureType: string;
  condition: string;
  collectorName: string;
  location?: { latitude: number; longitude: number } | null;
};

/** Matches Epicollect5 project southern-region-meters, form “METERS” (export). */
export type MeterReadingItem = {
  id: number;
  meterno: string;
  phases: string;
  mcbsize: string;
  comments: string;
  createdAt: string;
  latitude: number | null;
  longitude: number | null;
  sourceProject: string;
};

export type NewMeterReading = {
  meterno: string;
  phases: string;
  mcbsize: string;
  comments: string;
  location?: { latitude: number; longitude: number } | null;
};

function migrateObservationsTable(d: SQLiteDatabase) {
  const cols = d.getAllSync<{ name: string }>(
    "PRAGMA table_info(observations)"
  );
  const names = new Set(cols.map((c) => c.name));
  if (!names.has("latitude")) {
    d.execSync("ALTER TABLE observations ADD COLUMN latitude REAL;");
  }
  if (!names.has("longitude")) {
    d.execSync("ALTER TABLE observations ADD COLUMN longitude REAL;");
  }
  if (!names.has("site_id")) {
    d.execSync("ALTER TABLE observations ADD COLUMN site_id TEXT;");
  }
  if (!names.has("feature_type")) {
    d.execSync("ALTER TABLE observations ADD COLUMN feature_type TEXT;");
  }
  if (!names.has("condition")) {
    d.execSync("ALTER TABLE observations ADD COLUMN condition TEXT;");
  }
  if (!names.has("collector_name")) {
    d.execSync("ALTER TABLE observations ADD COLUMN collector_name TEXT;");
  }
}

/** Schema aligned with Epicollect questions METERNO, PHASES, MCBSIZE, COMMENTS, LOCATION. */
function ensureMeterReadingsEpicollect(d: SQLiteDatabase) {
  const tables = d.getAllSync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='meter_readings'"
  );
  if (tables.length === 0) {
    d.execSync(`
      CREATE TABLE meter_readings (
        id INTEGER PRIMARY KEY NOT NULL,
        meterno TEXT NOT NULL,
        phases TEXT NOT NULL,
        mcbsize TEXT NOT NULL,
        comments TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        source_project TEXT
      );
    `);
    return;
  }
  const cols = d.getAllSync<{ name: string }>(
    "PRAGMA table_info(meter_readings)"
  );
  const names = new Set(cols.map((c) => c.name));
  if (names.has("meterno")) {
    return;
  }
  if (!names.has("meter_number")) {
    d.execSync("DROP TABLE meter_readings;");
    ensureMeterReadingsEpicollect(d);
    return;
  }
  d.execSync(`
    CREATE TABLE meter_readings_ec5 (
      id INTEGER PRIMARY KEY NOT NULL,
      meterno TEXT NOT NULL,
      phases TEXT NOT NULL,
      mcbsize TEXT NOT NULL,
      comments TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      created_at TEXT NOT NULL,
      source_project TEXT
    );
  `);
  d.execSync(`
    INSERT INTO meter_readings_ec5 (
      id, meterno, phases, mcbsize, comments, latitude, longitude, created_at, source_project
    )
    SELECT
      id,
      meter_number,
      'RED',
      '',
      trim(
        COALESCE(notes, '') ||
        CASE WHEN COALESCE(reading_value, '') != ''
          THEN ' | legacy reading: ' || reading_value || ' ' || COALESCE(reading_unit, '')
          ELSE '' END ||
        CASE WHEN COALESCE(location_description, '') != ''
          THEN ' | ' || location_description
          ELSE '' END ||
        CASE WHEN COALESCE(service_account, '') != ''
          THEN ' | account: ' || service_account
          ELSE '' END ||
        CASE WHEN COALESCE(collector_name, '') != ''
          THEN ' | collector: ' || collector_name
          ELSE '' END ||
        CASE WHEN COALESCE(meter_type, '') != ''
          THEN ' | legacy type: ' || meter_type
          ELSE '' END
      ),
      latitude,
      longitude,
      created_at,
      COALESCE(source_project, 'southern-region-meters')
    FROM meter_readings;
  `);
  d.execSync("DROP TABLE meter_readings;");
  d.execSync("ALTER TABLE meter_readings_ec5 RENAME TO meter_readings;");
}

function database(): SQLiteDatabase {
  if (!db) {
    db = openDatabaseSync("mobilegis.db");
    db.execSync(`
      CREATE TABLE IF NOT EXISTS observations (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);
    migrateObservationsTable(db);
    ensureMeterReadingsEpicollect(db);
  }
  return db;
}

export async function insertObservation(data: NewObservation): Promise<void> {
  const d = database();
  const lat = data.location?.latitude ?? null;
  const lon = data.location?.longitude ?? null;
  d.runSync(
    `INSERT INTO observations (
      title, notes, site_id, feature_type, condition, collector_name,
      latitude, longitude
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.notes,
      data.siteId || "",
      data.featureType || "",
      data.condition || "",
      data.collectorName || "",
      lat,
      lon,
    ]
  );
}

const clampLimit = (n: number) =>
  Math.min(100_000, Math.max(1, Math.floor(n)));

export async function listObservations(
  limit = 50
): Promise<ObservationListItem[]> {
  const d = database();
  const cap = clampLimit(limit);
  const rows = d.getAllSync<{
    id: number;
    title: string;
    notes: string | null;
    site_id: string | null;
    feature_type: string | null;
    condition: string | null;
    collector_name: string | null;
    created_at: string;
    latitude: number | null;
    longitude: number | null;
  }>(
    `SELECT id, title, notes, site_id, feature_type, condition, collector_name,
            created_at, latitude, longitude
     FROM observations ORDER BY id DESC LIMIT ${cap}`
  );
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    notes: r.notes ?? "",
    siteId: r.site_id ?? "",
    featureType: r.feature_type ?? "",
    condition: r.condition ?? "",
    collectorName: r.collector_name ?? "",
    createdAt: r.created_at,
    latitude: r.latitude ?? null,
    longitude: r.longitude ?? null,
  }));
}

export async function deleteObservation(id: number): Promise<void> {
  const d = database();
  d.runSync("DELETE FROM observations WHERE id = ?", [id]);
}

export async function insertMeterReading(data: NewMeterReading): Promise<void> {
  const d = database();
  const lat = data.location?.latitude ?? null;
  const lon = data.location?.longitude ?? null;
  d.runSync(
    `INSERT INTO meter_readings (
      meterno, phases, mcbsize, comments, latitude, longitude, source_project
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.meterno,
      data.phases,
      data.mcbsize,
      data.comments,
      lat,
      lon,
      "southern-region-meters",
    ]
  );
}

export async function listMeterReadings(
  limit = 50
): Promise<MeterReadingItem[]> {
  const d = database();
  const cap = clampLimit(limit);
  const rows = d.getAllSync<{
    id: number;
    meterno: string;
    phases: string;
    mcbsize: string;
    comments: string;
    created_at: string;
    latitude: number | null;
    longitude: number | null;
    source_project: string | null;
  }>(
    `SELECT id, meterno, phases, mcbsize, comments, created_at,
            latitude, longitude, source_project
     FROM meter_readings ORDER BY id DESC LIMIT ${cap}`
  );
  return rows.map((r) => ({
    id: r.id,
    meterno: r.meterno,
    phases: r.phases,
    mcbsize: r.mcbsize,
    comments: r.comments,
    createdAt: r.created_at,
    latitude: r.latitude ?? null,
    longitude: r.longitude ?? null,
    sourceProject: r.source_project ?? "southern-region-meters",
  }));
}

export async function deleteMeterReading(id: number): Promise<void> {
  const d = database();
  d.runSync("DELETE FROM meter_readings WHERE id = ?", [id]);
}

export async function listMeterPins(
  limit = 500
): Promise<ObservationMapPin[]> {
  const d = database();
  const cap = clampLimit(limit);
  const rows = d.getAllSync<{
    id: number;
    meterno: string;
    latitude: number | null;
    longitude: number | null;
  }>(
    `SELECT id, meterno, latitude, longitude FROM meter_readings
     WHERE latitude IS NOT NULL AND longitude IS NOT NULL
     ORDER BY id DESC LIMIT ${cap}`
  );
  return rows
    .filter(
      (r): r is typeof r & { latitude: number; longitude: number } =>
        r.latitude != null && r.longitude != null
    )
    .map((r) => ({
      id: r.id,
      title: r.meterno.trim() || `Meter #${r.id}`,
      latitude: r.latitude,
      longitude: r.longitude,
      namespace: "meter" as const,
    }));
}

export async function listObservationPins(
  limit = 500
): Promise<ObservationMapPin[]> {
  const d = database();
  const cap = clampLimit(limit);
  const rows = d.getAllSync<{
    id: number;
    title: string;
    latitude: number | null;
    longitude: number | null;
  }>(
    `SELECT id, title, latitude, longitude FROM observations WHERE latitude IS NOT NULL AND longitude IS NOT NULL ORDER BY id DESC LIMIT ${cap}`
  );
  return rows
    .filter(
      (r): r is typeof r & { latitude: number; longitude: number } =>
        r.latitude != null && r.longitude != null
    )
    .map((r) => ({
      id: r.id,
      title: r.title,
      latitude: r.latitude,
      longitude: r.longitude,
      namespace: "observation" as const,
    }));
}
