import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, firestore } from "@/firebaseConfig";
import type { Task } from "@/types";

type TaskStore = {
	task: Task | null;
	taskItems: Task[];
	setTask: (task: Task | null) => void;
	handleAddTask: () => void;
	updateTask: (index: number, newText: string) => void;
	completeTask: (index: number) => void;
	deleteTask: (index: number) => void;
	showDeleteConfirmation: (taskIndex: number) => void;
	loadTasks: () => void;
};

const saveTasksToStorage = async (tasks: Task[]) => {
	try {
		await AsyncStorage.setItem("TASKS_STORAGE_KEY", JSON.stringify(tasks));
	} catch (error) {
		console.error("Failed to save tasks to storage:", error);
	}
};

export const useTaskStoreFirebase = create<TaskStore>(set => ({
	task: null,
	taskItems: [],
	setTask: task => set({ task }),
	handleAddTask: () => {
		set(({ task, taskItems }) => {
			const newTaskItems = [...taskItems, { ...task, completed: false }];
			saveTasksToStorage(newTaskItems);
			return { taskItems: newTaskItems, task: null };
		});
	},
	updateTask: (index, newText) => {
		set(({ taskItems }) => {
			const itemsCopy = [...taskItems];
			itemsCopy[index].text = newText;
			saveTasksToStorage(itemsCopy);
			return { taskItems: itemsCopy };
		});
	},
	completeTask: index => {
		set(({ taskItems }) => {
			const itemsCopy = [...taskItems];
			itemsCopy[index].completed = !itemsCopy[index].completed;
			saveTasksToStorage(itemsCopy);
			return { taskItems: itemsCopy };
		});
	},
	deleteTask: index => {
		set(({ taskItems }) => {
			const newTaskItems = taskItems.filter((_, i) => i !== index);
			saveTasksToStorage(newTaskItems);
			return { taskItems: newTaskItems };
		});
	},
	showDeleteConfirmation: taskIndex => {
		Alert.alert(
			"Delete Task",
			"Are you sure you want to delete this task?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					onPress: () => {
						set(({ taskItems }) => {
							const newTaskItems = taskItems.filter((_, i) => i !== taskIndex);
							saveTasksToStorage(newTaskItems);
							return { taskItems: newTaskItems };
						});
					},
					style: "destructive",
				},
			],
			{ cancelable: true },
		);
	},
	loadTasks: async () => {
		const user = auth.currentUser;
		if (!user) {
			return;
		}

		try {
			const q = query(collection(firestore, "todos"), where("user_id", "==", user.uid));
			console.log(q);
			const querySnapshot = await getDocs(q);
			const tasks: Task[] = [];
			querySnapshot.forEach(doc => {
				tasks.push(doc.data() as Task);
			});
			set({ taskItems: tasks });
			saveTasksToStorage(tasks);
		} catch (error) {
			console.error("Failed to load tasks from Firestore:", error);
		}
	},
}));

// Call loadTasks when the app starts
useTaskStoreFirebase.getState().loadTasks();
