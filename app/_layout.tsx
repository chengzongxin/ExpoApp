import { Stack } from "expo-router";
import { useEffect } from "react";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// 防止启动屏幕自动隐藏
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    // 可以在这里加载自定义字体
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="serviceCategorySelection" 
        options={{ 
          headerShown: true,
          title: "品类选择",
          headerTitleStyle: { fontSize: 16 }
        }} 
      />
      <Stack.Screen 
        name="serviceCategoryCheck" 
        options={{ 
          headerShown: true,
          title: "已选品类",
          headerTitleStyle: { fontSize: 16 }
        }} 
      />
    </Stack>
  );
}
