import React from "react";
import { View, Text } from "react-native";

const Task = (props : { text: string }) => {
	return (
		<View className="p-4 rounded-lg flex-row items-center justify-between mb-5 bg-white">
			<View className="flex-row items-center flex-wrap">
				<View className="bg-[#55BCF6] w-6 h-6 opacity-40 rounded-sm mr-4"></View>
				<Text className="max-w-[80%]">{props.text}</Text>
			</View>
			<View className="w-3 h-3 border-[#55BCF6] border-2 rounded-md"></View>
		</View>
	);
};

export default Task;