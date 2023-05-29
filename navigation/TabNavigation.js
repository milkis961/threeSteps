import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import StepCount from "../components/StepCount";
import GameScreen from "../screens/GameScreen";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Step Count") {
            iconName = focused ? "human-handsdown" : "human-handsup";
          } else if (route.name === "Match Three") {
            iconName = focused ? "gamepad-square" : "gamepad-square-outline";
          }
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Step Count" component={StepCount} />
      <Tab.Screen name="Match Three" component={GameScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigation;
