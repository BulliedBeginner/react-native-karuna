import { useState } from "react";
import {
	KeyboardAvoidingView,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	ScrollView,
	Platform,
	Button,
} from "react-native";
import TaskDrawer from "@/components/TaskDrawer";

import { Trash, Check } from "lucide-react-native";

import { useTaskStore } from "@/store/useTaskStore";
import { useTaskStoreFirebase } from "@/store/useTaskStoreFirestore";
import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";

export default function App() {
	const router = useRouter();
	const { task, taskItems, setTask, handleAddTask, completeTask, showDeleteConfirmation } = useTaskStore();

	const [visibleModals, setVisibleModals] = useState(Array(taskItems.length).fill(false));

	console.log(taskItems);
	console.log(auth.currentUser);

	const handleOuterPress = (index: number) => {
		const newVisibleModals = [...visibleModals];
		newVisibleModals[index] = !newVisibleModals[index];
		setVisibleModals(newVisibleModals);
	};

	const closeModal = (index: number) => {
		console.log(`Closing modal for item ${index}`);
		const newVisibleModals = [...visibleModals];
		newVisibleModals[index] = false;
		setVisibleModals(newVisibleModals);
	};

	const logout = async () => {
		await auth.signOut();
		router.replace("/login");
	};

	return (
		<View className="flex-1 bg-gray-100">
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
				}}
				keyboardShouldPersistTaps="handled">
				<View className="pt-20 px-5">
					<View className="flex-row justify-between items-center">
						<Text className="text-2xl font-bold">Tasks</Text>
						<View className="flex-col gap-2">
							<Text>{auth.currentUser?.email}</Text>
							<Button title="Logout" onPress={logout} />
						</View>
					</View>
					<View className="mt-8">
						{taskItems.map((item, index) => {
							return (
								<View key={"all" + index}>
									<TouchableWithoutFeedback onPress={() => handleOuterPress(index)}>
										<View
											className={
												"p-4 rounded-lg flex-row items-center justify-between mb-5 bg-white" +
												(item.completed ? " opacity-80" : "")
											}>
											<View className="flex-row items-center flex-wrap">
												<TouchableWithoutFeedback onPress={() => completeTask(index)}>
													<View className="border-2 border-[#55BCF6] w-6 h-6 opacity-40 rounded-sm mr-4 relative">
														{item.completed && <Check color="#55BCF6" size={24} className="absolute" />}
													</View>
												</TouchableWithoutFeedback>
												<Text className="max-w-[80%]">{item.text}</Text>
											</View>
											<TouchableOpacity onPress={() => showDeleteConfirmation(index)}>
												<Trash color="#f00" size={24} />
											</TouchableOpacity>
										</View>
									</TouchableWithoutFeedback>
									<TaskDrawer
										isVisible={visibleModals[index]}
										onClose={() => closeModal(index)}
										taskText={item.text}
										index={index}
									/>
								</View>
							);
						})}
					</View>
				</View>
			</ScrollView>

			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="absolute bottom-16 w-full flex-row justify-around items-center">
				<TextInput
					className="p-4 px-6 bg-white rounded-full border-gray-400 border w-[250px]"
					placeholder={"Write a task"}
					value={task?.text}
					onChangeText={text =>
						setTask({
							text,
							completed: false,
						})
					}
				/>
				<TouchableOpacity onPress={() => handleAddTask()}>
					<View className="w-14 h-14 rounded-full bg-white justify-center items-center border-gray-400 border">
						<Text>+</Text>
					</View>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</View>
	);
}
