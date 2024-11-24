import { View, Text } from "react-native";
import { createRealmContext, Realm } from "@realm/react";

// 1. 定义一个简单的 Task 模型
class Task extends Realm.Object {
  _id!: number;
  name!: string;
  createdAt!: Date;

  static schema = {
    name: 'Task',
    primaryKey: '_id',
    properties: {
      _id: 'int',
      name: 'string',
      createdAt: 'date'
    },
  };
}

// 2. 创建 Realm 上下文
const { RealmProvider, useRealm, useQuery } = createRealmContext({
  schema: [Task]
});

// 3. 创建一个简单的展示组件
function TaskList() {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20 }}>任务列表</Text>
    </View>
  );
}

// 4. 主组件
export default function Db() {
  return (
    <RealmProvider>
      <TaskList />
    </RealmProvider>
  );
}