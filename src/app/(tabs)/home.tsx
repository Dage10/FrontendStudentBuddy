import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View} from "react-native";
import { router } from 'expo-router';
import { Button } from '@/components/button';
import { errorMessage, study } from '@/lib/api';
import { useSession } from "@/lib/session";
import { Screen } from "@/components/screen";
import { TAB_BAR_SPACE } from '@/constants/layout';

export default function Home() {
    const { token, signOut } = useSession();
    const [topic, setTopic] = useState('');
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState(false);

    async function onStudy(){
        const text = topic.trim();
        setLoading(true);
        setError(undefined);
        try{
            const { sessionId, explanation } = await study(token!, text);
            router.navigate({ pathname: '/study', params: { sessionId, topic: text, explanation } });
            setTopic('');
        }catch (e) {
            setError(errorMessage(e));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Screen>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
                <Button title="Logout" onPress={signOut} />
                <View style={styles.bottom}>
                    <Text style={styles.note}>
                        Your text is sent to Google (Gemini). On the free tier, Google may use it to improve its products.
                    </Text>
                    {error && <Text style={styles.error}>{error}</Text>}
                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
                            value={topic}
                            onChangeText={setTopic}
                            placeholder="Paste a topic to study"
                            maxLength={2000}
                            multiline
                            editable={!loading}
                        />
                        <Button title="Study" onPress={onStudy} disabled={!topic.trim()} loading={loading} />
                    </View>
                </View>

            </KeyboardAvoidingView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: { flex: 1, justifyContent: "space-between", padding: 24, paddingBottom: TAB_BAR_SPACE },
    bottom: { gap: 8 },
    row: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
    input: { flex: 1, maxHeight: 120, backgroundColor: 'rgb(255, 255, 255, 0.8)', borderRadius: 5, borderWidth: 1, borderColor: '#64748B', padding: 12 },
    note: { fontSize: 12 },
    error: { color: '#B91C1C' },
});