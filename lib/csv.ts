function escapeCsvCell(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export type CsvObservation = {
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

export type CsvMeterEntry = {
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

export function meterEntriesToCsv(rows: CsvMeterEntry[]): string {
  const header =
    "id,meterno,phases,mcbsize,comments,created_at,latitude,longitude,source_project";
  const lines = rows.map((r) =>
    [
      String(r.id),
      escapeCsvCell(r.meterno),
      escapeCsvCell(r.phases),
      escapeCsvCell(r.mcbsize),
      escapeCsvCell(r.comments),
      escapeCsvCell(r.createdAt),
      r.latitude != null ? String(r.latitude) : "",
      r.longitude != null ? String(r.longitude) : "",
      escapeCsvCell(r.sourceProject),
    ].join(",")
  );
  return [header, ...lines].join("\r\n");
}

export function observationsToCsv(rows: CsvObservation[]): string {
  const header =
    "id,title,site_id,feature_type,condition,collector_name,notes,created_at,latitude,longitude";
  const lines = rows.map((r) =>
    [
      String(r.id),
      escapeCsvCell(r.title),
      escapeCsvCell(r.siteId),
      escapeCsvCell(r.featureType),
      escapeCsvCell(r.condition),
      escapeCsvCell(r.collectorName),
      escapeCsvCell(r.notes),
      escapeCsvCell(r.createdAt),
      r.latitude != null ? String(r.latitude) : "",
      r.longitude != null ? String(r.longitude) : "",
    ].join(",")
  );
  return [header, ...lines].join("\r\n");
}
