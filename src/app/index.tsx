import { Link } from "expo-router";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { Screen } from "@/components/screen"
import { GraduationCap } from "@/components/graduation-cap"

export default function Index() {
  return (
    <Screen>
        <View style={styles.container}>
          <Text style={styles.title}>Student Buddy</Text>
          <Text style={styles.subtitle}>{'Learn about topics\nyou need to improve.'}</Text>
          <View style={styles.container2}>
              <Link href={"/login"} style={styles.buttonPrimary}>Sign In</Link>
              <Text style={styles.text}>OR</Text>
              <Link href={"/register"} style={styles.buttonSecondary}>Sign Up</Link>
          </View>
          <GraduationCap/>
        </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
    container: { alignItems: "center", padding: 10, gap: 20},
    title: { fontSize: 30 },
    subtitle: { fontSize: 20, color: '#475569'},
    container2: { alignItems: "center", gap: 40, marginTop: 50},
    buttonPrimary: {
        fontSize: 20,
        color: '#FFFFFF',
        backgroundColor: '#4F46E5',
        padding: 10,
        minWidth: 150,
        textAlign: "center",
        borderRadius: 15,
    },
    text: { fontSize: 20, color: '#0F172A' },
    buttonSecondary: {
        fontSize: 20,
        color: '#4338CA',
        borderWidth: 1,
        borderColor: '#4F46E5',
        padding: 10,
        minWidth: 150,
        textAlign: "center",
        borderRadius: 15,
    }
})