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
import { router, useLocalSearchParams } from "expo-router";
import { ServiceTypeTreeDO } from "@/types";

export default observer(() => {
  const store = useLocalObservable(() => new ServiceCategoryCheckStore());
  const { selectedCategories } = useLocalSearchParams<{ selectedCategories: string }>();
  const [currentServiceType, setCurrentServiceType] = useState('LX001');
  const [selectedTree, setSelectedTree] = useState<ServiceTypeTreeDO[]>([]);

  useEffect(() => {
    // 如果有传入的选择数据，则使用传入的数据
    if (selectedCategories) {
      try {
        const parsedCategories = JSON.parse(selectedCategories);
        store.setSelectedCategories(parsedCategories);
      } catch (error) {
        console.error('Failed to parse selectedCategories:', error);
      }
    }
  }, [selectedCategories]);

  useEffect(() => {
    // 当切换服务类型或选中数据变化时，更新选中的树结构
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

  // 修改递归渲染品类树的函数
  const renderCategoryTree = (nodes: ServiceTypeTreeDO[]) => {
    return nodes.map((level1) => (
      <View key={level1.id} style={styles.categorySection}>
        {/* 一级节点作为标题 */}
        <Text style={styles.sectionTitle}>{level1.name}</Text>
        
        {/* 二三级节点的容器 */}
        {level1.children && level1.children.length > 0 && (
          <View style={styles.levelContainer}>
            {/* 左侧：二级节点列表 */}
            <View style={styles.level2Container}>
              {level1.children.map((level2) => (
                <TouchableOpacity 
                  key={level2.id}
                  style={styles.level2Item}
                >
                  <Text style={styles.level2Text}>{level2.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 右侧：三级节点列表 */}
            <View style={styles.level3Container}>
              {level1.children.map((level2) => 
                level2.children && level2.children.length > 0 ? (
                  <View key={level2.id} style={styles.level3Wrapper}>
                    <Text style={styles.level3Names}>
                      {level2.children.map(level3 => level3.name).join('、')}
                    </Text>
                  </View>
                ) : null
              )}
            </View>
          </View>
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
        <View style={styles.tabsContainer}>
          <View style={styles.tabsContent}>
            {store.serviceTypes.map((item, index) => renderServiceTypeTab(item, index))}
          </View>
        </View>
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
        onPress={() => router.push('/serviceCategorySelection')}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  tabItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
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
    marginTop: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 15,
    color: "#303133",
    fontWeight: "600",
    marginBottom: 12,
  },
  levelContainer: {
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EBEEF5',
  },
  level2Container: {
    flex: 2,
    borderRightWidth: 1,
    borderRightColor: '#EBEEF5',
    backgroundColor: '#EBF3FF',
  },
  level2Item: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEEF5',
  },
  level2Text: {
    fontSize: 14,
    color: '#303133',
    fontWeight: "500",
  },
  level3Container: {
    flex: 3,
    backgroundColor: '#FFFFFF',
  },
  level3Wrapper: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEEF5',
  },
  level3Names: {
    fontSize: 14,
    color: '#606266',
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
