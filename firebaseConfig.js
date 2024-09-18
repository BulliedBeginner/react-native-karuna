import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
	apiKey: "AIzaSyDDr3gWtAvXmbjyW5AE1aW_ybTqYviJFus",
	authDomain: "react-native-test-d10a7.firebaseapp.com",
	databaseURL: "https://react-native-test-d10a7-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "react-native-test-d10a7",
	storageBucket: "react-native-test-d10a7.appspot.com",
	messagingSenderId: "590716379489",
	appId: "1:590716379489:web:1662cb24c063d26da6a520"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage)
});

export { auth, firestore };