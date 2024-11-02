import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { observer, useLocalObservable } from "mobx-react-lite";
import ServiceCategoryCheckStore from "./serviceCategoryCheckStore";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

export default observer(() => {
  const store = useLocalObservable(() => new ServiceCategoryCheckStore());

  // 渲染服务类型Tab
  const renderServiceTypeTab = (
    item: { serviceTypeName: string; serviceTypeCode: string; count: number },
    index: number
  ) => {
    const selectedCount = store.getSelectedCount(item.serviceTypeCode);
    
    return (
      <TouchableOpacity 
        key={index}
        style={styles.tabItem}
      >
        <Text style={styles.tabText}>
          {item.serviceTypeName}
        </Text>
        {selectedCount > 0 && (
          <View style={styles.selectedCountBadge}>
            <Text style={styles.selectedCountText}>{selectedCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 顶部提示 */}
      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          平台将按照您选择的服务类型和品类为您派单
        </Text>
      </View>

      {/* 服务类型Tabs - 减小高度并使用更紧凑的布局 */}
      <View style={styles.tabsWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {store.serviceTypes.map((item, index) => renderServiceTypeTab(item, index))}
        </ScrollView>
      </View>

      {/* 品类列表 */}
      <ScrollView 
        style={styles.categoryList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>窗帘</Text>
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>直轨(单层)、直轨(双层)、罗马杆(单层)</Text>
          </View>
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>遮阳帘</Text>
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>直轨(单层)、直轨(双层)、罗马杆(单层)</Text>
          </View>
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>地毯</Text>
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>电动窗帘、遮阳帘</Text>
          </View>
        </View>
      </ScrollView>

      {/* 底部按钮 */}
      <CustomButton
        style={styles.submitButton}
        onPress={() => router.push('/(tabs)/serviceCategorySelection')}
      >
        <Text style={styles.submitText}>修改服务</Text>
      </CustomButton>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  warningBox: {
    backgroundColor: "rgba(255, 163, 0, 0.1)",
    padding: 8,
    margin: 12,
    borderRadius: 4,
  },
  warningText: {
    color: "#FFA300",
    fontSize: 12,
  },
  tabsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F7",
  },
  tabsContainer: {
    maxHeight: 36, // 减小Tab的高度
  },
  tabsContent: {
    paddingHorizontal: 12,
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8, // 减小内边距
    paddingHorizontal: 12,
    marginRight: 16,
  },
  tabText: {
    fontSize: 13,
    color: "#303133",
  },
  selectedCountBadge: {
    backgroundColor: "#2A6AE9",
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    paddingHorizontal: 4,
  },
  selectedCountText: {
    color: "white",
    fontSize: 10,
    lineHeight: 14,
  },
  categoryList: {
    flex: 1,
    paddingHorizontal: 12,
  },
  categorySection: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#303133",
    fontWeight: "500",
    marginBottom: 8,
  },
  categoryItem: {
    backgroundColor: "#F5F7FA",
    padding: 12,
    borderRadius: 4,
  },
  categoryName: {
    fontSize: 14,
    color: "#606266",
    lineHeight: 20,
  },
  submitButton: {
    margin: 12,
  },
  submitText: {
    color: "white",
    fontSize: 16,
  },
});
