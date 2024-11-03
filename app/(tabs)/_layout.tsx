import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2A6AE9',
        tabBarInactiveTintColor: '#909399',
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "首页",
          headerTitle: "首页",
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 16,
            color: '#303133',
          },
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="mine/index"
        options={{
          title: "我的",
          headerTitle: "我的",
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 16,
            color: '#303133',
          },
          tabBarIcon: ({ focused, color }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
} 