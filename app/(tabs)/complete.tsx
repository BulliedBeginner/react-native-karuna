import { useState } from "react";
import { Text, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Button } from "react-native";
import TaskDrawer from "@/components/TaskDrawer";

import { Trash, Check } from "lucide-react-native";

import { useTaskStore } from "@/store/useTaskStore";
import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";

export default function CompleteTask() {
	const router = useRouter();
	const { taskItems, completeTask, showDeleteConfirmation } = useTaskStore();

	const [isDrawerVisible, setDrawerVisible] = useState(false);

	const handleOuterPress = () => {
		setDrawerVisible(true);
	};

	const logout = async () => {
		await auth.signOut();
		router.replace("/login");
	}

	return (
		<View className="flex-1 bg-gray-100">
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
				}}
				keyboardShouldPersistTaps="handled">
				<View className="pt-20 px-5">
				<View className="flex-row justify-between items-center">
						<Text className="text-2xl font-bold">Completed Task</Text>
						<View className="flex-col gap-2">
							<Text>{auth.currentUser?.email}</Text>
							<Button title="Logout" onPress={logout} />
						</View>
					</View>
					<View className="mt-8">
						{taskItems
							.filter(item => item.completed)
							.map((item, index) => {
								return (
									<View key={"complete" + index}>
										<TouchableWithoutFeedback onPress={handleOuterPress}>
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
											isVisible={isDrawerVisible}
											onClose={() => setDrawerVisible(false)}
											taskText={item.text}
											index={index}
										/>
									</View>
								);
							})}
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
