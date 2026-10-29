import type { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Screen({ children }: PropsWithChildren){
    return (
        <LinearGradient
            colors={['#FFFFFF', '#E0E7FF']}
            start={{ x:0.5, y: 0 }}
            end={{ x:0.5, y: 1 }}
            style={styles.fill}
        >
            <SafeAreaView style={styles.fill}>{children}</SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    fill: { flex: 1 },
})