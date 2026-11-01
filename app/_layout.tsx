import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "./global.css";

export default function RootLayout() {
    return (
        <>
            <StatusBar hidden />

            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                <Stack.Screen
                    name="meals/[id]"
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="ingredients/[ingredient]"
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="categories/[category]"
                    options={{ headerShown: false }}
                />
            </Stack>
        </>
    );
}
