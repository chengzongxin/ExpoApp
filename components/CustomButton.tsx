import React from 'react';
import { TouchableOpacity, Text, GestureResponderEvent, ViewStyle, StyleSheet } from 'react-native';

interface CustomButtonProps {
  title?: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: ViewStyle;
  children: React.ReactNode; // 用于接收子元素，比如 buttonText
}

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, disabled = false, style, children }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        style,
        disabled && styles.disabledButton, // 根据 disabled 属性应用样式
      ]}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A6AE9', // 默认背景色
  } as ViewStyle, // 确保类型是 ViewStyle
  disabledButton: {
    opacity: 0.6, // 不可点击时的透明度
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default CustomButton;
