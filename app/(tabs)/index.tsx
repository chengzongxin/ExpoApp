import { router } from 'expo-router';
import { Image, StyleSheet, Platform, Button, TouchableOpacity } from 'react-native';
import { Text, View  } from 'react-native';
export default function HomeScreen() {
  return (
    <View>
      <Text>Hello world</Text>
      <TouchableOpacity onPress={() => router.push('/(tabs)/serviceCategorySelection')}>
        <Text style={{color:'red', fontSize:20}}>Go to Service Category Selection</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(tabs)/serviceCategoryCheck')}>
        <Text style={{color:'red', fontSize:20}}>Go to Service Category Check</Text>
      </TouchableOpacity>
    </View>
  );
}

