import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="home" options={{ title: "Study" }} />
            <Tabs.Screen name="history" options={{ title: "History" }} />
        </Tabs>
    );
}