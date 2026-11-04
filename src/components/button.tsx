import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type Props = { title: string; onPress: () => void; disabled?: boolean; loading?: boolean };

export function Button({ title, onPress, disabled, loading }: Props){
    const off = disabled || loading;
    return (
        <Pressable style={[styles.button, off && styles.off]} onPress={onPress}>
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.text}>{title}</Text>}
        </Pressable>
    )
}

const styles = StyleSheet.create({
   button: { backgroundColor: '#4F46E5', borderRadius: 5, padding: 10, alignSelf: 'flex-start' },
   off: { opacity: 0.5 },
   text: { color: '#FFFFFF', fontSize: 16 },
});