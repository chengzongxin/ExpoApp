// 定义 Person 接口
export interface Person {
  _id: string;
  name: string;
  age: number;
  cars: Car[];
  address: string;
  dogs?: string[];  // 关联的狗的 ID 数组
  createTime: Date;
  updateTime: Date;
}

// Person Schema 定义
export const PersonSchema = {
  name: 'Person',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    age: 'int',
    cars: 'Car[]',
    address: 'string',
    dogs: 'string[]',  // 存储 Dog 的 ID 数组
    createTime: 'date',
    updateTime: 'date'
  }
};


// 定义 Car 接口
export interface Car {
  _id: string;
  name: string;
  brand: string;
  price: number;
}

export const CarSchema = {
  name: 'Car',
  properties: {
    _id: 'string',
    name: 'string',
    brand: 'string',
    price: 'int'
  }
}

// 定义 Dog 接口
export interface Dog {
  _id: string;
  name: string;
  breed: string;
  age: number;
  ownerId: string;  // 关联的主人 ID
  createTime: Date;
  updateTime: Date;
}

// Dog Schema 定义
export const DogSchema = {
  name: 'Dog',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    breed: 'string',
    age: 'int',
    ownerId: 'string',
    createTime: 'date',
    updateTime: 'date'
  }
};

// 用于部分更新的类型
export type PartialPerson = Partial<Person>;
export type PartialDog = Partial<Dog>;
export type PartialCar = Partial<Car>;