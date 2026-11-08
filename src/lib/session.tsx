import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import * as SecureStore from 'expo-secure-store';
const KEY = 'accessToken'
import { setUnauthorizedHandler } from '@/lib/api';

type Session = {
    token: string | null | undefined;
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const SessionContext = createContext<Session>(null!);

export const useSession = ()=> useContext(SessionContext);

export function SessionProvider({ children }: PropsWithChildren){
    const [token, setToken] = useState<string | null>();

    useEffect(() =>{
        SecureStore.getItemAsync(KEY).then(setToken, () => setToken(null));
    }, []);

    useEffect(() => setUnauthorizedHandler(signOut));

    async function signIn(newToken: string){
        await SecureStore.setItemAsync(KEY, newToken);
        setToken(newToken);
    }

    async function signOut(){
        await SecureStore.deleteItemAsync(KEY);
        setToken(null);
    }

    return (
        <SessionContext.Provider value={{ token, signIn, signOut }}>
            {children}
        </SessionContext.Provider>
    )
}