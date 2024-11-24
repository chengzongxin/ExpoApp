import 'react-native-get-random-values';
import { View, Text, Button, ScrollView } from "react-native";
import { PersonSchema, DogSchema, Person as PersonType, Dog as DogType } from "../../../storage/schemas";
import { getDB } from "../../../storage/db";
import { useEffect, useState } from "react";
import { Realm } from "@realm/react";

// 1. 定义 Person 类
class Person extends Realm.Object<PersonType> {
  _id!: string;
  name!: string;
  age!: number;
  address!: string;
  dogs!: Realm.List<string>;
  createTime!: Date;
  updateTime!: Date;

  static schema = PersonSchema;
}

// 2. 定义 Dog 类
class Dog extends Realm.Object<DogType> {
  _id!: string;
  name!: string;
  breed!: string;
  age!: number;
  ownerId!: string;
  createTime!: Date;
  updateTime!: Date;

  static schema = DogSchema;
}

// 4. 创建数据展示组件
function DataList() {
  const [persons, setPersons] = useState<Array<PersonType>>([]);
  const [dogs, setDogs] = useState<Array<DogType>>([]);
  const [loading, setLoading] = useState(true);

  // 加载数据
  const loadData = async () => {
    try {
      const realm = await getDB();
      const personsData = realm.objects<PersonType>('Person');
      const dogsData = realm.objects<DogType>('Dog');
      
      setPersons(Array.from(personsData));
      setDogs(Array.from(dogsData));
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 添加示例数据
  const addExampleData = async () => {
    try {
      const realm = await getDB();
      realm.write(() => {
        // 创建一个人
        const person = realm.create<PersonType>('Person', {
          _id: new Realm.BSON.ObjectId().toString(),
          name: '张三',
          age: 30,
          address: '北京市朝阳区',
          dogs: [] as string[],
          createTime: new Date(),
          updateTime: new Date()
        });

        // 创建一条狗并关联到这个人
        const dog = realm.create<DogType>('Dog', {
          _id: new Realm.BSON.ObjectId().toString(),
          name: '旺财',
          breed: '金毛',
          age: 3,
          ownerId: person._id,
          createTime: new Date(),
          updateTime: new Date()
        });

        // 更新人的 dogs 数组
        const personObj = realm.objectForPrimaryKey<PersonType>('Person', person._id);
        if (personObj) {
          realm.create('Person', 
            { ...personObj, dogs: [dog._id] },
            Realm.UpdateMode.Modified
          );
        }
      });

      // 重新加载数据
      await loadData();
    } catch (error) {
      console.error('添加数据失败:', error);
    }
  };

  // 初始加载数据
  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Text>加载中...</Text>;
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      <Button title="添加示例数据" onPress={addExampleData} />
      
      <Text style={{ fontSize: 20, marginTop: 20 }}>人员列表：</Text>
      {persons.map(person => (
        <View key={person._id} style={{ marginVertical: 10 }}>
          <Text>姓名: {person.name}</Text>
          <Text>年龄: {person.age}</Text>
          <Text>地址: {person.address}</Text>
          <Text>狗狗数量: {person.dogs?.length || 0}</Text>
        </View>
      ))}

      <Text style={{ fontSize: 20, marginTop: 20 }}>狗狗列表：</Text>
      {dogs.map(dog => (
        <View key={dog._id} style={{ marginVertical: 10 }}>
          <Text>名字: {dog.name}</Text>
          <Text>品种: {dog.breed}</Text>
          <Text>年龄: {dog.age}</Text>
          <Text>主人ID: {dog.ownerId}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

// 5. 主组件
export default function Db() {
  return <DataList />;
}