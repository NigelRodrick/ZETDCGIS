import Constants from "expo-constants";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const DEVELOPER_NAME = "Nigel Onai Rodrick Sibanda";

export default function SettingsScreen() {
  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loggedInAs, setLoggedInAs] = useState<string | null>(null);
  const appVersion = Constants.expoConfig?.version ?? "—";

  const login = () => {
    const next = nameInput.trim();
    if (!next || !passwordInput) {
      return;
    }
    setLoggedInAs(next);
    setNameInput("");
    setPasswordInput("");
  };

  const logout = () => {
    setLoggedInAs(null);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profile</Text>
        <Text style={styles.statusLabel}>
          Status: {loggedInAs ? `Logged in as ${loggedInAs}` : "Logged out"}
        </Text>
        {!loggedInAs ? (
          <>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="EC Number"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
            />
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={passwordInput}
              onChangeText={setPasswordInput}
              secureTextEntry
              autoCapitalize="none"
            />
            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
              onPress={login}
            >
              <Text style={styles.primaryBtnText}>Log in</Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
            onPress={logout}
          >
            <Text style={styles.secondaryBtnText}>Log out</Text>
          </Pressable>
        )}
      </View>

      <View style={[styles.card, styles.metaCard]}>
        <Text style={styles.cardTitle}>Application Info</Text>
        <Row label="Version" value={appVersion} />
        <Row label="Developer" value={DEVELOPER_NAME} />
      </View>
    </ScrollView>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} selectable>
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
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0c6b4d",
  },
  statusLabel: {
    fontSize: 14,
    color: "#374151",
  },
  inputLabel: {
    fontSize: 12,
    color: "#6b7280",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: -4,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
  },
  primaryBtn: {
    backgroundColor: "#0c6b4d",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  secondaryBtn: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#b91c1c",
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  secondaryBtnText: {
    color: "#b91c1c",
    fontWeight: "600",
    fontSize: 15,
  },
  row: { gap: 4 },
  rowLabel: { fontSize: 12, color: "#9ca3af", textTransform: "uppercase" },
  rowValue: { fontSize: 16, color: "#111827" },
  metaCard: { marginTop: 16 },
  pressed: { opacity: 0.92 },
});
