import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';

const images = {
    checkboxTrue: require("@/assets/images/common/checkbox_true.png"),
    checkboxFalse: require("@/assets/images/common/checkbox_false.png"),
};

// 自定义 Checkbox 组件
const CustomCheckbox = ({  checked = false, onChange }: {   checked?: boolean; onChange: (checked: boolean) => void; }) => {
  const handlePress = () => {
    // 切换 checked 状态
    onChange(!checked);
  };

  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={handlePress}>
      <Image
        source={checked ? images.checkboxTrue : images.checkboxFalse}
        style={styles.checkboxImage}
      />
 
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical:13,
    paddingHorizontal:4
  },
  checkboxImage: {
    width: 14,
    height: 14,
   
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});

export default CustomCheckbox;
