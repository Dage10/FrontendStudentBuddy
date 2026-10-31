import { useEffect } from 'react';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { SessionProvider, useSession } from '@/lib/session';

SplashScreen.preventAutoHideAsync();

function RootNavigator(){
    const { token } = useSession();
    const isLoading = token === undefined;

    useEffect(() => {
        if(!isLoading){
            SplashScreen.hideAsync();
        }
    },[isLoading]);

    if (isLoading){
        return null;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!!token} redirectTo='/'>
                <Stack.Screen name="(tabs)" options={{headerShown: false}} />
            </Stack.Protected>
            <Stack.Protected guard={!token} redirectTo='/home'>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)/login" />
                <Stack.Screen name="(auth)/register" />
            </Stack.Protected>
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <SessionProvider>
            <RootNavigator/>
        </SessionProvider>
    )
}
