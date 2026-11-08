import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { deleteAccount, errorMessage } from '@/lib/api';
import { useSession } from '@/lib/session';

export default function DeleteAccount() {
    const { token, signOut } = useSession();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();

    async function onDelete() {
        setLoading(true);
        setError(undefined);
        try {
            await deleteAccount(token!, password);
            await signOut();
        } catch (e) {
            setError(errorMessage(e));
        } finally {
            setLoading(false)
        }
    }

    return (
        <Screen>
            <Card style={styles.card}>
                <Text style={styles.title}>Delete account</Text>
                <Text style={styles.text}>
                    This permanently deletes your account and all your study sessions. Enter your password to confirm.
                </Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={128}
                />
                {error && <Text style={styles.error}>{error}</Text>}
                <Button title="Delete account" onPress={onDelete} disabled={!password} loading={loading} />
                <Button title="Cancel" onPress={() => router.back()} />
            </Card>
        </Screen>
    );
}

const styles = StyleSheet.create({
   card: { margin: 24 },
   title: { fontSize: 24, fontWeight: '600', color: '#0F172A' },
   text: { fontSize: 14, color: '#475569' },
   input: {
       borderWidth: 1,
       borderColor: '#64748B',
       borderRadius: 5,
       padding: 10,
       fontSize: 16,
       backgroundColor: 'rgba(255, 255, 255, 0.8)',
   },
   error: { fontSize: 14, color: '#B91C1C' },
});