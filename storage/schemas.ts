// 定义 Person 接口
export interface Person {
  _id: string;
  name: string;
  age: number;
  address: string;
  dogs?: string[];  // 关联的狗的 ID 数组
  createTime: Date;
  updateTime: Date;
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

// Person Schema 定义
export const PersonSchema = {
  name: 'Person',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    age: 'int',
    address: 'string',
    dogs: 'string[]',  // 存储 Dog 的 ID 数组
    createTime: 'date',
    updateTime: 'date'
  }
};

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
