import "../global.css";

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useRouter, useFocusEffect } from "expo-router";

import { useColorScheme } from "@/hooks/useColorScheme";
import { auth } from "@/firebaseConfig";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const router = useRouter();
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	useFocusEffect(() => {
		// Redirect to login page if not authenticated
		if (!auth.currentUser) {
			router.push("/login");
			return;
		} else {
			router.replace("/(tabs)");
		}
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="+not-found" />
			</Stack>
		</ThemeProvider>
	);
}
