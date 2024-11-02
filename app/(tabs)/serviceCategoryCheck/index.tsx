import React, { useEffect, useState } from "react";
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
import { ServiceTypeTreeDO } from "@/types";

export default observer(() => {
  const store = useLocalObservable(() => new ServiceCategoryCheckStore());
  const [currentServiceType, setCurrentServiceType] = useState('LX001');
  const [selectedTree, setSelectedTree] = useState<ServiceTypeTreeDO[]>([]);

  useEffect(() => {
    // 当切换服务类型时，更新选中的树结构
    const selectedNodes = store.selectedCategories[currentServiceType] || [];
    const tree = store.getSelectedCategoriesTree(store.categoryTree, selectedNodes);
    setSelectedTree(tree);
  }, [currentServiceType, store.selectedCategories]);

  // 渲染服务类型Tab
  const renderServiceTypeTab = (
    item: { serviceTypeName: string; serviceTypeCode: string; count: number },
    index: number
  ) => {
    const selectedCount = store.getSelectedCount(item.serviceTypeCode);
    const isActive = currentServiceType === item.serviceTypeCode;
    
    return (
      <TouchableOpacity 
        key={index}
        style={[styles.tabItem, isActive && styles.activeTabItem]}
        onPress={() => setCurrentServiceType(item.serviceTypeCode)}
      >
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
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

  // 递归渲染品类树
  const renderCategoryTree = (nodes: ServiceTypeTreeDO[]) => {
    return nodes.map((node) => (
      <View key={node.id} style={styles.categorySection}>
        <Text style={styles.sectionTitle}>{node.name}</Text>
        {node.children && node.children.length > 0 ? (
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>
              {node.children.map(child => 
                child.children && child.children.length > 0 
                  ? child.children.map(subChild => subChild.name).join('、')
                  : child.name
              ).join('、')}
            </Text>
          </View>
        ) : null}
        {node.children?.map(child => 
          child.children && child.children.length > 0 ? (
            <View key={child.id} style={[styles.categorySection, styles.childSection]}>
              <Text style={styles.sectionSubtitle}>{child.name}</Text>
              <View style={styles.categoryItem}>
                <Text style={styles.categoryName}>
                  {child.children.map(subChild => subChild.name).join('、')}
                </Text>
              </View>
            </View>
          ) : null
        )}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {/* 顶部提示 */}
      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          平台将按照您选择的服务类型和品类为您派单
        </Text>
      </View>

      {/* 服务类型Tabs */}
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
        {renderCategoryTree(selectedTree)}
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
    maxHeight: 36,
  },
  tabsContent: {
    paddingHorizontal: 12,
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 16,
  },
  activeTabItem: {
    backgroundColor: '#F5F7FA',
    borderRadius: 4,
  },
  tabText: {
    fontSize: 13,
    color: "#303133",
  },
  activeTabText: {
    color: "#2A6AE9",
    fontWeight: "500",
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
  childSection: {
    marginLeft: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#303133",
    fontWeight: "500",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#606266",
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
