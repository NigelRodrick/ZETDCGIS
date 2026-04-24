import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  BackHandler,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { CONDITIONS, FEATURE_TYPES } from "../../lib/formSchema";
import {
  deleteMeterReading,
  deleteObservation,
  insertMeterReading,
  insertObservation,
  listMeterReadings,
  listObservations,
  type MeterReadingItem,
  type ObservationListItem,
} from "../../lib/db";
import {
  METER_MCBSIZES,
  METER_PHASES,
} from "../../lib/meterFormSchema";
import {
  POLE_CONSTRUCTION_TYPES,
  POLE_CONDUCTOR_TYPES,
  POLE_CROSS_ARMS,
  POLE_EARTH_WIRE_SIZES,
  POLE_EARTH_WIRE_TYPES,
  POLE_INSULATOR_MATERIALS,
  POLE_INSULATOR_TYPES,
  POLE_MATERIAL_TYPES,
  POLE_POSITION_TYPES,
  POLE_STAY_TYPES,
  POLE_STAY_WIRE_GAUGES,
  POLE_VOLTAGES,
} from "../../lib/poleFormSchema";
import {
  SWITCHGEAR_AUTO_RECLOSING_TYPES,
  SWITCHGEAR_AUX_VOLTAGES,
  SWITCHGEAR_BAY_TYPES,
  SWITCHGEAR_CONSTRUCTION_TYPES,
  SWITCHGEAR_CONTROL_VOLTAGES,
  SWITCHGEAR_INSULATION_TYPES,
  SWITCHGEAR_MCO_OPTIONS,
  SWITCHGEAR_MOTOR_OST_OPTIONS,
  SWITCHGEAR_MOTOR_VOLTAGES,
  SWITCHGEAR_OC_INSTALLED_OPTIONS,
  SWITCHGEAR_OPERATION_STATUSES,
  SWITCHGEAR_OP_TYPES,
  SWITCHGEAR_TYPES,
  SWITCHGEAR_USE_OPTIONS,
  SWITCHGEAR_VOLTAGES,
} from "../../lib/switchgearFormSchema";
import {
  TRANSFORMER_INSULATORS,
  TRANSFORMER_MOUNTINGS,
} from "../../lib/transformerFormSchema";

type CollectMode = "general" | "meters";
type HomeFormType = "meter" | "pole" | "switchgear" | "transformer";
type ManualAssetForm = Exclude<HomeFormType, "meter">;

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function CollectScreen() {
  const router = useRouter();
  const { form } = useLocalSearchParams<{ form?: HomeFormType }>();
  const [mode, setMode] = useState<CollectMode>("general");
  const [title, setTitle] = useState("");
  const [siteId, setSiteId] = useState("");
  const [featureType, setFeatureType] = useState("");
  const [condition, setCondition] = useState("");
  const [collectorName, setCollectorName] = useState("");
  const [notes, setNotes] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [rows, setRows] = useState<ObservationListItem[]>([]);
  const [meterRows, setMeterRows] = useState<MeterReadingItem[]>([]);

  const [meterno, setMeterno] = useState("");
  const [phases, setPhases] = useState("");
  const [mcbsize, setMcbsize] = useState("");
  const [meterComments, setMeterComments] = useState("");
  const [poleFeederName, setPoleFeederName] = useState("");
  const [poleVoltage, setPoleVoltage] = useState("");
  const [poleMaterialType, setPoleMaterialType] = useState("");
  const [polePositionType, setPolePositionType] = useState("");
  const [poleConstructionType, setPoleConstructionType] = useState("");
  const [poleCrossArm, setPoleCrossArm] = useState("");
  const [poleEarthWireType, setPoleEarthWireType] = useState("");
  const [poleEarthWireSize, setPoleEarthWireSize] = useState("");
  const [poleConductorSize, setPoleConductorSize] = useState("");
  const [poleConductorType, setPoleConductorType] = useState("");
  const [poleInsulatorMaterial, setPoleInsulatorMaterial] = useState("");
  const [poleInsulatorType, setPoleInsulatorType] = useState("");
  const [poleStayNum, setPoleStayNum] = useState("");
  const [poleStayType, setPoleStayType] = useState("");
  const [poleStayWireGauge, setPoleStayWireGauge] = useState("");
  const [poleComments, setPoleComments] = useState("");
  const [switchgearSerialNo, setSwitchgearSerialNo] = useState("");
  const [switchgearMake, setSwitchgearMake] = useState("");
  const [switchgearModel, setSwitchgearModel] = useState("");
  const [switchgearType, setSwitchgearType] = useState("");
  const [switchgearConstructionType, setSwitchgearConstructionType] = useState("");
  const [switchgearMco, setSwitchgearMco] = useState("");
  const [switchgearBusbarsNo, setSwitchgearBusbarsNo] = useState("");
  const [switchgearOpType, setSwitchgearOpType] = useState("");
  const [switchgearStandard, setSwitchgearStandard] = useState("");
  const [switchgearVoltage, setSwitchgearVoltage] = useState("");
  const [switchgearInsulationInterrupting, setSwitchgearInsulationInterrupting] =
    useState("");
  const [switchgearRatedCc, setSwitchgearRatedCc] = useState("");
  const [switchgearRatedMc, setSwitchgearRatedMc] = useState("");
  const [switchgearRatedScwt, setSwitchgearRatedScwt] = useState("");
  const [switchgearRatedStwc, setSwitchgearRatedStwc] = useState("");
  const [switchgearControlVoltage, setSwitchgearControlVoltage] = useState("");
  const [switchgearMotorOst, setSwitchgearMotorOst] = useState("");
  const [switchgearMotorVoltage, setSwitchgearMotorVoltage] = useState("");
  const [switchgearAuxVoltage, setSwitchgearAuxVoltage] = useState("");
  const [switchgearPossibleCountSetting, setSwitchgearPossibleCountSetting] =
    useState("");
  const [switchgearAutoReclosingType, setSwitchgearAutoReclosingType] =
    useState("");
  const [switchgearDutyCycle, setSwitchgearDutyCycle] = useState("");
  const [switchgearYearOfManufacture, setSwitchgearYearOfManufacture] =
    useState("");
  const [switchgearNetMass, setSwitchgearNetMass] = useState("");
  const [switchgearNormalOperationStatus, setSwitchgearNormalOperationStatus] =
    useState("");
  const [switchgearOcInstalled, setSwitchgearOcInstalled] = useState("");
  const [switchgearAssetNo, setSwitchgearAssetNo] = useState("");
  const [switchgearBayType, setSwitchgearBayType] = useState("");
  const [switchgearUse, setSwitchgearUse] = useState("");
  const [switchgearTripCoilsNo, setSwitchgearTripCoilsNo] = useState("");
  const [switchgearBil, setSwitchgearBil] = useState("");
  const [switchgearFeederCode, setSwitchgearFeederCode] = useState("");
  const [switchgearNum, setSwitchgearNum] = useState("");
  const [switchgearStatus, setSwitchgearStatus] = useState("");
  const [switchgearComments, setSwitchgearComments] = useState("");
  const [transformerFeeder, setTransformerFeeder] = useState("");
  const [transformerPointName, setTransformerPointName] = useState("");
  const [transformerPrimarySubstation, setTransformerPrimarySubstation] =
    useState("");
  const [transformerSerialNum, setTransformerSerialNum] = useState("");
  const [transformerHighVoltage, setTransformerHighVoltage] = useState("");
  const [transformerLowVoltage, setTransformerLowVoltage] = useState("");
  const [transformerCapacity, setTransformerCapacity] = useState("");
  const [transformerMounting, setTransformerMounting] = useState("");
  const [transformerMake, setTransformerMake] = useState("");
  const [transformerInsulator, setTransformerInsulator] = useState("");
  const [transformerInstallationYear, setTransformerInstallationYear] =
    useState("");
  const [transformerComments, setTransformerComments] = useState("");
  const [gpsCoords, setGpsCoords] = useState<Location.LocationObjectCoords | null>(
    null
  );
  const [gpsPermission, setGpsPermission] =
    useState<Location.PermissionStatus | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [didHydratePoleDraft, setDidHydratePoleDraft] = useState(false);
  const [hasPendingEdits, setHasPendingEdits] = useState(false);

  useEffect(() => {
    if (!form) {
      return;
    }
    if (form === "meter") {
      setMode("meters");
      return;
    }
    setMode("general");
    const preset =
      form === "pole"
        ? "Pole"
        : form === "switchgear"
          ? "Switchgear"
          : "Transformer";
    setFeatureType(preset);
  }, [form]);

  const activeAssetForm: ManualAssetForm | null =
    form && form !== "meter" ? form : null;
  const activeAssetLabel = activeAssetForm ? titleCase(activeAssetForm) : null;

  useEffect(() => {
    if (activeAssetForm !== "pole") {
      setDidHydratePoleDraft(false);
      return;
    }
    if (didHydratePoleDraft) {
      return;
    }
    const lastPole = rows.find((r) => r.featureType === "Pole");
    if (!lastPole) {
      setDidHydratePoleDraft(true);
      return;
    }
    setTitle(lastPole.title);
    setSiteId(lastPole.siteId);
    setFeatureType(lastPole.featureType || "Pole");
    setCondition(lastPole.condition);
    setCollectorName(lastPole.collectorName);
    setNotes(lastPole.notes);
    setDidHydratePoleDraft(true);
    setHasPendingEdits(false);
  }, [activeAssetForm, didHydratePoleDraft, rows]);

  const coordsLabel = useMemo(() => {
    if (!gpsCoords) return "Waiting for GPS fix...";
    return `${gpsCoords.latitude.toFixed(6)}, ${gpsCoords.longitude.toFixed(6)}`;
  }, [gpsCoords]);

  const confirmLeaveWithoutSaving = useCallback(() => {
    if (!form || !hasPendingEdits) {
      router.back();
      return;
    }
    Alert.alert(
      "Continue without saving?",
      "Your current form changes will not be saved.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
  }, [form, hasPendingEdits, router]);

  useEffect(() => {
    let mounted = true;
    let sub: Location.LocationSubscription | null = null;

    void (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!mounted) return;
        setGpsPermission(status);
        if (status !== "granted") {
          setGpsError("Location permission is required to save records.");
          return;
        }
        setGpsError(null);
        const last = await Location.getLastKnownPositionAsync();
        if (mounted && last?.coords) {
          setGpsCoords(last.coords);
        }
        sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 2000,
            distanceInterval: 1,
          },
          (position) => {
            if (!mounted) return;
            setGpsCoords(position.coords);
          }
        );
      } catch (e) {
        if (!mounted) return;
        setGpsError(e instanceof Error ? e.message : "Unable to start GPS.");
      }
    })();

    return () => {
      mounted = false;
      sub?.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (form) {
          confirmLeaveWithoutSaving();
          return true;
        }
        return false;
      };
      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [form, confirmLeaveWithoutSaving])
  );

  const load = useCallback(async () => {
    const list = await listObservations();
    setRows(list);
  }, []);

  const loadMeters = useCallback(async () => {
    const list = await listMeterReadings();
    setMeterRows(list);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([load(), loadMeters()]);
    } finally {
      setRefreshing(false);
    }
  }, [load, loadMeters]);

  const confirmDelete = useCallback(
    (r: ObservationListItem) => {
      Alert.alert(
        "Delete record?",
        `Remove #${r.id} “${r.title}”? This cannot be undone.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              void (async () => {
                await deleteObservation(r.id);
                await load();
              })();
            },
          },
        ]
      );
    },
    [load]
  );

  useEffect(() => {
    void load();
    void loadMeters();
  }, [load, loadMeters]);

  const clearForm = useCallback(() => {
    setTitle("");
    setSiteId("");
    setFeatureType("");
    setCondition("");
    setCollectorName("");
    setNotes("");
    setPoleFeederName("");
    setPoleVoltage("");
    setPoleMaterialType("");
    setPolePositionType("");
    setPoleConstructionType("");
    setPoleCrossArm("");
    setPoleEarthWireType("");
    setPoleEarthWireSize("");
    setPoleConductorSize("");
    setPoleConductorType("");
    setPoleInsulatorMaterial("");
    setPoleInsulatorType("");
    setPoleStayNum("");
    setPoleStayType("");
    setPoleStayWireGauge("");
    setPoleComments("");
    setSwitchgearSerialNo("");
    setSwitchgearMake("");
    setSwitchgearModel("");
    setSwitchgearType("");
    setSwitchgearConstructionType("");
    setSwitchgearMco("");
    setSwitchgearBusbarsNo("");
    setSwitchgearOpType("");
    setSwitchgearStandard("");
    setSwitchgearVoltage("");
    setSwitchgearInsulationInterrupting("");
    setSwitchgearRatedCc("");
    setSwitchgearRatedMc("");
    setSwitchgearRatedScwt("");
    setSwitchgearRatedStwc("");
    setSwitchgearControlVoltage("");
    setSwitchgearMotorOst("");
    setSwitchgearMotorVoltage("");
    setSwitchgearAuxVoltage("");
    setSwitchgearPossibleCountSetting("");
    setSwitchgearAutoReclosingType("");
    setSwitchgearDutyCycle("");
    setSwitchgearYearOfManufacture("");
    setSwitchgearNetMass("");
    setSwitchgearNormalOperationStatus("");
    setSwitchgearOcInstalled("");
    setSwitchgearAssetNo("");
    setSwitchgearBayType("");
    setSwitchgearUse("");
    setSwitchgearTripCoilsNo("");
    setSwitchgearBil("");
    setSwitchgearFeederCode("");
    setSwitchgearNum("");
    setSwitchgearStatus("");
    setSwitchgearComments("");
    setTransformerFeeder("");
    setTransformerPointName("");
    setTransformerPrimarySubstation("");
    setTransformerSerialNum("");
    setTransformerHighVoltage("");
    setTransformerLowVoltage("");
    setTransformerCapacity("");
    setTransformerMounting("");
    setTransformerMake("");
    setTransformerInsulator("");
    setTransformerInstallationYear("");
    setTransformerComments("");
    setHasPendingEdits(false);
  }, []);

  const clearMeterForm = useCallback(() => {
    setMeterno("");
    setPhases("");
    setMcbsize("");
    setMeterComments("");
    setHasPendingEdits(false);
  }, []);

  const confirmDeleteMeter = useCallback(
    (r: MeterReadingItem) => {
      Alert.alert(
        "Delete meter record?",
        `Remove #${r.id} (${r.meterno.trim() || "no METERNO"})? This cannot be undone.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              void (async () => {
                await deleteMeterReading(r.id);
                await loadMeters();
              })();
            },
          },
        ]
      );
    },
    [loadMeters]
  );

  const saveMeter = useCallback(async () => {
    const m = meterno.trim();
    if (!m) {
      Alert.alert("METERNO required", "Enter the meter identifier.");
      return;
    }
    if (!phases) {
      Alert.alert("PHASES required", "Select RED, YELLOW, BLUE, or THREE PHASE.");
      return;
    }
    if (!gpsCoords) {
      Alert.alert(
        "GPS required",
        "Wait for GPS coordinates before saving this record."
      );
      return;
    }
    const location = {
      latitude: gpsCoords.latitude,
      longitude: gpsCoords.longitude,
    };
    await insertMeterReading({
      meterno: m,
      phases,
      mcbsize: mcbsize.trim(),
      comments: meterComments.trim(),
      location,
    });
    clearMeterForm();
    await loadMeters();
    setHasPendingEdits(false);
    Alert.alert("Saved", "Meter saved with GPS coordinates.");
  }, [
    meterno,
    phases,
    mcbsize,
    meterComments,
    gpsCoords,
    clearMeterForm,
    loadMeters,
  ]);

  const save = useCallback(async () => {
    const t = title.trim();
    if (!t) {
      Alert.alert(
        "Feature name required",
        "Enter a name or label for this feature (required field)."
      );
      return;
    }
    if (!gpsCoords) {
      Alert.alert(
        "GPS required",
        "Wait for GPS coordinates before saving this record."
      );
      return;
    }
    const location = {
      latitude: gpsCoords.latitude,
      longitude: gpsCoords.longitude,
    };
    const poleAttributeNotes =
      activeAssetForm === "pole"
        ? [
            `FEEDER NAME: ${poleFeederName.trim()}`,
            `VOLTAGE: ${poleVoltage}`,
            `MATERIAL TYPE: ${poleMaterialType}`,
            `POSITION TYPE: ${polePositionType}`,
            `CONSTRUCTION TYPE: ${poleConstructionType}`,
            `CROSS ARM: ${poleCrossArm}`,
            `EARTH WIRE TYPE: ${poleEarthWireType}`,
            `EARTH WIRE SIZE: ${poleEarthWireSize}`,
            `CONDUCTOR SIZE: ${poleConductorSize.trim()}`,
            `CONDUCTOR TYPE: ${poleConductorType}`,
            `INSULATOR MATERIAL: ${poleInsulatorMaterial}`,
            `INSULATOR TYPE: ${poleInsulatorType}`,
            `STAY NUM: ${poleStayNum.trim()}`,
            `STAY TYPE: ${poleStayType}`,
            `STAY WIRE GAUGE: ${poleStayWireGauge}`,
            `COMMENTS: ${poleComments.trim()}`,
          ]
            .filter((line) => line.split(": ")[1])
            .join("\n")
        : "";
    const switchgearAttributeNotes =
      activeAssetForm === "switchgear"
        ? [
            `SWITCHGEARS: ${title.trim()}`,
            `SERIAL NO: ${switchgearSerialNo.trim()}`,
            `MAKE: ${switchgearMake.trim()}`,
            `MODEL: ${switchgearModel.trim()}`,
            `SWITCH GEAR TYPE: ${switchgearType}`,
            `CONSTRUCTION TYPE: ${switchgearConstructionType}`,
            `MCO: ${switchgearMco}`,
            `BUSBARS NO: ${switchgearBusbarsNo.trim()}`,
            `OP TYPE: ${switchgearOpType}`,
            `STANDARD: ${switchgearStandard.trim()}`,
            `VOLTAGE: ${switchgearVoltage}`,
            `INSULATION/INTERRUPTING: ${switchgearInsulationInterrupting}`,
            `RATED CC: ${switchgearRatedCc.trim()}`,
            `RATED MC: ${switchgearRatedMc.trim()}`,
            `RATED SCWT: ${switchgearRatedScwt.trim()}`,
            `RATED STWC: ${switchgearRatedStwc.trim()}`,
            `CONTROL VOLTAGE: ${switchgearControlVoltage}`,
            `MOTOR OST: ${switchgearMotorOst}`,
            `MOTOR VOLTAGE: ${switchgearMotorVoltage}`,
            `AUX VOLTAGE: ${switchgearAuxVoltage}`,
            `POSSIBLE COUNT SETTING: ${switchgearPossibleCountSetting.trim()}`,
            `AUTO RECLOSING TYPE: ${switchgearAutoReclosingType}`,
            `DUTY CYCLE: ${switchgearDutyCycle.trim()}`,
            `YEAR OF MANUFACTURE: ${switchgearYearOfManufacture.trim()}`,
            `NET MASS: ${switchgearNetMass.trim()}`,
            `NORMAL OPERATION STATUS: ${switchgearNormalOperationStatus}`,
            `OC INSTALLED: ${switchgearOcInstalled}`,
            `ASSET NO: ${switchgearAssetNo.trim()}`,
            `BAY TYPE: ${switchgearBayType}`,
            `USE: ${switchgearUse}`,
            `TRIP COILS NO: ${switchgearTripCoilsNo.trim()}`,
            `BIL: ${switchgearBil.trim()}`,
            `FEEDER CODE: ${switchgearFeederCode.trim()}`,
            `SWITCH GEAR NUM: ${switchgearNum.trim()}`,
            `STATUS: ${switchgearStatus.trim()}`,
            `COMMENTS: ${switchgearComments.trim()}`,
          ]
            .filter((line) => line.split(": ")[1])
            .join("\n")
        : "";
    const transformerAttributeNotes =
      activeAssetForm === "transformer"
        ? [
            `TRANSFORMERS: ${title.trim()}`,
            `FEEDER: ${transformerFeeder.trim()}`,
            `TRANSFORMER POINT NAME: ${transformerPointName.trim()}`,
            `PRIMARY SUBSTATION: ${transformerPrimarySubstation.trim()}`,
            `SERIAL NUM: ${transformerSerialNum.trim()}`,
            `HIGH VOLTAGE: ${transformerHighVoltage.trim()}`,
            `LOW VOLATGE: ${transformerLowVoltage.trim()}`,
            `CAPACITY: ${transformerCapacity.trim()}`,
            `MOUNTING: ${transformerMounting}`,
            `MAKE: ${transformerMake.trim()}`,
            `TRANS INSULATOR: ${transformerInsulator}`,
            `INSTALLATION YEAR: ${transformerInstallationYear.trim()}`,
            `COMMENTS: ${transformerComments.trim()}`,
          ]
            .filter((line) => line.split(": ")[1])
            .join("\n")
        : "";
    const mergedNotes = [
      notes.trim(),
      poleAttributeNotes,
      switchgearAttributeNotes,
      transformerAttributeNotes,
    ]
      .filter(Boolean)
      .join("\n\n");

    await insertObservation({
      title: t,
      notes: mergedNotes,
      siteId: siteId.trim(),
      featureType,
      condition,
      collectorName: collectorName.trim(),
      location,
    });
    if (activeAssetForm !== "pole") {
      clearForm();
    }
    await load();
    setHasPendingEdits(false);
    Alert.alert("Saved", "Form saved with GPS coordinates.");
  }, [
    title,
    notes,
    poleFeederName,
    poleVoltage,
    poleMaterialType,
    polePositionType,
    poleConstructionType,
    poleCrossArm,
    poleEarthWireType,
    poleEarthWireSize,
    poleConductorSize,
    poleConductorType,
    poleInsulatorMaterial,
    poleInsulatorType,
    poleStayNum,
    poleStayType,
    poleStayWireGauge,
    poleComments,
    switchgearSerialNo,
    switchgearMake,
    switchgearModel,
    switchgearType,
    switchgearConstructionType,
    switchgearMco,
    switchgearBusbarsNo,
    switchgearOpType,
    switchgearStandard,
    switchgearVoltage,
    switchgearInsulationInterrupting,
    switchgearRatedCc,
    switchgearRatedMc,
    switchgearRatedScwt,
    switchgearRatedStwc,
    switchgearControlVoltage,
    switchgearMotorOst,
    switchgearMotorVoltage,
    switchgearAuxVoltage,
    switchgearPossibleCountSetting,
    switchgearAutoReclosingType,
    switchgearDutyCycle,
    switchgearYearOfManufacture,
    switchgearNetMass,
    switchgearNormalOperationStatus,
    switchgearOcInstalled,
    switchgearAssetNo,
    switchgearBayType,
    switchgearUse,
    switchgearTripCoilsNo,
    switchgearBil,
    switchgearFeederCode,
    switchgearNum,
    switchgearStatus,
    switchgearComments,
    transformerFeeder,
    transformerPointName,
    transformerPrimarySubstation,
    transformerSerialNum,
    transformerHighVoltage,
    transformerLowVoltage,
    transformerCapacity,
    transformerMounting,
    transformerMake,
    transformerInsulator,
    transformerInstallationYear,
    transformerComments,
    siteId,
    featureType,
    condition,
    collectorName,
    activeAssetForm,
    load,
    gpsCoords,
    clearForm,
  ]);

  const renderOptionChips = useCallback(
    (
      options: readonly string[],
      value: string,
      setValue: (next: string) => void,
      compact = true
    ) => (
      <View style={styles.chipWrap}>
        {options.map((item) => {
          const selected = value === item;
          return (
            <Pressable
              key={item}
              onPress={() =>
                setValue(selected ? "" : item)
              }
              style={({ pressed }) => [
                compact ? styles.chipSmall : styles.chip,
                selected && styles.chipSelected,
                pressed && styles.chipPressed,
              ]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>
    ),
    []
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#0c6b4d"
          colors={["#0c6b4d"]}
        />
      }
    >
      <Text style={styles.title}>MobileGIS</Text>
      {form ? (
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          onPress={confirmLeaveWithoutSaving}
        >
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
      ) : null}
      {form ? (
        <Text style={styles.contextTag}>
          Active form: {form === "meter" ? "Meter" : form.charAt(0).toUpperCase() + form.slice(1)}
        </Text>
      ) : null}
      <View style={styles.gpsBanner}>
        <Text style={styles.gpsBannerTitle}>GPS (mandatory)</Text>
        <Text style={styles.gpsBannerValue}>{coordsLabel}</Text>
        <Text style={styles.gpsBannerMeta}>
          Permission: {gpsPermission ?? "pending"}
        </Text>
        {gpsError ? <Text style={styles.gpsBannerErr}>{gpsError}</Text> : null}
      </View>

      {!form ? (
        <View style={styles.modeRow}>
          <Pressable
            onPress={() => setMode("general")}
            style={({ pressed }) => [
              styles.modeChip,
              mode === "general" && styles.modeChipOn,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.modeChipText,
                mode === "general" && styles.modeChipTextOn,
              ]}
            >
              General
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode("meters")}
            style={({ pressed }) => [
              styles.modeChip,
              mode === "meters" && styles.modeChipOn,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.modeChipText,
                mode === "meters" && styles.modeChipTextOn,
              ]}
            >
              Meter
            </Text>
          </Pressable>
        </View>
      ) : null}

      {mode === "general" ? (
        <>
      <Text style={styles.sectionLabel}>
        {activeAssetLabel ? `${activeAssetLabel} details` : "Identification"}
      </Text>

      <Text style={styles.label}>{activeAssetLabel ? `${activeAssetLabel} name *` : "Feature name *"}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={(v) => {
          setTitle(v);
          setHasPendingEdits(true);
        }}
        placeholder={
          activeAssetLabel
            ? `Enter ${activeAssetLabel.toLowerCase()} reference`
            : "e.g. MH-12, Oak-03, culvert inlet"
        }
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Site / plot / survey ID</Text>
      <TextInput
        style={styles.input}
        value={siteId}
        onChangeText={(v) => {
          setSiteId(v);
          setHasPendingEdits(true);
        }}
        placeholder="Optional project or plot code"
        placeholderTextColor="#9ca3af"
      />

      {activeAssetLabel ? (
        <View style={styles.lockedType}>
          <Text style={styles.label}>Feature type</Text>
          <Text style={styles.lockedTypeValue}>{activeAssetLabel}</Text>
        </View>
      ) : (
        <>
          <Text style={styles.label}>Feature type</Text>
          <View style={styles.chipWrap}>
            {FEATURE_TYPES.map((ft) => {
              const selected = featureType === ft;
              return (
                <Pressable
                  key={ft}
                  onPress={() =>
                    setFeatureType((prev) => {
                      setHasPendingEdits(true);
                      return prev === ft ? "" : ft;
                    })
                  }
                  style={({ pressed }) => [
                    styles.chip,
                    selected && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text
                    style={[styles.chipText, selected && styles.chipTextSelected]}
                  >
                    {ft}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}

      <Text style={styles.sectionLabel}>Assessment</Text>

      <Text style={styles.label}>Condition</Text>
      <View style={styles.chipRow}>
        {CONDITIONS.map((c) => {
          const selected = condition === c;
          return (
            <Pressable
              key={c}
              onPress={() =>
                setCondition((prev) => {
                  setHasPendingEdits(true);
                  return prev === c ? "" : c;
                })
              }
              style={({ pressed }) => [
                styles.chipSmall,
                selected && styles.chipSelected,
                pressed && styles.chipPressed,
              ]}
            >
              <Text
                style={[styles.chipText, selected && styles.chipTextSelected]}
              >
                {c}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Collector name</Text>
      <TextInput
        style={styles.input}
        value={collectorName}
        onChangeText={(v) => {
          setCollectorName(v);
          setHasPendingEdits(true);
        }}
        placeholder="Who completed this form"
        placeholderTextColor="#9ca3af"
        autoCapitalize="words"
      />

      <Text style={styles.sectionLabel}>Details</Text>

      {activeAssetForm === "pole" ? (
        <>
          <Text style={styles.label}>Feeder name</Text>
          <TextInput
            style={styles.input}
            value={poleFeederName}
            onChangeText={(v) => {
              setPoleFeederName(v);
              setHasPendingEdits(true);
            }}
            placeholder="2_FEEDER_NAME"
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.label}>Voltage</Text>
          <View style={styles.chipWrap}>
            {POLE_VOLTAGES.map((item) => {
              const selected = poleVoltage === item;
              return (
                <Pressable
                  key={item}
                  onPress={() =>
                    setPoleVoltage((prev) => {
                      setHasPendingEdits(true);
                      return prev === item ? "" : item;
                    })
                  }
                  style={({ pressed }) => [
                    styles.chipSmall,
                    selected && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Material type</Text>
          <View style={styles.chipWrap}>
            {POLE_MATERIAL_TYPES.map((item) => {
              const selected = poleMaterialType === item;
              return (
                <Pressable
                  key={item}
                  onPress={() =>
                    setPoleMaterialType((prev) => {
                      setHasPendingEdits(true);
                      return prev === item ? "" : item;
                    })
                  }
                  style={({ pressed }) => [
                    styles.chipSmall,
                    selected && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Position type</Text>
          <View style={styles.chipWrap}>
            {POLE_POSITION_TYPES.map((item) => {
              const selected = polePositionType === item;
              return (
                <Pressable
                  key={item}
                  onPress={() =>
                    setPolePositionType((prev) => {
                      setHasPendingEdits(true);
                      return prev === item ? "" : item;
                    })
                  }
                  style={({ pressed }) => [
                    styles.chip,
                    selected && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Construction type</Text>
          <View style={styles.chipWrap}>
            {POLE_CONSTRUCTION_TYPES.map((item) => {
              const selected = poleConstructionType === item;
              return (
                <Pressable
                  key={item}
                  onPress={() =>
                    setPoleConstructionType((prev) => {
                      setHasPendingEdits(true);
                      return prev === item ? "" : item;
                    })
                  }
                  style={({ pressed }) => [
                    styles.chipSmall,
                    selected && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Cross arm</Text>
          <View style={styles.chipWrap}>
            {POLE_CROSS_ARMS.map((item) => {
              const selected = poleCrossArm === item;
              return (
                <Pressable
                  key={item}
                  onPress={() =>
                    setPoleCrossArm((prev) => {
                      setHasPendingEdits(true);
                      return prev === item ? "" : item;
                    })
                  }
                  style={({ pressed }) => [
                    styles.chipSmall,
                    selected && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Earth wire type</Text>
          <View style={styles.chipWrap}>
            {POLE_EARTH_WIRE_TYPES.map((item) => {
              const selected = poleEarthWireType === item;
              return (
                <Pressable
                  key={item}
                  onPress={() =>
                    setPoleEarthWireType((prev) => {
                      setHasPendingEdits(true);
                      return prev === item ? "" : item;
                    })
                  }
                  style={({ pressed }) => [
                    styles.chipSmall,
                    selected && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Earth wire size</Text>
          <View style={styles.chipWrap}>
            {POLE_EARTH_WIRE_SIZES.map((item) => {
              const selected = poleEarthWireSize === item;
              return (
                <Pressable
                  key={item}
                  onPress={() =>
                    setPoleEarthWireSize((prev) => {
                      setHasPendingEdits(true);
                      return prev === item ? "" : item;
                    })
                  }
                  style={({ pressed }) => [
                    styles.chipSmall,
                    selected && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Conductor size</Text>
          <TextInput
            style={styles.input}
            value={poleConductorSize}
            onChangeText={(v) => {
              setPoleConductorSize(v);
              setHasPendingEdits(true);
            }}
            placeholder="10_CONDUCTOR_SIZE"
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.label}>Conductor type</Text>
          <View style={styles.chipWrap}>
            {POLE_CONDUCTOR_TYPES.map((item) => {
              const selected = poleConductorType === item;
              return (
                <Pressable
                  key={item}
                  onPress={() =>
                    setPoleConductorType((prev) => {
                      setHasPendingEdits(true);
                      return prev === item ? "" : item;
                    })
                  }
                  style={({ pressed }) => [
                    styles.chipSmall,
                    selected && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Insulator material</Text>
          <View style={styles.chipWrap}>
            {POLE_INSULATOR_MATERIALS.map((item) => {
              const selected = poleInsulatorMaterial === item;
              return (
                <Pressable
                  key={item}
                  onPress={() =>
                    setPoleInsulatorMaterial((prev) => {
                      setHasPendingEdits(true);
                      return prev === item ? "" : item;
                    })
                  }
                  style={({ pressed }) => [
                    styles.chipSmall,
                    selected && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Insulator type</Text>
          <View style={styles.chipWrap}>
            {POLE_INSULATOR_TYPES.map((item) => {
              const selected = poleInsulatorType === item;
              return (
                <Pressable
                  key={item}
                  onPress={() =>
                    setPoleInsulatorType((prev) => {
                      setHasPendingEdits(true);
                      return prev === item ? "" : item;
                    })
                  }
                  style={({ pressed }) => [
                    styles.chipSmall,
                    selected && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Stay number</Text>
          <TextInput
            style={styles.input}
            value={poleStayNum}
            onChangeText={(v) => {
              setPoleStayNum(v);
              setHasPendingEdits(true);
            }}
            placeholder="14_STAY_NUM"
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.label}>Stay type</Text>
          <View style={styles.chipWrap}>
            {POLE_STAY_TYPES.map((item) => {
              const selected = poleStayType === item;
              return (
                <Pressable
                  key={item}
                  onPress={() =>
                    setPoleStayType((prev) => {
                      setHasPendingEdits(true);
                      return prev === item ? "" : item;
                    })
                  }
                  style={({ pressed }) => [
                    styles.chipSmall,
                    selected && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Stay wire gauge</Text>
          <View style={styles.chipWrap}>
            {POLE_STAY_WIRE_GAUGES.map((item) => {
              const selected = poleStayWireGauge === item;
              return (
                <Pressable
                  key={item}
                  onPress={() =>
                    setPoleStayWireGauge((prev) => {
                      setHasPendingEdits(true);
                      return prev === item ? "" : item;
                    })
                  }
                  style={({ pressed }) => [
                    styles.chipSmall,
                    selected && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Pole comments</Text>
          <TextInput
            style={[styles.input, styles.notes]}
            value={poleComments}
            onChangeText={(v) => {
              setPoleComments(v);
              setHasPendingEdits(true);
            }}
            placeholder="17_COMMENTS"
            placeholderTextColor="#9ca3af"
            multiline
          />
        </>
      ) : null}

      {activeAssetForm === "switchgear" ? (
        <>
          <Text style={styles.label}>Serial no</Text>
          <TextInput style={styles.input} value={switchgearSerialNo} onChangeText={(v) => { setSwitchgearSerialNo(v); setHasPendingEdits(true); }} placeholder="2_SERIAL_NO" placeholderTextColor="#9ca3af" />
          <Text style={styles.label}>Make</Text>
          <TextInput style={styles.input} value={switchgearMake} onChangeText={(v) => { setSwitchgearMake(v); setHasPendingEdits(true); }} placeholder="3_MAKE" placeholderTextColor="#9ca3af" />
          <Text style={styles.label}>Model</Text>
          <TextInput style={styles.input} value={switchgearModel} onChangeText={(v) => { setSwitchgearModel(v); setHasPendingEdits(true); }} placeholder="4_MODEL" placeholderTextColor="#9ca3af" />

          <Text style={styles.label}>Switch gear type</Text>
          {renderOptionChips(SWITCHGEAR_TYPES, switchgearType, (next) => { setSwitchgearType(next); setHasPendingEdits(true); }, false)}
          <Text style={styles.label}>Construction type</Text>
          {renderOptionChips(SWITCHGEAR_CONSTRUCTION_TYPES, switchgearConstructionType, (next) => { setSwitchgearConstructionType(next); setHasPendingEdits(true); })}
          <Text style={styles.label}>MCO</Text>
          {renderOptionChips(SWITCHGEAR_MCO_OPTIONS, switchgearMco, (next) => { setSwitchgearMco(next); setHasPendingEdits(true); })}

          <Text style={styles.label}>Busbars no</Text>
          <TextInput style={styles.input} value={switchgearBusbarsNo} onChangeText={(v) => { setSwitchgearBusbarsNo(v); setHasPendingEdits(true); }} placeholder="8_BUSBARS_NO" placeholderTextColor="#9ca3af" />
          <Text style={styles.label}>Op type</Text>
          {renderOptionChips(SWITCHGEAR_OP_TYPES, switchgearOpType, (next) => { setSwitchgearOpType(next); setHasPendingEdits(true); })}
          <Text style={styles.label}>Standard</Text>
          <TextInput style={styles.input} value={switchgearStandard} onChangeText={(v) => { setSwitchgearStandard(v); setHasPendingEdits(true); }} placeholder="10_STANDARD" placeholderTextColor="#9ca3af" />

          <Text style={styles.label}>Voltage</Text>
          {renderOptionChips(SWITCHGEAR_VOLTAGES, switchgearVoltage, (next) => { setSwitchgearVoltage(next); setHasPendingEdits(true); })}
          <Text style={styles.label}>Insulation/interrupting</Text>
          {renderOptionChips(SWITCHGEAR_INSULATION_TYPES, switchgearInsulationInterrupting, (next) => { setSwitchgearInsulationInterrupting(next); setHasPendingEdits(true); })}

          <Text style={styles.label}>Rated CC</Text>
          <TextInput style={styles.input} value={switchgearRatedCc} onChangeText={(v) => { setSwitchgearRatedCc(v); setHasPendingEdits(true); }} placeholder="13_RATED_CC" placeholderTextColor="#9ca3af" />
          <Text style={styles.label}>Rated MC</Text>
          <TextInput style={styles.input} value={switchgearRatedMc} onChangeText={(v) => { setSwitchgearRatedMc(v); setHasPendingEdits(true); }} placeholder="14_RATED_MC" placeholderTextColor="#9ca3af" />
          <Text style={styles.label}>Rated SCWT</Text>
          <TextInput style={styles.input} value={switchgearRatedScwt} onChangeText={(v) => { setSwitchgearRatedScwt(v); setHasPendingEdits(true); }} placeholder="15_RATED_SCWT" placeholderTextColor="#9ca3af" />
          <Text style={styles.label}>Rated STWC</Text>
          <TextInput style={styles.input} value={switchgearRatedStwc} onChangeText={(v) => { setSwitchgearRatedStwc(v); setHasPendingEdits(true); }} placeholder="16_RATED_STWC" placeholderTextColor="#9ca3af" />

          <Text style={styles.label}>Control voltage</Text>
          {renderOptionChips(SWITCHGEAR_CONTROL_VOLTAGES, switchgearControlVoltage, (next) => { setSwitchgearControlVoltage(next); setHasPendingEdits(true); })}
          <Text style={styles.label}>Motor OST</Text>
          {renderOptionChips(SWITCHGEAR_MOTOR_OST_OPTIONS, switchgearMotorOst, (next) => { setSwitchgearMotorOst(next); setHasPendingEdits(true); })}
          <Text style={styles.label}>Motor voltage</Text>
          {renderOptionChips(SWITCHGEAR_MOTOR_VOLTAGES, switchgearMotorVoltage, (next) => { setSwitchgearMotorVoltage(next); setHasPendingEdits(true); })}
          <Text style={styles.label}>Aux voltage</Text>
          {renderOptionChips(SWITCHGEAR_AUX_VOLTAGES, switchgearAuxVoltage, (next) => { setSwitchgearAuxVoltage(next); setHasPendingEdits(true); })}

          <Text style={styles.label}>Possible count setting</Text>
          <TextInput style={styles.input} value={switchgearPossibleCountSetting} onChangeText={(v) => { setSwitchgearPossibleCountSetting(v); setHasPendingEdits(true); }} placeholder="21_POSSIBLE_COUNT_SE" placeholderTextColor="#9ca3af" />
          <Text style={styles.label}>Auto reclosing type</Text>
          {renderOptionChips(SWITCHGEAR_AUTO_RECLOSING_TYPES, switchgearAutoReclosingType, (next) => { setSwitchgearAutoReclosingType(next); setHasPendingEdits(true); })}
          <Text style={styles.label}>Duty cycle</Text>
          <TextInput style={styles.input} value={switchgearDutyCycle} onChangeText={(v) => { setSwitchgearDutyCycle(v); setHasPendingEdits(true); }} placeholder="23_DUTY_CYCLE" placeholderTextColor="#9ca3af" />
          <Text style={styles.label}>Year of manufacture</Text>
          <TextInput style={styles.input} value={switchgearYearOfManufacture} onChangeText={(v) => { setSwitchgearYearOfManufacture(v); setHasPendingEdits(true); }} placeholder="24_YEAR_OF_MANUFACTU" placeholderTextColor="#9ca3af" />
          <Text style={styles.label}>Net mass</Text>
          <TextInput style={styles.input} value={switchgearNetMass} onChangeText={(v) => { setSwitchgearNetMass(v); setHasPendingEdits(true); }} placeholder="25_NET_MASS" placeholderTextColor="#9ca3af" />

          <Text style={styles.label}>Normal operation status</Text>
          {renderOptionChips(SWITCHGEAR_OPERATION_STATUSES, switchgearNormalOperationStatus, (next) => { setSwitchgearNormalOperationStatus(next); setHasPendingEdits(true); })}
          <Text style={styles.label}>OC installed</Text>
          {renderOptionChips(SWITCHGEAR_OC_INSTALLED_OPTIONS, switchgearOcInstalled, (next) => { setSwitchgearOcInstalled(next); setHasPendingEdits(true); })}

          <Text style={styles.label}>Asset no</Text>
          <TextInput style={styles.input} value={switchgearAssetNo} onChangeText={(v) => { setSwitchgearAssetNo(v); setHasPendingEdits(true); }} placeholder="28_ASSET_NO" placeholderTextColor="#9ca3af" />
          <Text style={styles.label}>Bay type</Text>
          {renderOptionChips(SWITCHGEAR_BAY_TYPES, switchgearBayType, (next) => { setSwitchgearBayType(next); setHasPendingEdits(true); }, false)}
          <Text style={styles.label}>Use</Text>
          {renderOptionChips(SWITCHGEAR_USE_OPTIONS, switchgearUse, (next) => { setSwitchgearUse(next); setHasPendingEdits(true); }, false)}

          <Text style={styles.label}>Trip coils no</Text>
          <TextInput style={styles.input} value={switchgearTripCoilsNo} onChangeText={(v) => { setSwitchgearTripCoilsNo(v); setHasPendingEdits(true); }} placeholder="31_TRIP_COILS_NO" placeholderTextColor="#9ca3af" />
          <Text style={styles.label}>BIL</Text>
          <TextInput style={styles.input} value={switchgearBil} onChangeText={(v) => { setSwitchgearBil(v); setHasPendingEdits(true); }} placeholder="32_BIL" placeholderTextColor="#9ca3af" />
          <Text style={styles.label}>Feeder code</Text>
          <TextInput style={styles.input} value={switchgearFeederCode} onChangeText={(v) => { setSwitchgearFeederCode(v); setHasPendingEdits(true); }} placeholder="33_FEEDER_CODE" placeholderTextColor="#9ca3af" />
          <Text style={styles.label}>Switch gear num</Text>
          <TextInput style={styles.input} value={switchgearNum} onChangeText={(v) => { setSwitchgearNum(v); setHasPendingEdits(true); }} placeholder="34_SWITCH_GEAR_NUM" placeholderTextColor="#9ca3af" />
          <Text style={styles.label}>Status</Text>
          <TextInput style={styles.input} value={switchgearStatus} onChangeText={(v) => { setSwitchgearStatus(v); setHasPendingEdits(true); }} placeholder="35_STATUS" placeholderTextColor="#9ca3af" />
          <Text style={styles.label}>Switchgear comments</Text>
          <TextInput style={[styles.input, styles.notes]} value={switchgearComments} onChangeText={(v) => { setSwitchgearComments(v); setHasPendingEdits(true); }} placeholder="36_COMMENTS" placeholderTextColor="#9ca3af" multiline />
        </>
      ) : null}

      {activeAssetForm === "transformer" ? (
        <>
          <Text style={styles.label}>Feeder</Text>
          <TextInput
            style={styles.input}
            value={transformerFeeder}
            onChangeText={(v) => {
              setTransformerFeeder(v);
              setHasPendingEdits(true);
            }}
            placeholder="2_FEEDER"
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.label}>Transformer point name</Text>
          <TextInput
            style={styles.input}
            value={transformerPointName}
            onChangeText={(v) => {
              setTransformerPointName(v);
              setHasPendingEdits(true);
            }}
            placeholder="3_TRANSFORMER_POINT_"
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.label}>Primary substation</Text>
          <TextInput
            style={styles.input}
            value={transformerPrimarySubstation}
            onChangeText={(v) => {
              setTransformerPrimarySubstation(v);
              setHasPendingEdits(true);
            }}
            placeholder="4_PRIMARY_SUBSTATION"
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.label}>Serial num</Text>
          <TextInput
            style={styles.input}
            value={transformerSerialNum}
            onChangeText={(v) => {
              setTransformerSerialNum(v);
              setHasPendingEdits(true);
            }}
            placeholder="5_SERIAL_NUM"
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.label}>High voltage</Text>
          <TextInput
            style={styles.input}
            value={transformerHighVoltage}
            onChangeText={(v) => {
              setTransformerHighVoltage(v);
              setHasPendingEdits(true);
            }}
            placeholder="6_HIGH_VOLTAGE"
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.label}>Low volatge</Text>
          <TextInput
            style={styles.input}
            value={transformerLowVoltage}
            onChangeText={(v) => {
              setTransformerLowVoltage(v);
              setHasPendingEdits(true);
            }}
            placeholder="7_LOW_VOLATGE"
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.label}>Capacity</Text>
          <TextInput
            style={styles.input}
            value={transformerCapacity}
            onChangeText={(v) => {
              setTransformerCapacity(v);
              setHasPendingEdits(true);
            }}
            placeholder="8_CAPACITY"
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.label}>Mounting</Text>
          {renderOptionChips(
            TRANSFORMER_MOUNTINGS,
            transformerMounting,
            (next) => {
              setTransformerMounting(next);
              setHasPendingEdits(true);
            }
          )}

          <Text style={styles.label}>Make</Text>
          <TextInput
            style={styles.input}
            value={transformerMake}
            onChangeText={(v) => {
              setTransformerMake(v);
              setHasPendingEdits(true);
            }}
            placeholder="10_MAKE"
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.label}>Trans insulator</Text>
          {renderOptionChips(
            TRANSFORMER_INSULATORS,
            transformerInsulator,
            (next) => {
              setTransformerInsulator(next);
              setHasPendingEdits(true);
            }
          )}

          <Text style={styles.label}>Installation year</Text>
          <TextInput
            style={styles.input}
            value={transformerInstallationYear}
            onChangeText={(v) => {
              setTransformerInstallationYear(v);
              setHasPendingEdits(true);
            }}
            placeholder="12_INSTALLATION_YEAR"
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.label}>Transformer comments</Text>
          <TextInput
            style={[styles.input, styles.notes]}
            value={transformerComments}
            onChangeText={(v) => {
              setTransformerComments(v);
              setHasPendingEdits(true);
            }}
            placeholder="13_COMMENTS"
            placeholderTextColor="#9ca3af"
            multiline
          />
        </>
      ) : null}

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.notes]}
        value={notes}
        onChangeText={(v) => {
          setNotes(v);
          setHasPendingEdits(true);
        }}
        placeholder="Measurements, hazards, access, photos reference…"
        placeholderTextColor="#9ca3af"
        multiline
      />

      <Text style={styles.sectionLabel}>Location</Text>
      <Text style={styles.gpsHint}>
        GPS is always on while this screen is open. Current coordinates above
        will be saved with each record.
      </Text>

      <View style={styles.row}>
        <Pressable
          style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
          onPress={save}
        >
          <Text style={styles.primaryText}>Save record</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
          onPress={load}
        >
          <Text style={styles.secondaryText}>Refresh list</Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [styles.clearDraft, pressed && styles.pressed]}
        onPress={clearForm}
      >
        <Text style={styles.clearDraftText}>Clear draft form</Text>
      </Pressable>

        </>
      ) : (
        <>
          <Text style={styles.sectionLabel}>Meter details</Text>
          <Text style={styles.label}>Meter number *</Text>
          <TextInput
            style={[styles.input, styles.notes]}
            value={meterno}
            onChangeText={(v) => {
              setMeterno(v);
              setHasPendingEdits(true);
            }}
            placeholder="Enter meter number"
            placeholderTextColor="#9ca3af"
            multiline
          />

          <Text style={styles.label}>Phase *</Text>
          <View style={styles.chipWrap}>
            {METER_PHASES.map((p) => {
              const selected = phases === p;
              return (
                <Pressable
                  key={p}
                  onPress={() =>
                    setPhases((prev) => {
                      setHasPendingEdits(true);
                      return prev === p ? "" : p;
                    })
                  }
                  style={({ pressed }) => [
                    styles.chip,
                    selected && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected && styles.chipTextSelected,
                    ]}
                  >
                    {p}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>MCB size</Text>
          <View style={styles.chipWrap}>
            {METER_MCBSIZES.map((sz) => {
              const selected = mcbsize === sz;
              return (
                <Pressable
                  key={sz}
                  onPress={() =>
                    setMcbsize((prev) => {
                      setHasPendingEdits(true);
                      return prev === sz ? "" : sz;
                    })
                  }
                  style={({ pressed }) => [
                    styles.chipSmall,
                    selected && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected && styles.chipTextSelected,
                    ]}
                  >
                    {sz}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Comments</Text>
          <TextInput
            style={[styles.input, styles.notes]}
            value={meterComments}
            onChangeText={(v) => {
              setMeterComments(v);
              setHasPendingEdits(true);
            }}
            placeholder="Optional"
            placeholderTextColor="#9ca3af"
            multiline
          />

          <Text style={styles.sectionLabel}>Location</Text>
          <Text style={styles.gpsHint}>
            GPS is always on while this screen is open. Current coordinates above
            will be saved with each meter record.
          </Text>

          <View style={styles.row}>
            <Pressable
              style={({ pressed }) => [
                styles.primary,
                pressed && styles.pressed,
              ]}
              onPress={saveMeter}
            >
              <Text style={styles.primaryText}>Save meter</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.secondary,
                pressed && styles.pressed,
              ]}
              onPress={loadMeters}
            >
              <Text style={styles.secondaryText}>Refresh list</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.clearDraft,
              pressed && styles.pressed,
            ]}
            onPress={clearMeterForm}
          >
            <Text style={styles.clearDraftText}>Clear draft form</Text>
          </Pressable>

        </>
      )}

      <Text style={styles.section}>
        {mode === "general" ? "Recent records" : "Recent meter records"}
      </Text>
      {mode === "general" ? (
        rows.length === 0 ? (
        <Text style={styles.empty}>No rows yet. Save a form above.</Text>
      ) : (
        rows.map((r) => (
          <View key={r.id} style={styles.rowItem}>
            <View style={styles.rowHeader}>
              <Text style={styles.rowMeta}>#{r.id} · {r.createdAt}</Text>
              <Pressable
                onPress={() => confirmDelete(r)}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.deleteBtn,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </Pressable>
            </View>
            <Text style={styles.rowTitle}>{r.title}</Text>
            {r.siteId ? (
              <Text style={styles.rowLine}>Site: {r.siteId}</Text>
            ) : null}
            {r.featureType ? (
              <Text style={styles.rowLine}>Type: {r.featureType}</Text>
            ) : null}
            {r.condition ? (
              <Text style={styles.rowLine}>Condition: {r.condition}</Text>
            ) : null}
            {r.collectorName ? (
              <Text style={styles.rowLine}>By: {r.collectorName}</Text>
            ) : null}
            {r.latitude != null && r.longitude != null ? (
              <Text style={styles.rowGps}>
                {r.latitude.toFixed(5)}, {r.longitude.toFixed(5)}
              </Text>
            ) : (
              <Text style={styles.rowNoGps}>No GPS stored</Text>
            )}
            {r.notes ? (
              <Text style={styles.rowNotes}>{r.notes}</Text>
            ) : null}
          </View>
        ))
      )
      ) : meterRows.length === 0 ? (
        <Text style={styles.empty}>No meter rows yet. Save above.</Text>
      ) : (
        meterRows.map((r) => (
          <View key={r.id} style={styles.rowItem}>
            <View style={styles.rowHeader}>
              <Text style={styles.rowMeta}>#{r.id} · {r.createdAt}</Text>
              <Pressable
                onPress={() => confirmDeleteMeter(r)}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.deleteBtn,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </Pressable>
            </View>
            <Text style={styles.rowTitle}>
              METERNO: {r.meterno || "—"}
            </Text>
            <Text style={styles.rowLine}>PHASES: {r.phases}</Text>
            {r.mcbsize ? (
              <Text style={styles.rowLine}>MCBSIZE: {r.mcbsize}</Text>
            ) : null}
            {r.comments ? (
              <Text style={styles.rowNotes}>{r.comments}</Text>
            ) : null}
            {r.latitude != null && r.longitude != null ? (
              <Text style={styles.rowGps}>
                {r.latitude.toFixed(5)}, {r.longitude.toFixed(5)}
              </Text>
            ) : (
              <Text style={styles.rowNoGps}>No GPS stored</Text>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f8faf9" },
  container: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  contextTag: {
    alignSelf: "flex-start",
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#0c6b4d",
    backgroundColor: "#ecfdf5",
    color: "#0c6b4d",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  backBtn: {
    alignSelf: "flex-start",
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  gpsBanner: {
    marginBottom: 14,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    backgroundColor: "#f0fdf4",
  },
  gpsBannerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#166534",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  gpsBannerValue: {
    fontSize: 15,
    color: "#14532d",
    fontFamily: "monospace",
    fontWeight: "600",
  },
  gpsBannerMeta: {
    marginTop: 4,
    fontSize: 12,
    color: "#166534",
  },
  gpsBannerErr: {
    marginTop: 6,
    fontSize: 12,
    color: "#991b1b",
  },
  mono: { fontFamily: "monospace", fontSize: 13, color: "#0c6b4d" },
  modeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  modeChip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  modeChipOn: {
    backgroundColor: "#ecfdf5",
    borderColor: "#0c6b4d",
  },
  modeChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  modeChipTextOn: { color: "#0c6b4d" },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0c6b4d",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    marginBottom: 14,
  },
  notes: { minHeight: 100, textAlignVertical: "top" },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    maxWidth: "100%",
  },
  chipSmall: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chipSelected: {
    backgroundColor: "#ecfdf5",
    borderColor: "#0c6b4d",
  },
  chipPressed: { opacity: 0.88 },
  chipText: { fontSize: 13, color: "#374151" },
  chipTextSelected: { color: "#0c6b4d", fontWeight: "600" },
  lockedType: {
    marginBottom: 14,
  },
  lockedTypeValue: {
    backgroundColor: "#ecfdf5",
    borderColor: "#0c6b4d",
    borderWidth: 1,
    color: "#0c6b4d",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontWeight: "600",
  },
  gpsHint: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 16,
  },
  row: { flexDirection: "row", gap: 12, marginBottom: 12 },
  clearDraft: {
    alignSelf: "center",
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearDraftText: {
    fontSize: 14,
    color: "#6b7280",
    textDecorationLine: "underline",
  },
  primary: {
    flex: 1,
    backgroundColor: "#0c6b4d",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  secondary: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0c6b4d",
  },
  pressed: { opacity: 0.92 },
  primaryText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  secondaryText: { color: "#0c6b4d", fontWeight: "600", fontSize: 16 },
  section: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  empty: { color: "#9ca3af", fontSize: 14 },
  rowItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  rowMeta: {
    fontSize: 12,
    color: "#9ca3af",
    flex: 1,
    fontVariant: ["tabular-nums"],
  },
  deleteBtn: { paddingVertical: 2, paddingHorizontal: 6 },
  deleteBtnText: { fontSize: 13, color: "#b91c1c", fontWeight: "600" },
  rowTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  rowLine: { fontSize: 13, color: "#4b5563", marginTop: 2 },
  rowGps: {
    fontSize: 13,
    color: "#0c6b4d",
    fontFamily: "monospace",
    marginTop: 6,
  },
  rowNoGps: { fontSize: 12, color: "#d97706", marginTop: 6 },
  rowNotes: { fontSize: 14, color: "#6b7280", marginTop: 6 },
});
