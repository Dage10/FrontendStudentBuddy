import { ScrollView, StyleSheet, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen'

export default function Study() {
    const { sessionId, topic, explanation } = useLocalSearchParams<{
        sessionId: string;
        topic: string;
        explanation: string;
    }>();

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.content}>
                <Card>
                    {sessionId ? (
                        <>
                            <Text style={styles.title}>{topic}</Text>
                            <Text style={styles.text}>{explanation}</Text>
                            <Button title="Start Quiz" onPress={() => router.push(`/quiz/${sessionId}`)}/>
                        </>
                    ) : (
                        <Text style={styles.text}>Nothing to study yet. Enter a topic in Home.</Text>
                    )}
                </Card>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
   content: { padding: 24, paddingBottom: 120 },
   title: { fontSize: 28, fontWeight: '600', color: '#0F172A' },
   text: { fontSize: 16, lineHeight: 26, color: '#334155' },
});