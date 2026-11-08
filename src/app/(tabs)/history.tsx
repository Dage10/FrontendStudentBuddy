import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { errorMessage, getHistory, type HistoryItem } from '@/lib/api';
import { useSession } from '@/lib/session';
import {TAB_BAR_SPACE} from "@/constants/layout";


export default function History() {
    const { token } = useSession();
    const [items, setItems] = useState<HistoryItem[]>();
    const [error, setError] = useState<string>();

    useFocusEffect(
        useCallback(() => {
            getHistory(token!).then(setItems, (e) => setError(errorMessage(e)));
        }, [token]),
    );

    if (!items) {
        return (
            <Screen>
                <View style={styles.center}>
                    {error ? <Text style={styles.error}>{error}</Text> : <ActivityIndicator size="large" color="#4F4645" />}
                </View>
            </Screen>
        );
    }

    return (
        <Screen>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.content}
                ListEmptyComponent={<Text style={styles.text}>No sessions yet. Study a topic in Home.</Text>}
                renderItem={({ item }) => (
                    <Pressable onPress={() => router.push(`/history-detail/${item.id}`)}>
                        <Card>
                            <Text style={styles.text}>{new Date(item.created_at).toLocaleDateString()}</Text>
                            <Text style={styles.topic} numberOfLines={2}>{item.topic}</Text>
                            <Text style={styles.text}>{item.pending ? 'Pending' : `${item.correct}/${item.total}`}</Text>
                        </Card>
                    </Pressable>
                )}
                ListFooterComponent={<Button title="Delete account" onPress={() => router.push('/delete-account')} />}

            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: { padding: 24, paddingBottom: TAB_BAR_SPACE, gap: 12 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    topic: { fontSize: 18, fontWeight: '600', color: '#0F172A' },
    text: { fontSize: 14, color: '#475569' },
    error: { color: '#B91C1C', fontSize: 14, textAlign: 'center' },
})