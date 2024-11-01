import React from 'react';
import { View, Button, Text } from 'react-native';

const RemoteControl = () => {
  const sendCommand = async (command: string) => {
    try {
      const response = await fetch(`http://192.168.1.183:8080/command?key=${command}`);
      if (response.ok) {
        console.log(`${command} sent successfully!`);
      } else {
        console.log('Failed to send command.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View>
      <Text>TV Remote Control</Text>
      <Button title="Power" onPress={() => sendCommand('power')} />
      <Button title="Volume Up" onPress={() => sendCommand('volume_up')} />
      <Button title="Volume Down" onPress={() => sendCommand('volume_down')} />
      <Button title="Channel Up" onPress={() => sendCommand('channel_up')} />
      <Button title="Channel Down" onPress={() => sendCommand('channel_down')} />
    </View>
  );
};

export default RemoteControl;
