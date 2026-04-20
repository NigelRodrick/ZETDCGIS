import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import { meterEntriesToCsv, observationsToCsv } from "../../lib/csv";
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
  EPICOLLECT_MCBSIZES,
  EPICOLLECT_PHASES,
} from "../../lib/meterFormSchema";

type CollectMode = "general" | "meters";

export default function CollectScreen() {
  const [mode, setMode] = useState<CollectMode>("general");
  const [title, setTitle] = useState("");
  const [siteId, setSiteId] = useState("");
  const [featureType, setFeatureType] = useState("");
  const [condition, setCondition] = useState("");
  const [collectorName, setCollectorName] = useState("");
  const [notes, setNotes] = useState("");
  const [attachGps, setAttachGps] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rows, setRows] = useState<ObservationListItem[]>([]);
  const [meterRows, setMeterRows] = useState<MeterReadingItem[]>([]);

  const [meterno, setMeterno] = useState("");
  const [phases, setPhases] = useState("");
  const [mcbsize, setMcbsize] = useState("");
  const [meterComments, setMeterComments] = useState("");
  const [meterAttachGps, setMeterAttachGps] = useState(true);

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
  }, []);

  const clearMeterForm = useCallback(() => {
    setMeterno("");
    setPhases("");
    setMcbsize("");
    setMeterComments("");
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
      Alert.alert("METERNO required", "Enter the meter identifier (Epicollect).");
      return;
    }
    if (!phases) {
      Alert.alert("PHASES required", "Select RED, YELLOW, BLUE, or THREE PHASE.");
      return;
    }
    let location: { latitude: number; longitude: number } | null = null;
    if (meterAttachGps) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        location = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
      }
    }
    await insertMeterReading({
      meterno: m,
      phases,
      mcbsize: mcbsize.trim(),
      comments: meterComments.trim(),
      location,
    });
    clearMeterForm();
    await loadMeters();
    const msg =
      meterAttachGps && location
        ? "Meter saved with GPS."
        : meterAttachGps
          ? "Meter saved without GPS (permission denied or unavailable)."
          : "Meter saved without GPS.";
    Alert.alert("Saved", msg);
  }, [
    meterno,
    phases,
    mcbsize,
    meterComments,
    meterAttachGps,
    clearMeterForm,
    loadMeters,
  ]);

  const exportMeterCsv = useCallback(async () => {
    const all = await listMeterReadings(100_000);
    if (all.length === 0) {
      Alert.alert("Nothing to export", "Save at least one meter record first.");
      return;
    }
    const csv = meterEntriesToCsv(all);
    try {
      await Share.share({
        message: csv,
        title: "meters-epicollect.csv",
      });
    } catch {
      Alert.alert("Share failed", "Could not open the share sheet.");
    }
  }, []);

  const save = useCallback(async () => {
    const t = title.trim();
    if (!t) {
      Alert.alert(
        "Feature name required",
        "Enter a name or label for this feature (required field)."
      );
      return;
    }
    let location: { latitude: number; longitude: number } | null = null;
    if (attachGps) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        location = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
      }
    }
    await insertObservation({
      title: t,
      notes: notes.trim(),
      siteId: siteId.trim(),
      featureType,
      condition,
      collectorName: collectorName.trim(),
      location,
    });
    clearForm();
    await load();
    const msg =
      attachGps && location
        ? "Form saved with GPS."
        : attachGps
          ? "Form saved without GPS (permission denied or unavailable)."
          : "Form saved without GPS.";
    Alert.alert("Saved", msg);
  }, [
    title,
    notes,
    siteId,
    featureType,
    condition,
    collectorName,
    load,
    attachGps,
    clearForm,
  ]);

  const exportCsv = useCallback(async () => {
    const all = await listObservations(100_000);
    if (all.length === 0) {
      Alert.alert("Nothing to export", "Save at least one record first.");
      return;
    }
    const csv = observationsToCsv(all);
    try {
      await Share.share({
        message: csv,
        title: "observations.csv",
      });
    } catch {
      Alert.alert("Share failed", "Could not open the share sheet.");
    }
  }, []);

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
      <Text style={styles.sub}>
        Local-only storage. Use General for ad-hoc features (presets in{" "}
        <Text style={styles.mono}>lib/formSchema.ts</Text>
        ) or Meters for the Epicollect5 “METERS” form (southern-region-meters).
      </Text>

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
            Meters (Epicollect)
          </Text>
        </Pressable>
      </View>

      {mode === "general" ? (
        <>
      <Text style={styles.sectionLabel}>Identification</Text>

      <Text style={styles.label}>Feature name *</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. MH-12, Oak-03, culvert inlet"
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Site / plot / survey ID</Text>
      <TextInput
        style={styles.input}
        value={siteId}
        onChangeText={setSiteId}
        placeholder="Optional project or plot code"
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Feature type</Text>
      <View style={styles.chipWrap}>
        {FEATURE_TYPES.map((ft) => {
          const selected = featureType === ft;
          return (
            <Pressable
              key={ft}
              onPress={() =>
                setFeatureType((prev) => (prev === ft ? "" : ft))
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

      <Text style={styles.sectionLabel}>Assessment</Text>

      <Text style={styles.label}>Condition</Text>
      <View style={styles.chipRow}>
        {CONDITIONS.map((c) => {
          const selected = condition === c;
          return (
            <Pressable
              key={c}
              onPress={() => setCondition((prev) => (prev === c ? "" : c))}
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
        onChangeText={setCollectorName}
        placeholder="Who completed this form"
        placeholderTextColor="#9ca3af"
        autoCapitalize="words"
      />

      <Text style={styles.sectionLabel}>Details</Text>

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.notes]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Measurements, hazards, access, photos reference…"
        placeholderTextColor="#9ca3af"
        multiline
      />

      <Text style={styles.sectionLabel}>Location</Text>

      <View style={styles.switchRow}>
        <View style={styles.switchTextWrap}>
          <Text style={styles.switchLabel}>Attach GPS on save</Text>
          <Text style={styles.switchHint}>
            Stores coordinates for the Location tab and CSV export.
          </Text>
        </View>
        <Switch
          value={attachGps}
          onValueChange={setAttachGps}
          trackColor={{ false: "#d1d5db", true: "#86b8a6" }}
          thumbColor={attachGps ? "#0c6b4d" : "#f4f4f5"}
        />
      </View>

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

      <Pressable
        style={({ pressed }) => [styles.exportBtn, pressed && styles.pressed]}
        onPress={exportCsv}
      >
        <Text style={styles.exportText}>Export all as CSV (share)</Text>
      </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.sectionLabel}>Epicollect · group METER</Text>
          <Text style={styles.label}>METERNO *</Text>
          <TextInput
            style={[styles.input, styles.notes]}
            value={meterno}
            onChangeText={setMeterno}
            placeholder="Same as Epicollect textarea"
            placeholderTextColor="#9ca3af"
            multiline
          />

          <Text style={styles.label}>PHASES *</Text>
          <View style={styles.chipWrap}>
            {EPICOLLECT_PHASES.map((p) => {
              const selected = phases === p;
              return (
                <Pressable
                  key={p}
                  onPress={() => setPhases((prev) => (prev === p ? "" : p))}
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

          <Text style={styles.label}>MCBSIZE</Text>
          <View style={styles.chipWrap}>
            {EPICOLLECT_MCBSIZES.map((sz) => {
              const selected = mcbsize === sz;
              return (
                <Pressable
                  key={sz}
                  onPress={() =>
                    setMcbsize((prev) => (prev === sz ? "" : sz))
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

          <Text style={styles.label}>COMMENTS</Text>
          <TextInput
            style={[styles.input, styles.notes]}
            value={meterComments}
            onChangeText={setMeterComments}
            placeholder="Optional"
            placeholderTextColor="#9ca3af"
            multiline
          />

          <Text style={styles.sectionLabel}>LOCATION</Text>
          <View style={styles.switchRow}>
            <View style={styles.switchTextWrap}>
              <Text style={styles.switchLabel}>Attach GPS on save</Text>
              <Text style={styles.switchHint}>
                Maps to Epicollect LOCATION when enabled.
              </Text>
            </View>
            <Switch
              value={meterAttachGps}
              onValueChange={setMeterAttachGps}
              trackColor={{ false: "#d1d5db", true: "#86b8a6" }}
              thumbColor={meterAttachGps ? "#0c6b4d" : "#f4f4f5"}
            />
          </View>

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

          <Pressable
            style={({ pressed }) => [
              styles.exportBtn,
              pressed && styles.pressed,
            ]}
            onPress={exportMeterCsv}
          >
            <Text style={styles.exportText}>
              Export meters as CSV (share)
            </Text>
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
  sub: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6b7280",
    marginBottom: 16,
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
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  switchTextWrap: { flex: 1, paddingRight: 12 },
  switchLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  switchHint: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
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
  exportBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 24,
  },
  exportText: { color: "#374151", fontWeight: "600", fontSize: 15 },
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
