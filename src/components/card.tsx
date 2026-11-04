import { StyleSheet, View, type ViewProps } from 'react-native';

export function Card({ style, ...props}: ViewProps){
    return <View style={[styles.card, style]} {...props} />;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255,255,255,0.88)',
        borderWidth: 1,
        borderRadius: 24,
        borderColor: 'rgba(255,255,255,0.8)',
        padding: 16,
        gap: 12,
        boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
    },
});