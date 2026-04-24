export const POLE_VOLTAGES = [
  "0.4",
  "11",
  "19",
  "33",
  "66",
  "88",
  "110",
  "380",
] as const;

export const POLE_MATERIAL_TYPES = [
  "WOOD",
  "CONCRETE",
  "RAIL",
  "TUBULAR STEEL",
] as const;

export const POLE_POSITION_TYPES = [
  "ONE POLE TERMINAL",
  "SINGLE POLE STRAIN 2 WAY",
  "3 WAY STRAIN ONE POLE",
  "3 POLE STRAIN",
  "4 WAY STRAIN ONE POLE",
  "H POLE STRAIN",
  "H POLE TERMINAL",
  "H POLE T-OFF",
  "INTERMEDIATE SINGLE POLE",
  "INTERMEDIATE H POLE",
  "LATTICE STRAIN",
  "SHORT LEG T-OFF",
  "SWING ANGLE",
  "VERTICAL STRAIN",
  "CROSS SHACKLE",
  "COMBINED CROSS AND TEE",
  "STAND ALONE",
  "SINGLE POLE T-OFF",
  "SINGLE PIN ANGLE",
  "DOUBLE PIN ANGLE",
] as const;

export const POLE_CONSTRUCTION_TYPES = [
  "LT 1",
  "LT 2",
  "LT 3",
  "LT 4",
  "LT 5",
  "LT 6",
  "LT 7",
  "LT 8",
  "LT 9",
  "LT 10",
  "LT 11",
  "11/1",
  "11/2",
  "11/3",
  "11/4",
  "11/5",
  "11/6",
  "11/7",
  "11/8",
  "11/9",
  "11/10",
  "11/11",
  "11/12",
  "11/13",
  "11/14",
  "11/15",
  "11/16",
  "11/17",
  "11/18",
  "11/19",
  "11/20",
  "11/21",
  "11/22",
  "11/23",
  "11/24",
  "11/25",
  "11/26",
  "11/27",
  "11/28",
  "11/29",
  "11/30",
  "33/10",
  "33/11",
  "33/12",
  "33/13",
  "33/14",
  "33/15",
  "33/16",
  "33/17",
  "33/6",
  "SWER",
] as const;

export const POLE_CROSS_ARMS = [
  "WOOD",
  "CHANNEL",
  "BOX-CHANNEL",
  "WISHBONE",
  "WOOD AND CHANNEL",
  "WOOD AND BOX CHANNEL",
  "WISHBONE AND CHANNEL",
  "WISHBONE AND BOX CHANNEL",
] as const;

export const POLE_EARTH_WIRE_TYPES = ["COPPER", "SWG"] as const;
export const POLE_EARTH_WIRE_SIZES = ["7/14 SWG", "16mm COPPER"] as const;
export const POLE_CONDUCTOR_TYPES = ["HDA", "SCA"] as const;
export const POLE_INSULATOR_MATERIALS = ["PORCELAIN", "POLYMER", "GLASS"] as const;

export const POLE_INSULATOR_TYPES = [
  "DISC",
  "POLYMER",
  "PIN",
  "PIN AND DISC",
  "BOBBIN",
  "SPINGLE",
  "ROD",
] as const;

export const POLE_STAY_TYPES = [
  "FLYING",
  "GROUND",
  "STRUT",
  "STRUT AND GROUND",
  "FLYING AND GROUND",
  "NONE",
] as const;

export const POLE_STAY_WIRE_GAUGES = ["7/8", "7/10", "7/12", "7/14", "19/10"] as const;
