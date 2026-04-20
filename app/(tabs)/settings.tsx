import Constants from "expo-constants";
import * as Linking from "expo-linking";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  EPICOLLECT_FORMBUILDER_SOUTHERN_METERS,
  EPICOLLECT_PROJECT_SOUTHERN_METERS,
} from "../../lib/epicollectLinks";

export default function SettingsScreen() {
  const extra = Constants.expoConfig?.extra as
    | { eas?: { projectId?: string } }
    | undefined;
  const iosId = Constants.expoConfig?.ios?.bundleIdentifier ?? "—";
  const androidPkg = Constants.expoConfig?.android?.package ?? "—";

  const openUrl = async (url: string) => {
    const ok = await Linking.canOpenURL(url);
    if (!ok) {
      Alert.alert("Cannot open link", url);
      return;
    }
    await Linking.openURL(url);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Settings</Text>
      <View style={styles.card}>
        <Row label="App name" value={Constants.expoConfig?.name ?? "—"} />
        <Row label="Slug" value={Constants.expoConfig?.slug ?? "—"} />
        <Row label="Version" value={Constants.expoConfig?.version ?? "—"} />
        <Row label="Runtime" value={Platform.OS} />
        <Row label="iOS bundle ID" value={iosId} mono />
        <Row label="Android package" value={androidPkg} mono />
        <Row
          label="EAS project"
          value={extra?.eas?.projectId ?? "Run eas init to link"}
          mono
        />
      </View>

      <Text style={styles.section}>Epicollect5 (southern-region-meters)</Text>
      <Text style={styles.epiLead}>
        As project admin, sign in on the web (Google, Apple, or email), then use
        the buttons below. MobileGIS does not replace Epicollect login — it opens
        your project in the browser.
      </Text>
      <Pressable
        style={({ pressed }) => [styles.linkCard, pressed && styles.pressed]}
        onPress={() => void openUrl(EPICOLLECT_PROJECT_SOUTHERN_METERS)}
      >
        <Text style={styles.linkTitle}>Open project</Text>
        <Text style={styles.linkUrl} numberOfLines={2}>
          {EPICOLLECT_PROJECT_SOUTHERN_METERS}
        </Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.linkCard, pressed && styles.pressed]}
        onPress={() => void openUrl(EPICOLLECT_FORMBUILDER_SOUTHERN_METERS)}
      >
        <Text style={styles.linkTitle}>Edit form (Formbuilder)</Text>
        <Text style={styles.linkUrl} numberOfLines={2}>
          {EPICOLLECT_FORMBUILDER_SOUTHERN_METERS}
        </Text>
      </Pressable>

      <Text style={styles.hint}>
        Field records in MobileGIS stay on this device in SQLite until you export
        or delete them. The Collect “Meters” mode mirrors the Epicollect5 “METERS”
        form; after you change the live form, update{" "}
        <Text style={styles.monoInline}>assets/forms/meter-form.json</Text> and{" "}
        <Text style={styles.monoInline}>lib/meterFormSchema.ts</Text> (or re-sync
        from the project export API). Build iOS/Android with EAS:{" "}
        <Text style={styles.monoInline}>npx eas init</Text> then{" "}
        <Text style={styles.monoInline}>eas build --platform all</Text>.
      </Text>
    </ScrollView>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, mono && styles.mono]} selectable>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f8faf9" },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 12,
  },
  row: { gap: 4 },
  rowLabel: { fontSize: 12, color: "#9ca3af", textTransform: "uppercase" },
  rowValue: { fontSize: 16, color: "#111827" },
  mono: { fontFamily: "monospace", fontSize: 13 },
  section: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "700",
    color: "#0c6b4d",
  },
  epiLead: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6b7280",
    marginBottom: 12,
  },
  linkCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#0c6b4d",
    marginBottom: 10,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0c6b4d",
    marginBottom: 6,
  },
  linkUrl: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: "monospace",
  },
  pressed: { opacity: 0.92 },
  hint: {
    marginTop: 16,
    fontSize: 13,
    lineHeight: 20,
    color: "#6b7280",
  },
  monoInline: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#0c6b4d",
  },
});
