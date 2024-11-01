import { router } from 'expo-router';
import { Image, StyleSheet, Platform, Button, TouchableOpacity } from 'react-native';
import { Text, View  } from 'react-native';
export default function HomeScreen() {
  return (
    <View>
      <Text>Hello world</Text>
      <TouchableOpacity onPress={() => router.push('/(tabs)/serviceCategorySelection')}>
        Go to Remote
      </TouchableOpacity>
    </View>
  );
}

