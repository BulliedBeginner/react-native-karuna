import { Tabs } from "expo-router";
import React from "react";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

import { Home, Check } from "lucide-react-native"

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerShown: false,
			}}>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => <Home color={color} />,
				}}
			/>
			<Tabs.Screen
				name="complete"
				options={{
					title: "Complete",
					tabBarIcon: ({ color, focused }) => <Check color={color} />,
				}}
			/>
		</Tabs>
	);
}
