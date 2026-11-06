import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import type { TabTriggerSlotProps } from "expo-router/ui";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeIcon, HistoryIcon, StudyIcon } from "@/components/tab-icons";

export default function TabsLayout(){
    const { bottom } = useSafeAreaInsets();

    return (
        <Tabs>
            <View style={styles.slot}>
                <TabSlot/>
            </View>
            <TabList asChild>
                <View style={StyleSheet.flatten([styles.bar, { bottom: bottom + 12 }])}>
                    <TabTrigger name="home" href="/home" asChild>
                        <TabButton Icon={HomeIcon} label="Home"/>
                    </TabTrigger>
                    <TabTrigger name="study" href="/study" asChild>
                        <TabButton Icon={StudyIcon} label="Study"/>
                    </TabTrigger>
                    <TabTrigger name="history" href="/history" asChild>
                        <TabButton Icon={HistoryIcon} label="History"/>
                    </TabTrigger>
                </View>
            </TabList>
        </Tabs>
    )
}

function TabButton({
    Icon,
    label,
    isFocused,
    ref,
    style,
    ...props
}: TabTriggerSlotProps & {Icon: typeof HomeIcon; label: string;}){
    const color = isFocused ? "#4F46E5" : "#64748B";
    return (
        <Pressable
            ref={ref}
            {...props}
            style={StyleSheet.flatten([style, styles.item])}
        >
            <Icon color={color} />
            <Text style={[styles.label, { color }]}>{label}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    slot: { flex: 1 },
    bar: {
        position: "absolute",
        alignSelf: "center",
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,0.7)",
        borderRadius: 16,
        borderTopWidth: 1,
        borderTopColor: "rgba(15,23,42,0.08)",
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    item: {
        flexDirection: "column",
        minWidth: 64,
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        gap: 4
    },
    label: { fontSize: 12, fontWeight: "500" },
});