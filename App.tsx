import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TemplateType = "meter" | "pole" | "switchgear" | "transformer";
type MeterViewMode = "collect" | "view";
type AssetViewMode = "collect" | "view";

type MeterSchema = {
  depot: string;
  district: string;
  region: string;
  assetno: string;
  createdon: string;
  createdby: string;
  modifiedon: string;
  modifiedby: string;
  comments: string;
  status: string;
  districtid: string;
  wardid: string;
  provinceid: string;
  id: string;
  trregion: string;
  status_account: string;
  meterno: string;
  accountno: string;
  conductorid: string;
  priority: string;
  tariff: string;
  make: string;
  mcbsize: string;
  installedon: string;
  meteringtype: string;
  meterconstant: string;
  ctratio: string;
  contractedcapacity: string;
  phase: string;
  customername: string;
  phone: string;
  billaddress: string;
  email: string;
  servicevoltage: string;
  service_point: string;
  chk: string;
  suburbid: string;
  meterid: string;
  geom2d: string;
  geom3d: string;
  lat: string;
  lon: string;
  sourcefeeder_mv: string;
  sourcefeeder_11: string;
  sourcefeeder_19: string;
  sourcefeeder_33: string;
  sourcefeeder_66: string;
  sourcefeeder_88: string;
  sourcefeeder_132: string;
  sourcesub_11: string;
  sourcesub_19: string;
  sourcesub_33: string;
  sourcesub_66: string;
  sourcesub_88: string;
  sourcesub_132: string;
  connectingto: string;
  alt: string;
  is_smartmeter: string;
  simno: string;
  modemno: string;
  ip_address: string;
  network_cell: string;
  smart_prepaid_mode: string;
};

type PoleSchema = {
  id: string;
  poles: string; // 1_POLES
  feeder_name: string; // 2_FEEDER_NAME
  voltage: string; // 3_VOLTAGE
  material_type: string; // 4_MATERIAL_TYPE
  position_type: string; // 5_POSITION_TYPE
  construction_type: string; // 6_CONSTRUCTION_TYPE
  cross_arm: string; // 7_CROSS_ARM
  earth_wire_type: string; // 8_EARTH_WIRE_TYPE
  earth_wire_size: string; // 9_EARTH_WIRE_SIZE
  conductor_size: string; // 10_CONDUCTOR_SIZE
  conductor_type: string; // 11_CONDUCTOR_TYPE
  insulator_material: string; // 12_INSULATOR_MATERIA
  insulator_type: string; // 13_INSULATOR_TYPE
  stay_num: string; // 14_STAY_NUM
  stay_type: string; // 15_STAY_TYPE
  stay_wire_gauge: string; // 16_STAY_WIRE_GAUGE
  comments: string; // 17_COMMENTS
  location: string; // LOCATION
  lat: string;
  lon: string;
  alt: string;
  createdon: string;
  createdby: string;
  modifiedon: string;
  modifiedby: string;
};

type SwitchgearSchema = {
  id: string;
  switchgears: string; // 1_SWITCHGEARS
  serial_no: string; // 2_SERIAL_NO
  make: string; // 3_MAKE
  model: string; // 4_MODEL
  switch_gear_type: string; // 5_SWITCH_GEAR_TYPE
  construction_type: string; // 6_CONSTRUCTION_TYPE
  mco: string; // 7_MCO
  busbars_no: string; // 8_BUSBARS_NO
  op_type: string; // 9_OP_TYPE
  standard: string; // 10_STANDARD
  voltage: string; // 11_VOLTAGE
  insulation_interrupting: string; // 12_INSULATIONINTERRU
  rated_cc: string; // 13_RATED_CC
  rated_mc: string; // 14_RATED_MC
  rated_scwt: string; // 15_RATED_SCWT
  rated_stwc: string; // 16_RATED_STWC
  control_voltage: string; // 17_CONTROL_VOLTAGE
  motor_ost: string; // 18_MOTOR_OST
  motor_voltage: string; // 19_MOTOR_VOLTAGE
  aux_voltage: string; // 20_AUX_VOLTAGE
  possible_count_setting: string; // 21_POSSIBLE_COUNT_SE
  auto_reclosing_type: string; // 22_AUTO_RECLOSING_TY
  duty_cycle: string; // 23_DUTY_CYCLE
  year_of_manufacture: string; // 24_YEAR_OF_MANUFACTU
  net_mass: string; // 25_NET_MASS
  normal_operation_status: string; // 26_NORMAL_OPERATION_
  oc_installed: string; // 27_OC_INSTALLED
  asset_no: string; // 28_ASSET_NO
  bay_type: string; // 29_BAY_TYPE
  use: string; // 30_USE
  trip_coils_no: string; // 31_TRIP_COILS_NO
  bil: string; // 32_BIL
  feeder_code: string; // 33_FEEDER_CODE
  switch_gear_num: string; // 34_SWITCH_GEAR_NUM
  status: string; // 35_STATUS
  comments: string; // 36_COMMENTS
  location: string; // 37_LOCATION
  lat: string;
  lon: string;
  alt: string;
  createdon: string;
  createdby: string;
  modifiedon: string;
  modifiedby: string;
};

type TransformerSchema = {
  id: string;
  transformers: string; // 1_TRANSFORMERS
  feeder: string; // 2_FEEDER
  transformer_point_name: string; // 3_TRANSFORMER_POINT_
  primary_substation: string; // 4_PRIMARY_SUBSTATION
  serial_num: string; // 5_SERIAL_NUM
  high_voltage: string; // 6_HIGH_VOLTAGE
  low_volatge: string; // 7_LOW_VOLATGE
  capacity: string; // 8_CAPACITY
  mounting: string; // 9_MOUNTING
  make: string; // 10_MAKE
  trans_insulator: string; // 11_TRANS_INSULATOR
  installation_year: string; // 12_INSTALLATION_YEAR
  comments: string; // 13_COMMENTS
  location: string; // 14_LOCATION
  lat: string;
  lon: string;
  alt: string;
  createdon: string;
  createdby: string;
  modifiedon: string;
  modifiedby: string;
};

const fullSchemaTemplate: MeterSchema = {
  depot: "",
  district: "",
  region: "",
  assetno: "",
  createdon: "",
  createdby: "",
  modifiedon: "",
  modifiedby: "",
  comments: "",
  status: "",
  districtid: "",
  wardid: "",
  provinceid: "",
  id: "",
  trregion: "",
  status_account: "",
  meterno: "",
  accountno: "",
  conductorid: "",
  priority: "",
  tariff: "",
  make: "",
  mcbsize: "",
  installedon: "",
  meteringtype: "",
  meterconstant: "",
  ctratio: "",
  contractedcapacity: "",
  phase: "",
  customername: "",
  phone: "",
  billaddress: "",
  email: "",
  servicevoltage: "",
  service_point: "",
  chk: "",
  suburbid: "",
  meterid: "",
  geom2d: "",
  geom3d: "",
  lat: "",
  lon: "",
  sourcefeeder_mv: "",
  sourcefeeder_11: "",
  sourcefeeder_19: "",
  sourcefeeder_33: "",
  sourcefeeder_66: "",
  sourcefeeder_88: "",
  sourcefeeder_132: "",
  sourcesub_11: "",
  sourcesub_19: "",
  sourcesub_33: "",
  sourcesub_66: "",
  sourcesub_88: "",
  sourcesub_132: "",
  connectingto: "",
  alt: "",
  is_smartmeter: "",
  simno: "",
  modemno: "",
  ip_address: "",
  network_cell: "",
  smart_prepaid_mode: ""
};

const poleSchemaTemplate: PoleSchema = {
  id: "",
  poles: "",
  feeder_name: "",
  voltage: "",
  material_type: "",
  position_type: "",
  construction_type: "",
  cross_arm: "",
  earth_wire_type: "",
  earth_wire_size: "",
  conductor_size: "",
  conductor_type: "",
  insulator_material: "",
  insulator_type: "",
  stay_num: "",
  stay_type: "",
  stay_wire_gauge: "",
  comments: "",
  location: "",
  lat: "",
  lon: "",
  alt: "",
  createdon: "",
  createdby: "",
  modifiedon: "",
  modifiedby: ""
};

const switchgearSchemaTemplate: SwitchgearSchema = {
  id: "",
  switchgears: "",
  serial_no: "",
  make: "",
  model: "",
  switch_gear_type: "",
  construction_type: "",
  mco: "",
  busbars_no: "",
  op_type: "",
  standard: "",
  voltage: "",
  insulation_interrupting: "",
  rated_cc: "",
  rated_mc: "",
  rated_scwt: "",
  rated_stwc: "",
  control_voltage: "",
  motor_ost: "",
  motor_voltage: "",
  aux_voltage: "",
  possible_count_setting: "",
  auto_reclosing_type: "",
  duty_cycle: "",
  year_of_manufacture: "",
  net_mass: "",
  normal_operation_status: "",
  oc_installed: "",
  asset_no: "",
  bay_type: "",
  use: "",
  trip_coils_no: "",
  bil: "",
  feeder_code: "",
  switch_gear_num: "",
  status: "",
  comments: "",
  location: "",
  lat: "",
  lon: "",
  alt: "",
  createdon: "",
  createdby: "",
  modifiedon: "",
  modifiedby: ""
};

const transformerSchemaTemplate: TransformerSchema = {
  id: "",
  transformers: "",
  feeder: "",
  transformer_point_name: "",
  primary_substation: "",
  serial_num: "",
  high_voltage: "",
  low_volatge: "",
  capacity: "",
  mounting: "",
  make: "",
  trans_insulator: "",
  installation_year: "",
  comments: "",
  location: "",
  lat: "",
  lon: "",
  alt: "",
  createdon: "",
  createdby: "",
  modifiedon: "",
  modifiedby: ""
};

type MeterRecord = {
  localId: string;
  capturedAt: string;
  template: TemplateType;
  payload: MeterSchema | PoleSchema | SwitchgearSchema | TransformerSchema;
  uploaded?: boolean;
  uploadedAt?: string;
};

const initialForm: MeterSchema = {
  ...fullSchemaTemplate,
  status: "new",
  meteringtype: "postpaid",
  smart_prepaid_mode: "postpaid"
};

const primaryFields: { key: keyof MeterSchema; label: string; keyboard?: "default" | "numeric" }[] = [
  { key: "meterno", label: "Meter Number *" },
  { key: "accountno", label: "Account Number *" },
  { key: "customername", label: "Customer Name" },
  { key: "chk", label: "Current Reading *", keyboard: "numeric" },
  { key: "lat", label: "Latitude", keyboard: "numeric" },
  { key: "lon", label: "Longitude", keyboard: "numeric" },
  { key: "phone", label: "Phone" },
  { key: "tariff", label: "Tariff" },
  { key: "phase", label: "Phase" },
  { key: "status", label: "Status" },
  { key: "comments", label: "Comments" },
  { key: "network_cell", label: "Network Cell" }
];

const optionalFields: { key: keyof MeterSchema; label: string }[] = [
  { key: "depot", label: "Depot" },
  { key: "district", label: "District" },
  { key: "region", label: "Region" },
  { key: "districtid", label: "District ID" },
  { key: "wardid", label: "Ward ID" },
  { key: "provinceid", label: "Province ID" },
  { key: "sourcefeeder_11", label: "Source Feeder 11" },
  { key: "sourcefeeder_33", label: "Source Feeder 33" },
  { key: "sourcesub_11", label: "Source Sub 11" },
  { key: "sourcesub_33", label: "Source Sub 33" },
  { key: "simno", label: "SIM No" },
  { key: "modemno", label: "Modem No" }
];

const poleFields: { key: keyof PoleSchema; label: string; keyboard?: "default" | "numeric" }[] = [
  { key: "poles", label: "Poles *" },
  { key: "feeder_name", label: "Feeder Name" },
  { key: "voltage", label: "Voltage: 0.4,11,19,33,66,88,110,380" },
  { key: "material_type", label: "Material Type: WOOD, CONCRETE, RAIL, TUBULAR STEEL" },
  { key: "position_type", label: "Position Type" },
  { key: "construction_type", label: "Construction Type" },
  { key: "cross_arm", label: "Cross Arm" },
  { key: "earth_wire_type", label: "Earth Wire Type: COPPER, SWG" },
  { key: "earth_wire_size", label: "Earth Wire Size: 7/14 SWG, 16mm COPPER" },
  { key: "conductor_size", label: "Conductor Size" },
  { key: "conductor_type", label: "Conductor Type: HDA, SCA" },
  { key: "insulator_material", label: "Insulator Material" },
  { key: "insulator_type", label: "Insulator Type" },
  { key: "stay_num", label: "Stay Number", keyboard: "numeric" },
  { key: "stay_type", label: "Stay Type" },
  { key: "stay_wire_gauge", label: "Stay Wire Gauge" },
  { key: "comments", label: "Comments" },
  { key: "location", label: "Location" },
  { key: "lat", label: "Latitude", keyboard: "numeric" },
  { key: "lon", label: "Longitude", keyboard: "numeric" }
];

const switchgearFields: { key: keyof SwitchgearSchema; label: string; keyboard?: "default" | "numeric" }[] =
  [
    { key: "switchgears", label: "Switchgears *" },
    { key: "serial_no", label: "Serial No" },
    { key: "make", label: "Make" },
    { key: "model", label: "Model" },
    { key: "switch_gear_type", label: "Switch Gear Type" },
    { key: "construction_type", label: "Construction Type" },
    { key: "mco", label: "MCO" },
    { key: "busbars_no", label: "Busbars Number" },
    { key: "op_type", label: "Operation Type" },
    { key: "standard", label: "Standard" },
    { key: "voltage", label: "Voltage" },
    { key: "insulation_interrupting", label: "Insulation/Interrupting" },
    { key: "rated_cc", label: "Rated CC" },
    { key: "rated_mc", label: "Rated MC" },
    { key: "rated_scwt", label: "Rated SCWT" },
    { key: "rated_stwc", label: "Rated STWC" },
    { key: "control_voltage", label: "Control Voltage" },
    { key: "motor_ost", label: "Motor OST" },
    { key: "motor_voltage", label: "Motor Voltage" },
    { key: "aux_voltage", label: "Aux Voltage" },
    { key: "possible_count_setting", label: "Possible Count Setting" },
    { key: "auto_reclosing_type", label: "Auto Reclosing Type" },
    { key: "duty_cycle", label: "Duty Cycle" },
    { key: "year_of_manufacture", label: "Year of Manufacture", keyboard: "numeric" },
    { key: "net_mass", label: "Net Mass", keyboard: "numeric" },
    { key: "normal_operation_status", label: "Normal Operation Status" },
    { key: "oc_installed", label: "OC Installed" },
    { key: "asset_no", label: "Asset No" },
    { key: "bay_type", label: "Bay Type" },
    { key: "use", label: "Use" },
    { key: "trip_coils_no", label: "Trip Coils Number", keyboard: "numeric" },
    { key: "bil", label: "BIL" },
    { key: "feeder_code", label: "Feeder Code" },
    { key: "switch_gear_num", label: "Switch Gear Number" },
    { key: "status", label: "Status" },
    { key: "comments", label: "Comments" },
    { key: "location", label: "Location" },
    { key: "lat", label: "Latitude", keyboard: "numeric" },
    { key: "lon", label: "Longitude", keyboard: "numeric" },
    { key: "alt", label: "Altitude", keyboard: "numeric" }
  ];

const transformerFields: { key: keyof TransformerSchema; label: string; keyboard?: "default" | "numeric" }[] = [
  { key: "transformers", label: "Transformers *" },
  { key: "feeder", label: "Feeder" },
  { key: "transformer_point_name", label: "Transformer Point Name" },
  { key: "primary_substation", label: "Primary Substation" },
  { key: "serial_num", label: "Serial Num" },
  { key: "high_voltage", label: "High Voltage" },
  { key: "low_volatge", label: "Low Volatge" },
  { key: "capacity", label: "Capacity" },
  { key: "mounting", label: "Mounting: ONE POLE-PMT, TWO POLE-PMT, THREE POLE-PMT, FOUR POLE-PMT, GMT" },
  { key: "make", label: "Make" },
  { key: "trans_insulator", label: "Trans Insulator: EPOXY, GAS, OIL" },
  { key: "installation_year", label: "Installation Year", keyboard: "numeric" },
  { key: "comments", label: "Comments" },
  { key: "location", label: "Location" },
  { key: "lat", label: "Latitude", keyboard: "numeric" },
  { key: "lon", label: "Longitude", keyboard: "numeric" },
  { key: "alt", label: "Altitude", keyboard: "numeric" }
];

const poleFieldsToCarryForward: (keyof PoleSchema)[] = [
  "feeder_name",
  "voltage",
  "material_type",
  "construction_type",
  "cross_arm",
  "earth_wire_type",
  "earth_wire_size",
  "conductor_size",
  "conductor_type",
  "insulator_material",
  "insulator_type",
  "stay_num",
  "stay_type",
  "stay_wire_gauge",
  "createdby",
  "modifiedby"
];
const RECORDS_STORAGE_KEY = "asset-collect-records-v1";

export default function App() {
  const [templateType, setTemplateType] = useState<TemplateType>("meter");
  const [meterViewMode, setMeterViewMode] = useState<MeterViewMode>("collect");
  const [poleViewMode, setPoleViewMode] = useState<AssetViewMode>("collect");
  const [switchgearViewMode, setSwitchgearViewMode] = useState<AssetViewMode>("collect");
  const [transformerViewMode, setTransformerViewMode] = useState<AssetViewMode>("collect");
  const [form, setForm] = useState<MeterSchema>(initialForm);
  const [poleForm, setPoleForm] = useState<PoleSchema>(poleSchemaTemplate);
  const [switchgearForm, setSwitchgearForm] = useState<SwitchgearSchema>(switchgearSchemaTemplate);
  const [transformerForm, setTransformerForm] = useState<TransformerSchema>(transformerSchemaTemplate);
  const [records, setRecords] = useState<MeterRecord[]>([]);
  const [showMoreFields, setShowMoreFields] = useState(false);
  const [editingPoleLocalId, setEditingPoleLocalId] = useState<string | null>(null);
  const [gpsStatus, setGpsStatus] = useState("GPS idle");
  const [isHydrated, setIsHydrated] = useState(false);

  const recordCount = useMemo(() => records.length, [records]);
  const meterRecordCount = useMemo(
    () => records.filter((record) => record.template === "meter").length,
    [records]
  );
  const poleRecordCount = useMemo(
    () => records.filter((record) => record.template === "pole").length,
    [records]
  );
  const switchgearRecordCount = useMemo(
    () => records.filter((record) => record.template === "switchgear").length,
    [records]
  );
  const transformerRecordCount = useMemo(
    () => records.filter((record) => record.template === "transformer").length,
    [records]
  );

  const onChange = (key: keyof MeterSchema, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  const onPoleChange = (key: keyof PoleSchema, value: string) => {
    setPoleForm((prev) => ({ ...prev, [key]: value }));
  };
  const onSwitchgearChange = (key: keyof SwitchgearSchema, value: string) => {
    setSwitchgearForm((prev) => ({ ...prev, [key]: value }));
  };
  const onTransformerChange = (key: keyof TransformerSchema, value: string) => {
    setTransformerForm((prev) => ({ ...prev, [key]: value }));
  };

  const mapCoordsToPoleLocation = (coords: Location.LocationObjectCoords) => {
    const lat = coords.latitude.toFixed(6);
    const lon = coords.longitude.toFixed(6);
    const alt = coords.altitude ? coords.altitude.toFixed(2) : "";
    const accuracyMeters = typeof coords.accuracy === "number" ? Math.round(coords.accuracy) : null;

    return {
      lat,
      lon,
      alt,
      location: `${lat}, ${lon}`,
      accuracyMeters
    };
  };

  const applyTrackedLocationToActiveTemplate = (
    mapped: ReturnType<typeof mapCoordsToPoleLocation>,
    targetTemplate: TemplateType
  ) => {
    if (targetTemplate === "meter") {
      setForm((prev) => ({
        ...prev,
        lat: mapped.lat,
        lon: mapped.lon,
        alt: mapped.alt
      }));
      return;
    }

    if (targetTemplate === "pole") {
      setPoleForm((prev) => ({
        ...prev,
        lat: mapped.lat,
        lon: mapped.lon,
        alt: mapped.alt,
        location: mapped.location
      }));
      return;
    }

    if (targetTemplate === "switchgear") {
      setSwitchgearForm((prev) => ({
        ...prev,
        lat: mapped.lat,
        lon: mapped.lon,
        alt: mapped.alt,
        location: mapped.location
      }));
      return;
    }

    setTransformerForm((prev) => ({
      ...prev,
      lat: mapped.lat,
      lon: mapped.lon,
      alt: mapped.alt,
      location: mapped.location
    }));
  };

  const getFreshHighAccuracyLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation
      });
      return mapCoordsToPoleLocation(currentLocation.coords);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startLocationWatch = async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        setGpsStatus("GPS permission denied");
        return;
      }

      setGpsStatus(`GPS tracking active (${templateType})`);
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1
        },
        (location) => {
          const mapped = mapCoordsToPoleLocation(location.coords);
          applyTrackedLocationToActiveTemplate(mapped, templateType);
          setGpsStatus(
            mapped.accuracyMeters !== null
              ? `GPS tracking active (${templateType}, ~${mapped.accuracyMeters}m accuracy)`
              : `GPS tracking active (${templateType})`
          );
        }
      );
    };

    startLocationWatch().catch(() => setGpsStatus("GPS unavailable"));

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      setGpsStatus("GPS idle");
    };
  }, [templateType]);

  const saveRecord = async () => {
    if (!form.meterno.trim()) {
      Alert.alert("Missing fields", "Meter Number is required.");
      return;
    }

    let latestLocationPatch: Partial<MeterSchema> = {};
    const latestLocation = await getFreshHighAccuracyLocation();
    if (latestLocation) {
      latestLocationPatch = {
        lat: latestLocation.lat,
        lon: latestLocation.lon,
        alt: latestLocation.alt
      };
      setGpsStatus(
        latestLocation.accuracyMeters !== null
          ? `GPS fixed at save (meter, ~${latestLocation.accuracyMeters}m accuracy)`
          : "GPS fixed at save (meter)"
      );
    } else {
      setGpsStatus("Using last tracked GPS fix");
    }

    const now = new Date();
    const record: MeterRecord = {
      localId: `${Date.now()}`,
      capturedAt: now.toISOString(),
      template: "meter",
      uploaded: false,
      payload: {
        ...fullSchemaTemplate,
        ...form,
        ...latestLocationPatch,
        id: form.id || `${Date.now()}`,
        createdon: form.createdon || now.toISOString(),
        modifiedon: now.toISOString()
      }
    };

    setRecords((prev) => [record, ...prev]);
    setForm({
      ...initialForm,
      createdby: form.createdby,
      modifiedby: form.modifiedby
    });
  };

  const savePoleRecord = async () => {
    if (!poleForm.poles) {
      Alert.alert("Missing fields", "Poles is required.");
      return;
    }

    let latestLocationPatch: Partial<PoleSchema> = {};
    const latestLocation = await getFreshHighAccuracyLocation();
    if (latestLocation) {
      latestLocationPatch = {
        lat: latestLocation.lat,
        lon: latestLocation.lon,
        alt: latestLocation.alt,
        location: latestLocation.location
      };
      setGpsStatus(
        latestLocation.accuracyMeters !== null
          ? `GPS fixed at save (pole, ~${latestLocation.accuracyMeters}m accuracy)`
          : "GPS fixed at save (pole)"
      );
    } else {
      setGpsStatus("Using last tracked GPS fix");
    }

    const now = new Date();
    const currentLocalId = editingPoleLocalId ?? `${Date.now()}`;
    const payload: PoleSchema = {
      ...poleSchemaTemplate,
      ...poleForm,
      ...latestLocationPatch,
      id: poleForm.id || currentLocalId,
      createdon: poleForm.createdon || now.toISOString(),
      modifiedon: now.toISOString()
    };
    const record: MeterRecord = {
      localId: currentLocalId,
      capturedAt: now.toISOString(),
      template: "pole",
      uploaded: false,
      payload
    };

    setRecords((prev) => {
      if (!editingPoleLocalId) return [record, ...prev];
      return prev.map((item) => (item.localId === editingPoleLocalId ? record : item));
    });

    if (editingPoleLocalId) {
      setEditingPoleLocalId(null);
      setPoleForm({
        ...poleSchemaTemplate,
        createdby: poleForm.createdby,
        modifiedby: poleForm.modifiedby
      });
      return;
    }

    // Keep shared construction fields for faster multi-pole capture.
    setPoleForm((prev) => {
      const persistedValues = poleFieldsToCarryForward.reduce((acc, key) => {
        acc[key] = prev[key];
        return acc;
      }, {} as Partial<PoleSchema>);

      return {
        ...poleSchemaTemplate,
        ...persistedValues,
        position_type: "",
        poles: "",
        comments: "",
        location: "",
        lat: "",
        lon: "",
        alt: ""
      };
    });
  };

  const editPoleRecord = (record: MeterRecord) => {
    if (record.template !== "pole") return;
    setTemplateType("pole");
    setEditingPoleLocalId(record.localId);
    setPoleForm(record.payload as PoleSchema);
  };

  const saveSwitchgearRecord = async () => {
    if (!switchgearForm.switchgears) {
      Alert.alert("Missing fields", "Switchgears is required.");
      return;
    }

    let latestLocationPatch: Partial<SwitchgearSchema> = {};
    const latestLocation = await getFreshHighAccuracyLocation();
    if (latestLocation) {
      latestLocationPatch = {
        lat: latestLocation.lat,
        lon: latestLocation.lon,
        alt: latestLocation.alt,
        location: latestLocation.location
      };
      setGpsStatus(
        latestLocation.accuracyMeters !== null
          ? `GPS fixed at save (switchgear, ~${latestLocation.accuracyMeters}m accuracy)`
          : "GPS fixed at save (switchgear)"
      );
    } else {
      setGpsStatus("Using last tracked GPS fix");
    }

    const now = new Date();
    const record: MeterRecord = {
      localId: `${Date.now()}`,
      capturedAt: now.toISOString(),
      template: "switchgear",
      uploaded: false,
      payload: {
        ...switchgearSchemaTemplate,
        ...switchgearForm,
        ...latestLocationPatch,
        id: switchgearForm.id || `${Date.now()}`,
        createdon: switchgearForm.createdon || now.toISOString(),
        modifiedon: now.toISOString()
      }
    };

    setRecords((prev) => [record, ...prev]);
    setSwitchgearForm({
      ...switchgearSchemaTemplate,
      createdby: switchgearForm.createdby,
      modifiedby: switchgearForm.modifiedby
    });
  };

  const saveTransformerRecord = async () => {
    if (!transformerForm.transformers) {
      Alert.alert("Missing fields", "Transformers is required.");
      return;
    }

    let latestLocationPatch: Partial<TransformerSchema> = {};
    const latestLocation = await getFreshHighAccuracyLocation();
    if (latestLocation) {
      latestLocationPatch = {
        lat: latestLocation.lat,
        lon: latestLocation.lon,
        alt: latestLocation.alt,
        location: latestLocation.location
      };
      setGpsStatus(
        latestLocation.accuracyMeters !== null
          ? `GPS fixed at save (transformer, ~${latestLocation.accuracyMeters}m accuracy)`
          : "GPS fixed at save (transformer)"
      );
    } else {
      setGpsStatus("Using last tracked GPS fix");
    }

    const now = new Date();
    const record: MeterRecord = {
      localId: `${Date.now()}`,
      capturedAt: now.toISOString(),
      template: "transformer",
      uploaded: false,
      payload: {
        ...transformerSchemaTemplate,
        ...transformerForm,
        ...latestLocationPatch,
        id: transformerForm.id || `${Date.now()}`,
        createdon: transformerForm.createdon || now.toISOString(),
        modifiedon: now.toISOString()
      }
    };

    setRecords((prev) => [record, ...prev]);
    setTransformerForm({
      ...transformerSchemaTemplate,
      createdby: transformerForm.createdby,
      modifiedby: transformerForm.modifiedby
    });
  };

  const cancelPoleEdit = () => {
    setEditingPoleLocalId(null);
    setPoleForm({
      ...poleSchemaTemplate,
      createdby: poleForm.createdby,
      modifiedby: poleForm.modifiedby
    });
  };

  const meterOnlyRecords = useMemo(
    () => records.filter((record) => record.template === "meter"),
    [records]
  );
  const poleOnlyRecords = useMemo(
    () => records.filter((record) => record.template === "pole"),
    [records]
  );
  const switchgearOnlyRecords = useMemo(
    () => records.filter((record) => record.template === "switchgear"),
    [records]
  );
  const transformerOnlyRecords = useMemo(
    () => records.filter((record) => record.template === "transformer"),
    [records]
  );

  const uploadTemplateRecords = async (template: TemplateType) => {
    const templateRecords = records.filter((record) => record.template === template);
    if (templateRecords.length === 0) {
      Alert.alert("Nothing to upload", `No ${template} records available.`);
      return;
    }

    try {
      // Placeholder for API integration.
      await Promise.resolve();
      const uploadedAt = new Date().toISOString();
      setRecords((prev) =>
        prev.map((record) =>
          record.template === template
            ? {
                ...record,
                uploaded: true,
                uploadedAt
              }
            : record
        )
      );
      Alert.alert("Upload complete", `${templateRecords.length} ${template} record(s) uploaded.`);
    } catch {
      Alert.alert("Upload failed", `Could not upload ${template} records.`);
    }
  };

  useEffect(() => {
    const loadStoredRecords = async () => {
      try {
        const saved = await AsyncStorage.getItem(RECORDS_STORAGE_KEY);
        if (!saved) return;
        const parsed = JSON.parse(saved) as MeterRecord[];
        setRecords(parsed);
      } catch {
        Alert.alert("Storage warning", "Could not load saved records from device storage.");
      } finally {
        setIsHydrated(true);
      }
    };

    loadStoredRecords().catch(() => setIsHydrated(true));
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records)).catch(() => {
      Alert.alert("Storage warning", "Could not save records to device storage.");
    });
  }, [records, isHydrated]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Asset Collection Templates</Text>
          <Text style={styles.subtitle}>
            All records: {recordCount} | Meter: {meterRecordCount} | Pole: {poleRecordCount} | Switchgear:{" "}
            {switchgearRecordCount} | Transformer: {transformerRecordCount}
          </Text>
        </View>

        <View style={styles.segmentWrap}>
          <TouchableOpacity
            style={[styles.segmentButton, templateType === "meter" && styles.segmentButtonActive]}
            onPress={() => {
              setTemplateType("meter");
              setMeterViewMode("collect");
            }}
          >
            <Text style={[styles.segmentText, templateType === "meter" && styles.segmentTextActive]}>
              Meter
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentButton, templateType === "pole" && styles.segmentButtonActive]}
            onPress={() => {
              setTemplateType("pole");
              setPoleViewMode("collect");
            }}
          >
            <Text style={[styles.segmentText, templateType === "pole" && styles.segmentTextActive]}>
              Pole
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentButton, templateType === "switchgear" && styles.segmentButtonActive]}
            onPress={() => {
              setTemplateType("switchgear");
              setSwitchgearViewMode("collect");
            }}
          >
            <Text style={[styles.segmentText, templateType === "switchgear" && styles.segmentTextActive]}>
              Switchgear
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentButton, templateType === "transformer" && styles.segmentButtonActive]}
            onPress={() => {
              setTemplateType("transformer");
              setTransformerViewMode("collect");
            }}
          >
            <Text style={[styles.segmentText, templateType === "transformer" && styles.segmentTextActive]}>
              Transformers
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {templateType === "meter" ? (
            <>
              <Text style={styles.sectionTitle}>Meter</Text>
              <View style={styles.segmentWrap}>
                <TouchableOpacity
                  style={[styles.segmentButton, meterViewMode === "collect" && styles.segmentButtonActive]}
                  onPress={() => setMeterViewMode("collect")}
                >
                  <Text style={[styles.segmentText, meterViewMode === "collect" && styles.segmentTextActive]}>
                    Collect
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segmentButton, meterViewMode === "view" && styles.segmentButtonActive]}
                  onPress={() => setMeterViewMode("view")}
                >
                  <Text style={[styles.segmentText, meterViewMode === "view" && styles.segmentTextActive]}>
                    View Collected
                  </Text>
                </TouchableOpacity>
              </View>

              {meterViewMode === "collect" ? (
                <>
                  <Text style={styles.gpsStatus}>{gpsStatus}</Text>
                  {primaryFields.map((field) => (
                    <TextInput
                      key={field.key}
                      style={styles.input}
                      placeholder={field.label}
                      keyboardType={field.keyboard ?? "default"}
                      value={form[field.key]}
                      onChangeText={(v) => onChange(field.key, v)}
                    />
                  ))}

                  <TouchableOpacity style={styles.linkButton} onPress={() => setShowMoreFields((prev) => !prev)}>
                    <Text style={styles.linkText}>
                      {showMoreFields ? "Hide optional schema fields" : "Show optional schema fields"}
                    </Text>
                  </TouchableOpacity>

                  {showMoreFields &&
                    optionalFields.map((field) => (
                      <TextInput
                        key={field.key}
                        style={styles.input}
                        placeholder={field.label}
                        value={form[field.key]}
                        onChangeText={(v) => onChange(field.key, v)}
                      />
                    ))}

                  <TouchableOpacity style={styles.button} onPress={saveRecord}>
                    <Text style={styles.buttonText}>Save Meter Record</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.sectionTitle}>Collected Meter Records</Text>
                  {meterOnlyRecords.length === 0 ? (
                    <Text style={styles.empty}>No meter records collected yet.</Text>
                  ) : (
                    <FlatList
                      data={meterOnlyRecords}
                      keyExtractor={(item) => item.localId}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <View style={styles.item}>
                          <Text style={styles.itemTitle}>
                            Meter: {(item.payload as MeterSchema).meterno || "N/A"} -{" "}
                            {(item.payload as MeterSchema).chk || "N/A"}
                          </Text>
                          {item.uploaded && <Text style={styles.uploadedTick}>Uploaded ✓</Text>}
                          <Text style={styles.itemMeta}>
                            {(item.payload as MeterSchema).accountno}
                            {(item.payload as MeterSchema).customername
                              ? ` | ${(item.payload as MeterSchema).customername}`
                              : ""}
                          </Text>
                          <Text style={styles.itemMeta}>{new Date(item.capturedAt).toLocaleString()}</Text>
                        </View>
                      )}
                    />
                  )}
                  <TouchableOpacity style={styles.uploadButton} onPress={() => uploadTemplateRecords("meter")}>
                    <Text style={styles.uploadButtonText}>Upload Meter Records</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : templateType === "pole" ? (
            <>
              <Text style={styles.sectionTitle}>Pole</Text>
              <View style={styles.segmentWrap}>
                <TouchableOpacity
                  style={[styles.segmentButton, poleViewMode === "collect" && styles.segmentButtonActive]}
                  onPress={() => setPoleViewMode("collect")}
                >
                  <Text style={[styles.segmentText, poleViewMode === "collect" && styles.segmentTextActive]}>
                    Collect
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segmentButton, poleViewMode === "view" && styles.segmentButtonActive]}
                  onPress={() => setPoleViewMode("view")}
                >
                  <Text style={[styles.segmentText, poleViewMode === "view" && styles.segmentTextActive]}>
                    View Collected
                  </Text>
                </TouchableOpacity>
              </View>
              {poleViewMode === "collect" ? (
                <>
                  <Text style={styles.gpsStatus}>{gpsStatus}</Text>
                  {poleFields.map((field) => (
                    <TextInput
                      key={field.key}
                      style={styles.input}
                      placeholder={field.label}
                      keyboardType={field.keyboard ?? "default"}
                      value={poleForm[field.key]}
                      onChangeText={(v) => onPoleChange(field.key, v)}
                    />
                  ))}
                  {editingPoleLocalId && (
                    <TouchableOpacity style={styles.cancelButton} onPress={cancelPoleEdit}>
                      <Text style={styles.cancelButtonText}>Cancel Edit</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.button} onPress={savePoleRecord}>
                    <Text style={styles.buttonText}>
                      {editingPoleLocalId ? "Update Pole Record" : "Save Pole Record"}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.sectionTitle}>Collected Pole Records</Text>
                  {poleOnlyRecords.length === 0 ? (
                    <Text style={styles.empty}>No pole records collected yet.</Text>
                  ) : (
                    <FlatList
                      data={poleOnlyRecords}
                      keyExtractor={(item) => item.localId}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <TouchableOpacity style={styles.item} onPress={() => editPoleRecord(item)}>
                          <Text style={styles.itemTitle}>
                            Pole: {(item.payload as PoleSchema).poles || "N/A"} -{" "}
                            {(item.payload as PoleSchema).feeder_name || "N/A"}
                          </Text>
                          {item.uploaded && <Text style={styles.uploadedTick}>Uploaded ✓</Text>}
                          <Text style={styles.itemMeta}>
                            {(item.payload as PoleSchema).voltage}
                            {(item.payload as PoleSchema).material_type
                              ? ` | ${(item.payload as PoleSchema).material_type}`
                              : ""}
                          </Text>
                          <Text style={styles.itemMeta}>{new Date(item.capturedAt).toLocaleString()}</Text>
                          <Text style={styles.itemHint}>Tap to edit this pole record</Text>
                        </TouchableOpacity>
                      )}
                    />
                  )}
                  <TouchableOpacity style={styles.uploadButton} onPress={() => uploadTemplateRecords("pole")}>
                    <Text style={styles.uploadButtonText}>Upload Pole Records</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : templateType === "switchgear" ? (
            <>
              <Text style={styles.sectionTitle}>Switchgear</Text>
              <View style={styles.segmentWrap}>
                <TouchableOpacity
                  style={[styles.segmentButton, switchgearViewMode === "collect" && styles.segmentButtonActive]}
                  onPress={() => setSwitchgearViewMode("collect")}
                >
                  <Text style={[styles.segmentText, switchgearViewMode === "collect" && styles.segmentTextActive]}>
                    Collect
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segmentButton, switchgearViewMode === "view" && styles.segmentButtonActive]}
                  onPress={() => setSwitchgearViewMode("view")}
                >
                  <Text style={[styles.segmentText, switchgearViewMode === "view" && styles.segmentTextActive]}>
                    View Collected
                  </Text>
                </TouchableOpacity>
              </View>
              {switchgearViewMode === "collect" ? (
                <>
                  <Text style={styles.gpsStatus}>{gpsStatus}</Text>
                  {switchgearFields.map((field) => (
                    <TextInput
                      key={field.key}
                      style={styles.input}
                      placeholder={field.label}
                      keyboardType={field.keyboard ?? "default"}
                      value={switchgearForm[field.key]}
                      onChangeText={(v) => onSwitchgearChange(field.key, v)}
                    />
                  ))}
                  <TouchableOpacity style={styles.button} onPress={saveSwitchgearRecord}>
                    <Text style={styles.buttonText}>Save Switchgear Record</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.sectionTitle}>Collected Switchgear Records</Text>
                  {switchgearOnlyRecords.length === 0 ? (
                    <Text style={styles.empty}>No switchgear records collected yet.</Text>
                  ) : (
                    <FlatList
                      data={switchgearOnlyRecords}
                      keyExtractor={(item) => item.localId}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <View style={styles.item}>
                          <Text style={styles.itemTitle}>
                            Switchgear: {(item.payload as SwitchgearSchema).switchgears || "N/A"} -{" "}
                            {(item.payload as SwitchgearSchema).status || "N/A"}
                          </Text>
                          {item.uploaded && <Text style={styles.uploadedTick}>Uploaded ✓</Text>}
                          <Text style={styles.itemMeta}>
                            {(item.payload as SwitchgearSchema).serial_no}
                            {(item.payload as SwitchgearSchema).switch_gear_type
                              ? ` | ${(item.payload as SwitchgearSchema).switch_gear_type}`
                              : ""}
                          </Text>
                          <Text style={styles.itemMeta}>{new Date(item.capturedAt).toLocaleString()}</Text>
                        </View>
                      )}
                    />
                  )}
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => uploadTemplateRecords("switchgear")}
                  >
                    <Text style={styles.uploadButtonText}>Upload Switchgear Records</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Transformers</Text>
              <View style={styles.segmentWrap}>
                <TouchableOpacity
                  style={[styles.segmentButton, transformerViewMode === "collect" && styles.segmentButtonActive]}
                  onPress={() => setTransformerViewMode("collect")}
                >
                  <Text style={[styles.segmentText, transformerViewMode === "collect" && styles.segmentTextActive]}>
                    Collect
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segmentButton, transformerViewMode === "view" && styles.segmentButtonActive]}
                  onPress={() => setTransformerViewMode("view")}
                >
                  <Text style={[styles.segmentText, transformerViewMode === "view" && styles.segmentTextActive]}>
                    View Collected
                  </Text>
                </TouchableOpacity>
              </View>
              {transformerViewMode === "collect" ? (
                <>
                  <Text style={styles.gpsStatus}>{gpsStatus}</Text>
                  {transformerFields.map((field) => (
                    <TextInput
                      key={field.key}
                      style={styles.input}
                      placeholder={field.label}
                      keyboardType={field.keyboard ?? "default"}
                      value={transformerForm[field.key]}
                      onChangeText={(v) => onTransformerChange(field.key, v)}
                    />
                  ))}
                  <TouchableOpacity style={styles.button} onPress={saveTransformerRecord}>
                    <Text style={styles.buttonText}>Save Transformer Record</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.sectionTitle}>Collected Transformer Records</Text>
                  {transformerOnlyRecords.length === 0 ? (
                    <Text style={styles.empty}>No transformer records collected yet.</Text>
                  ) : (
                    <FlatList
                      data={transformerOnlyRecords}
                      keyExtractor={(item) => item.localId}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <View style={styles.item}>
                          <Text style={styles.itemTitle}>
                            Transformer: {(item.payload as TransformerSchema).transformers || "N/A"} -{" "}
                            {(item.payload as TransformerSchema).transformer_point_name || "N/A"}
                          </Text>
                          {item.uploaded && <Text style={styles.uploadedTick}>Uploaded ✓</Text>}
                          <Text style={styles.itemMeta}>
                            {(item.payload as TransformerSchema).feeder}
                            {(item.payload as TransformerSchema).capacity
                              ? ` | ${(item.payload as TransformerSchema).capacity}`
                              : ""}
                          </Text>
                          <Text style={styles.itemMeta}>{new Date(item.capturedAt).toLocaleString()}</Text>
                        </View>
                      )}
                    />
                  )}
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => uploadTemplateRecords("transformer")}
                  >
                    <Text style={styles.uploadButtonText}>Upload Transformer Records</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f5f7",
    padding: 14
  },
  header: {
    marginTop: 4,
    marginBottom: 8
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a"
  },
  subtitle: {
    fontSize: 14,
    color: "#334155"
  },
  segmentWrap: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6
  },
  segmentButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center"
  },
  segmentButtonActive: {
    borderColor: "#2563eb",
    backgroundColor: "#dbeafe"
  },
  segmentText: {
    color: "#334155",
    fontWeight: "600"
  },
  segmentTextActive: {
    color: "#1d4ed8"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0"
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#0f172a"
  },
  gpsStatus: {
    color: "#0f766e",
    marginBottom: 8,
    fontSize: 12
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginBottom: 8
  },
  linkButton: {
    alignItems: "flex-start",
    marginBottom: 10
  },
  linkText: {
    color: "#1d4ed8",
    fontWeight: "600"
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700"
  },
  uploadButton: {
    backgroundColor: "#0f766e",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10
  },
  uploadButtonText: {
    color: "#ffffff",
    fontWeight: "700"
  },
  cancelButton: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#94a3b8"
  },
  cancelButtonText: {
    color: "#334155",
    fontWeight: "700"
  },
  empty: {
    color: "#64748b"
  },
  item: {
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingVertical: 8
  },
  itemTitle: {
    fontWeight: "600",
    color: "#0f172a"
  },
  itemMeta: {
    color: "#475569",
    fontSize: 12
  },
  uploadedTick: {
    color: "#15803d",
    fontWeight: "700",
    marginTop: 2
  },
  itemHint: {
    color: "#2563eb",
    fontSize: 12,
    marginTop: 2
  }
});
