import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useLocalStore } from "mobx-react";
import CustomCheckbox from "@/components/CustomCheckbox";
import ServiceCategoryStore from "./ServiceCategoryStore";
import CustomButton from "@/components/CustomButton";
import { router, useLocalSearchParams } from "expo-router";

const images = {
  waringIcon: require("@/assets/images/common/icon_wrang.png"),
};

export default observer(() => {
  const store = useLocalObservable(() => new ServiceCategoryStore());
  const { from } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* 黄色提示 */}
      <View style={styles.warningBox}>
        <Image source={images.waringIcon} style={styles.waring} />
        <Text style={styles.warningText}>
          平台将按照您选择的服务类型和品类为您派单
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {store.serviceTypes.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              store.currentTabName = item.serviceTypeName;
              store.currentTabIdx = index;
              console.log(store.currentTabName);
              // store.currentLevel1Category =
              //   store.getSelectedCategoriesForCurrentTab()[0];
              // store.currentLevel2Category =
              //   store.currentLevel1Category?.children[0];
            }}
            style={styles.tab}
          >
            <View style={styles.tabViewCloum}>
              <View style={styles.tabView}>
                <Text
                  style={
                    store.currentTabName === item.serviceTypeName
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  {item.serviceTypeName}
                </Text>

                {(() => {
                  const tab = item.serviceTypeName;
                  let selectedCount = 0;
                  // if (tab === "测量") {
                  //   selectedCount = store.CategoriesSelected1.length;
                  // } else if (tab === "安装") {
                  //   selectedCount = store.CategoriesSelected2.length;
                  // } else if (tab === "维修") {
                  //   selectedCount = store.CategoriesSelected3.length;
                  // }
                  selectedCount = store.selectedCategories[index].length;
                  console.log("Selected Count:", selectedCount); // 调试输出
                  return selectedCount > 0 ? (
                    <View style={styles.countView}>
                      <Text style={styles.counttv}>{selectedCount}</Text>
                    </View>
                  ) : null;
                })()}
              </View>
              {store.currentTabName === item.serviceTypeName && (
                <View style={styles.selTabBom}></View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Categories */}
      <View style={styles.categoryContainer}>
        {/* 左侧：一级目录 */}
        <ScrollView style={styles.leftPanel}>
          {store.categoryTree.map((level1) => (
            <TouchableOpacity
              key={level1.id}
              onPress={() => {
                // store.currentLevel1Category = level1;
                // store.currentLevel2Category = level1?.children[0];
              }}
            >
              <View key={level1.id} style={[styles.subcategory]}>
                <View style={styles.subcategorySecond}>
                  {/* 如果有选中项，显示选中数量 */}
                  {(() => {
                    const selectedCount = store.getLowestLevelSelectedCount(level1.id);
                    return selectedCount > 0 ? (<View style={styles.bluePoint} />) : null;
                  })()}
                </View>
                <View style={styles.subcategoryFirst}>
                  <Text
                    style={
                      // store.currentLevel1Category?.id === level1.id
                      //   ? styles.activeCategoryTextSel
                      //   : styles.activeCategoryText
                      {}
                    }
                  >
                    {level1.name}
                  </Text>
                  <CustomCheckbox
                    checked={level1.selected}
                    onChange={(checked) => {
                      // store.currentLevel1Category = level1;
                      // store.currentLevel2Category = level1?.children[0];
                      // store.setSelected(level1.id, checked);
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 中间：二级目录 */}
        <ScrollView style={styles.middlePanel}>
          {store.currentLevel1Category?.children?.map((subcategory) => (
            <TouchableOpacity
              key={subcategory.id}
              onPress={() => (store.currentLevel2Category = subcategory)}
            >
              <View
                key={subcategory.id}
                style={
                  store.currentLevel2Category?.id === subcategory.id
                    ? styles.subcategorySel2
                    : styles.subcategory2
                }
              >
                <View style={styles.subcategorySecond}>
                  {/* 如果有选中项，显示选中数量 */}
                  {(() => {
                    const selectedCount = store.getLowestLevelSelectedCount(
                      subcategory.id
                    );
                    return selectedCount > 0 ? (
                      <View style={styles.bluePoint} />
                    ) : null;
                  })()}
                </View>
                <View style={styles.subcategoryFirst}>
                  <Text
                    style={
                      store.currentLevel2Category?.id === subcategory.id
                        ? styles.activeCategoryTextSel
                        : styles.activeCategoryText
                    }
                  >
                    {subcategory.name}
                  </Text>
                  <CustomCheckbox
                    checked={subcategory.selected}
                    onChange={(checked) => {
                      store.currentLevel2Category = subcategory;
                      store.setSelected(subcategory.id, checked);
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 右侧：三级目录 */}
        <ScrollView style={styles.rightPanel}>
          {store.currentLevel2Category?.children?.map((subcategory) => (
            <View key={subcategory.id} style={styles.subcategory3}>
              <TouchableOpacity
                key={subcategory.id}
                onPress={() =>
                  store.setSelected(subcategory.id, !subcategory.selected)
                }
              >
                <Text
                  style={
                    subcategory.selected
                      ? styles.subcategory3SelTv
                      : styles.subcategory3Tv
                  }
                >
                  {subcategory.name}
                </Text>
              </TouchableOpacity>
              <CustomCheckbox
                checked={subcategory.selected}
                onChange={(checked) =>
                  store.setSelected(subcategory.id, checked)
                }
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Submit button */}
      <CustomButton
        // disabled={store.selectedLowestLevelCategories.length===0}
        style={styles.submitButton}
        onPress={() => {
          // 根据页面来源决定是否调用 setMasterServiceTypes 方法
          if (from === "settled") {
            // registrationStore.setField('serviceType',Object.values(store.combineCategories()).join(','))
            // {"1001": [37, 36, 35, 59, 8], "1002": [], "1003": []}
            // 将 store.combineCategories() 的所有值合并为一维数组
            const combinedCategories = Object.values(
              store.combineCategories()
            ).flat();
            console.log("====================================");
            console.log(
              "combineCategories",
              from === "settled",
              combinedCategories,
              store.combineCategories()
            );
            console.log("====================================");
            // 将合并后的数组转换为字符串并设置到 registrationStore
            registrationStore.setField(
              "serviceType",
              store.combineCategories()
            );
            registrationStore.setServiceTypeDisplay(
              store.combineCategoriesForDisplay().join(",")
            );
          } else {
            store.setMasterServiceTypes();
          }
          router.back();
        }}
      >
        <Text style={styles.submitText}>确认提交</Text>
      </CustomButton>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  waring: {
    height: 16,
    width: 16,
    marginRight: 8,
  },
  warningBox: {
    backgroundColor: "rgba(255, 163, 0, 0.1)",
    padding: 8,
    marginLeft: 16,
    marginRight: 16,
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 4,
    flexDirection: "row",
  },
  tabView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  tabViewCloum: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBlockColor: "rgba(238, 241, 247,0.5)",
    borderBottomWidth: 1,
  },
  selTabBom: {
    position: "absolute",
    bottom: 0,
    height: 4,
    width: "50%", // 根据需要调整宽度
    backgroundColor: "#2A6AE9", // 蓝色下划线
    borderRadius: 4,
  },
  countView: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 50,
    backgroundColor: "#2a6ae9",
    marginLeft: 8,
  },
  counttv: {
    fontSize: 10,
    color: "#ffffff",
    lineHeight: 12,
    alignContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
  },

  warningText: { color: "#FFA300", fontSize: 12 },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 44,
    alignItems: "center",
    alignContent: "center",
  },
  tab: { flex: 1 },
  tabText: { color: "black" },
  activeTabText: { color: "#2A6AE9", fontWeight: "bold" },
  categoryContainer: {
    flexDirection: "row",
    flex: 1,
  },
  leftPanel: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  middlePanel: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  rightPanel: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  category: { padding: 10, marginVertical: 5 },
  activeCategory: { backgroundColor: "#2A6AE9", color: "#2A6AE9" },
  activeCategoryText: { color: "#303133", fontSize: 14, width: "85%" },
  activeCategoryTextSel: { color: "#2A6AE9", fontSize: 14, width: "85%" },
  subcategory: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "center",
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 7,
    paddingTop: 7,
  },
  subcategory2: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignContent: "center",
    paddingLeft: 8,
    paddingBottom: 7,
    paddingTop: 7,
  },
  subcategorySel2: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    justifyContent: "space-between",
    alignContent: "center",
    paddingLeft: 8,
    paddingBottom: 7,
    paddingTop: 7,
  },
  subcategory3: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "center",
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 7,
    paddingTop: 7,
  },

  subcategory3Tv: { fontSize: 14, color: "#303133" },
  subcategory3SelTv: { fontSize: 14, color: "#2A6AE9" },
  submitButton: {
    backgroundColor: "#2A6AE9",
    alignItems: "center",
    margin: 16,
  },
  submitText: { color: "white" },
  subcategoryFirst: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    paddingRight: 8,
  },
  subcategorySecond: {
    width: 6,
    marginRight: 4,
  },
  bluePoint: {
    width: 6,
    height: 6,
    backgroundColor: "#2A6AE9",

    borderRadius: 100,
  },
});
