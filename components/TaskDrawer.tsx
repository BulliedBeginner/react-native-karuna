import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { useTaskStore } from "@/store/useTaskStore";

const DrawerComponent = ({ isVisible, onClose, taskText, index }) => {
	console.log("taskText", taskText);
	console.log("index", index);
	
	const [text, setText] = useState(taskText);
	const { updateTask } = useTaskStore();

	const handleSave = () => {
		updateTask(index, text);
		onClose();
	};

	return (
		<Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
			<View style={styles.container}>
				<TextInput style={styles.input} value={text} onChangeText={setText} />
				<Button title="Save" onPress={handleSave} />
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modal: {
		justifyContent: "flex-end",
		margin: 0,
	},
	container: {
		backgroundColor: "white",
		padding: 20,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	input: {
		borderBottomWidth: 1,
		borderBottomColor: "#ccc",
		marginBottom: 20,
	},
});

export default DrawerComponent;
