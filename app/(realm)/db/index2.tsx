import 'react-native-get-random-values';
import { View, Text, Button, ScrollView } from "react-native";
import { PersonSchema, CarSchema, Person as PersonType, Car as CarType } from "../../../storage/schemas";
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

// 2. 定义 Car 类
class Car extends Realm.Object<CarType> {
  _id!: string;
  name!: string;
  brand!: string;
  price!: number;
  static schema = CarSchema;
}

// 4. 创建数据展示组件
function DataList() {

  // 加载数据
  const loadData = async () => {
   
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
          updateTime: new Date(),
          cars: [
            {
              _id: new Realm.BSON.ObjectId().toString(),
              name: '宝马',
              brand: '宝马',
              price: 300000
            },
            {
              _id: new Realm.BSON.ObjectId().toString(),
              name: '奔驰',
              brand: '奔驰',
              price: 400000
            },
            {
              _id: new Realm.BSON.ObjectId().toString(),
              name: '奥迪',
              brand: '奥迪',
              price: 500000
            }
          ]
        });
      });

      // 重新加载数据
      await loadData();
    } catch (error) {
      console.error('添加数据失败:', error);
    }
  };

  // 修改车
  const updateCar = async () => {
    try {
      const realm = await getDB();
      realm.write(() => {
        // const car = realm.objects("Car")<CarType>('Car', '674886e9a2711f8d6ccea284');
        const car = realm.objects<CarType>("Car").filtered("_id = $0", "674886e9a2711f8d6ccea284")[0];
        if (car) {
          car.name = '宝马123123';
          car.brand = '宝马123123';
          car.price = 123123;
        }
      })
    } catch (error) {
      console.error('修改车失败:', error);
    }
  }

  // 修改车2
  const updateCar2 = async () => {
    try {
      const realm = await getDB();
      realm.write(() => {
        const person = realm.objectForPrimaryKey<PersonType>('Person', '674886e9a2711f8d6ccea285');
        if (person) {
          person.cars[0].name = '宝马456';
          person.cars[0].brand = '宝马456';
          person.cars[0].price = 456;
        }
      })
    } catch (error) {
      console.error('修改车2失败:', error);
    }
  }
  
  // 添加示例数据
  const addExampleData2 = async () => {
    try {
      const realm = await getDB();
      realm.write(() => {
        // 创建一个车
        const car = realm.create<CarType>('Car', {
          _id: new Realm.BSON.ObjectId().toString(),
          name: '宝马1',
          brand: '宝马1',
          price: 300000
        });

        // 创建一个人
        const person = realm.create<PersonType>('Person', {
          _id: new Realm.BSON.ObjectId().toString(),
          name: '张三',
          age: 30,
          address: '北京市朝阳区',
          dogs: [] as string[],
          createTime: new Date(),
          updateTime: new Date(),
          cars: [car]
        });
      });

      // 重新加载数据
      await loadData();
    } catch (error) {
      console.error('添加数据失败:', error);
    }
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Button title="添加示例数据" onPress={addExampleData2} />
      <Button title="修改车" onPress={updateCar} />
      <Button title="修改车2" onPress={updateCar2} />
    </ScrollView>
  );
}

// 5. 主组件
export default function Db() {
  return <DataList />;
}