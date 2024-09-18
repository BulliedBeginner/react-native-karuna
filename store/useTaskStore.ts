import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, firestore } from "@/firebaseConfig"; // Ensure firestore is initialized in firebaseConfig
import type { Task } from "@/types";
import uuid from 'react-native-uuid'; // Import react-native-uuid

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

const saveTasksToStorage = async (newTasks: Task[]) => {
	try {
		const existingTasksJson = await AsyncStorage.getItem("TASKS_STORAGE_KEY");
		const existingTasks: Task[] = existingTasksJson ? JSON.parse(existingTasksJson) : [];

		// Merge new tasks with existing tasks, avoiding duplicates
		const combinedTasks = [...existingTasks, ...newTasks.filter(newTask => !existingTasks.some(existingTask => existingTask.id === newTask.id))];

		await AsyncStorage.setItem("TASKS_STORAGE_KEY", JSON.stringify(combinedTasks));
	} catch (error) {
		console.error("Failed to save tasks to storage:", error);
	}
};

export const useTaskStore = create<TaskStore>(set => ({
	task: null,
	taskItems: [],
	setTask: task => set({ task }),
	handleAddTask: () => {
		const user = auth.currentUser;
		if (!user) {
			console.error("No user is logged in");
			return;
		}

		set(({ task, taskItems }) => {
			const newTaskItems = [...taskItems, { ...task, id: uuid.v4(), completed: false, user_id: user.uid, text: task?.text || "" }];
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

		// load task from local storage based on user id
		const tasks = await AsyncStorage.getItem("TASKS_STORAGE_KEY");
		// filter tasks based on user id
		console.log("tasks", tasks);
		const userTasks = tasks ? JSON.parse(tasks).filter((task: Task) => task.user_id === user.uid) : [];
		set({ taskItems: userTasks });
	},
}));

// Call loadTasks when the app starts
useTaskStore.getState().loadTasks();
