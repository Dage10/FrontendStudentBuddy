import {Pressable, StyleSheet, Text, View} from "react-native";
import { useSession } from "@/lib/session";
import { Screen } from "@/components/screen";

export default function Home() {
    const { signOut } = useSession();

    return (
        <Screen>
            <View style={styles.container}>
                <Pressable style={styles.button} onPress={signOut}>
                    <Text style={styles.buttonText}>Logout</Text>
                </Pressable>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: { padding: 24 },
    button: { backgroundColor: '#4F46E5', borderRadius: 5, padding: 10, alignSelf: 'flex-start' },
    buttonText: { color: '#FFFFFF', fontSize: 16 },
});