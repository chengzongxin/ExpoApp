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
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="serviceCategorySelection/index" 
        options={{ 
          headerShown: true,
          title: "服务类目选择",
          headerTitleAlign: 'center',
          headerTitleStyle: { 
            fontSize: 16,
            color: '#303133',
          },
        }} 
      />
      <Stack.Screen 
        name="serviceCategoryCheck/index" 
        options={{ 
          headerShown: true,
          title: "已选服务类目",
          headerTitleAlign: 'center',
          headerTitleStyle: { 
            fontSize: 16,
            color: '#303133',
          },
        }} 
      />
    </Stack>
  );
}
