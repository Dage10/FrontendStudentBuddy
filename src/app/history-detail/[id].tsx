import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { errorMessage, getHistoryDetail, type HistoryDetail } from '@/lib/api';
import { useSession } from '@/lib/session';

export default function HistoryDetailScreen() {
    const { id } = useLocalSearchParams<{id: string}>();
    const { token } = useSession();
    const [session, setSession] = useState<HistoryDetail>();
    const [error, setError] = useState<string>();

    useFocusEffect(
        useCallback(() => {
            getHistoryDetail(token!, id).then(setSession, (e) => setError(errorMessage(e)));
        }, [token, id]),
    );

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.content}>
                <Card>
                {error && <Text style={styles.error}>{error}</Text>}
                {!session && !error && <ActivityIndicator size="large" color="#4F4645" />}
                {session && (
                    <>
                        <Text style={styles.title}>{session.topic}</Text>
                        <Text style={styles.secondary}>{new Date(session.created_at).toLocaleDateString()}</Text>
                        <Text style={styles.text}>{session.explanation}</Text>
                        <Text style={styles.secondary}>Status: {session.pending ? 'Pending' : 'Completed'}</Text>
                        {session.pending ? (
                            <Button title="Continue Quiz" onPress={() => router.push(`/quiz/${id}`)} />
                        ) : (
                            <Text style={styles.secondary}>Grade: {session.correct}/{session.total}</Text>
                        )}
                    </>
                )}
                    <Button title="Back" onPress={() => router.back()}></Button>
                </Card>
            </ScrollView>
        </Screen>
    );
}

const styles= StyleSheet.create({
    content: { padding: 24, gap: 16},
    title: { fontSize: 28, fontWeight: '600', color: '#0F172A' },
    text: { fontSize: 16, lineHeight: 26, color: '#334155' },
    secondary: { fontSize: 14, color: '#475569' },
    error: { color: '#B91C1C', fontSize: 14, textAlign: 'center' },
});