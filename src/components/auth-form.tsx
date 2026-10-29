import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Screen } from '@/components/screen';
import { errorMessage, login, register} from "@/lib/api";

const common = { autoCapitalize: 'none', autoCorrect: false } as const;

export function AuthForm({ mode } : { mode: 'login' | 'register' }){
    const isLogin = mode === 'login';
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();

    async function onSubmit() {
        setLoading(true);
        setError(undefined);
        try {
            if (isLogin) {
                await login(username, password);
                router.replace('/home');
            } else {
                await register(username, email, password);
                router.replace('/login');
            }
        } catch (e){
            setError(errorMessage(e));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Screen>
            <View style={styles.container}>
                <Text style={styles.title}>{isLogin ? 'Sign in' : 'Sign up'}</Text>
                <Text style={styles.secondary}>
                    {isLogin ? 'New to Student Buddy?' : 'Already have an account?'}
                </Text>
                <Link href={isLogin ? '/register' : '/login'} style={styles.link}>
                    {isLogin ? 'Create an account' : 'Sign in'}
                </Link>


                <Text style={styles.label}>Username</Text>
                <TextInput
                    {...common}
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    maxLength={30}
                />


                {!isLogin && (
                    <>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            {...common}
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            maxLength={254}
                        />
                    </>
                )}

                <Text style={styles.label}>Password</Text>
                <TextInput
                    {...common}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    maxLength={128}
                />


                {!isLogin && (
                    <Text style={styles.secondary}>
                        Username: 3–30 letters, numbers, or _. Password: minimum 10 characters.
                    </Text>
                )}
                {error && <Text style={styles.error}>{error}</Text>}

                <Pressable style={styles.button} onPress={onSubmit} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : (
                        <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
                    )}
                </Pressable>
        </View>
    </Screen>
    );

}

const styles =  StyleSheet.create({
    container: { padding: 24, gap: 8 },
    title: { fontSize: 32, color: '#0F172A' },
    secondary: { fontSize: 14, color: '#475569' },
    link: { fontSize: 14, color: '#4F46E5'},
    label: { marginTop: 8, fontSize: 16, color: '#0F172A' },
    input: {
        borderWidth: 1,
        borderColor: '#64748B',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: 'rgba(255,255,255,0.8)'
    },
    error: { fontSize: 14, color: '#B91C1C' },
    button: {
        backgroundColor: '#4F46E5',
        borderRadius: 5, padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 24,
        minWidth: 160
    },
    buttonText: { color: '#FFFFFF', fontSize: 16 },
});