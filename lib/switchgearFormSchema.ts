export const SWITCHGEAR_TYPES = [
  "CB",
  "ISOLATOR",
  "SURGE ARRESTOR",
  "HOT LINE TAP",
  "AUTO DISCONNECT",
  "RMU",
  "AUTO RECLOSER",
  "SECTIONALISER",
  "FUSE LINKS",
  "SOLID LINKS",
  "METERING UNIT",
] as const;

export const SWITCHGEAR_CONSTRUCTION_TYPES = [
  "GIS",
  "METAL CLAD",
  "OUTDOOR UNENCLOSED",
  "OUTDOOR ENCLOSED",
] as const;

export const SWITCHGEAR_MCO_OPTIONS = [
  "ROCKING ARM",
  "CENTER ROTATING",
  "WITHDRAWABLE",
  "CONCEALED",
] as const;

export const SWITCHGEAR_OP_TYPES = ["LINKSTICK", "AUTO", "HANDLE"] as const;

export const SWITCHGEAR_VOLTAGES = [
  "72KV",
  "96KV",
  "120KV",
  "145KV",
  "170KV",
  "362KV",
  "420KV",
  "OTHER",
] as const;

export const SWITCHGEAR_INSULATION_TYPES = [
  "OIL",
  "SF6",
  "COMPRESSED AIR",
  "AIR BLAST",
  "VACUUM",
  "SILICON",
] as const;

export const SWITCHGEAR_CONTROL_VOLTAGES = ["30", "50", "110", "220", "N/A"] as const;

export const SWITCHGEAR_MOTOR_OST_OPTIONS = ["AC", "DC", "UNIVERSAL", "N/A"] as const;

export const SWITCHGEAR_MOTOR_VOLTAGES = ["30", "50", "110", "220", "N/A"] as const;

export const SWITCHGEAR_AUX_VOLTAGES = [
  "30",
  "48",
  "50",
  "110",
  "220",
  "230",
  "240",
  "250",
  "N/A",
] as const;

export const SWITCHGEAR_AUTO_RECLOSING_TYPES = ["INHERENT", "EXTERNAL", "NONE"] as const;

export const SWITCHGEAR_OPERATION_STATUSES = ["CLOSED", "OPEN"] as const;

export const SWITCHGEAR_OC_INSTALLED_OPTIONS = ["YES", "NO"] as const;

export const SWITCHGEAR_BAY_TYPES = [
  "FEEDER",
  "INCOMER",
  "TRANSFORMER",
  "BUS COUPLER",
  "MAIN BUSBAR",
  "RESERVE BUSBAR",
  "BUS SECTION",
  "REACTOR BANK",
  "CAPACITOR BANK",
  "SVC",
] as const;

export const SWITCHGEAR_USE_OPTIONS = [
  "BYPASS",
  "LINE",
  "BACKUP",
  "BREAKER",
  "TRANSFORMER LV",
  "TRANSFORMER HV",
  "BUS RISER",
  "BUS COUPLER",
  "TIEBAR",
  "RESERVE BUSBAR",
  "MAIN BUSBAR",
  "SVC",
  "REACTOR",
] as const;
