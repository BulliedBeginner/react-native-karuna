import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useRouter, Link } from "expo-router";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		setLoading(true);
		try {
			await createUserWithEmailAndPassword(auth, email, password);
			router.replace("/(tabs)");
		} catch (error) {
			Alert.alert("Login Error", error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
			<Text style={{ fontSize: 24, marginBottom: 16 }}>Register Account</Text>
			<TextInput
				style={{ height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 12, paddingHorizontal: 8 }}
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				autoCapitalize="none"
			/>
			<TextInput
				style={{ height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 12, paddingHorizontal: 8 }}
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>
			<Button title={loading ? "Loading..." : "Sign Up"} onPress={handleLogin} disabled={loading} />
			<Link href="/login" style={{ marginTop: 16 }}>
				<Text style={{ color: "blue" }}>Login</Text>
			</Link>
		</View>
	);
}
