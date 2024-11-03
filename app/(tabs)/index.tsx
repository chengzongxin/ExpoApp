import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      {/* 功能入口区域 */}
      <View style={styles.menuContainer}>
        {/* 品类选择入口 */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/serviceCategorySelection')}
        >
          <Ionicons name="list" size={24} color="#2A6AE9" />
          <Text style={styles.menuText}>品类选择</Text>
        </TouchableOpacity>

        {/* 已选品类入口 */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/serviceCategoryCheck')}
        >
          <Ionicons name="checkmark-circle" size={24} color="#2A6AE9" />
          <Text style={styles.menuText}>已选品类</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  menuItem: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  menuText: {
    marginTop: 8,
    fontSize: 14,
    color: '#303133',
  },
});

