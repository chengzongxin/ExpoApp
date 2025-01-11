import Realm from 'realm';
import { Platform, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import { CarSchema, DogSchema, PersonSchema } from './schemas';

const SCHEMA_VERSION = 3;

// 定义数据库文件路径
const DB_PATH = Platform.select({
  ios: `${RNFS.DocumentDirectoryPath}/default.realm`,
  android: `${RNFS.DocumentDirectoryPath}/default.realm`,
})!;

// 导出所有 schema 供其他模块使用
export const ALL_SCHEMAS = [
  PersonSchema,
  DogSchema,
  CarSchema
];

// 初始化Realm数据库
export const initDB = async () => {
  try {
    const realm = await Realm.open({
      path: DB_PATH,
      schema: ALL_SCHEMAS,
      schemaVersion: SCHEMA_VERSION + 1,
      onMigration: (oldRealm, newRealm) => {
        console.log('数据库迁移开始，版本:', oldRealm.schemaVersion);
      }
    });
    console.log('数据库初始化成功，路径:', DB_PATH);
    return realm;
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
};

// 获取Realm实例
let realmInstance: Realm | null = null;
export const getDB = async () => {
  if (!realmInstance || realmInstance.isClosed) {
    realmInstance = await initDB();
  }
  return realmInstance;
};

// 关闭Realm实例
export const closeDB = () => {
  if (realmInstance && !realmInstance.isClosed) {
    realmInstance.close();
    realmInstance = null;
  }
};

// 获取数据库文件路径
export const getDBPath = () => DB_PATH;

// 删除数据库实例
export const deleteDB = async () => {
  try {
    closeDB();
    await Realm.deleteFile({ path: DB_PATH });
    console.log('数据库删除成功');
  } catch (error) {
    console.error('删除数据库失败:', error);
    throw error;
  }
};

// 重置数据库（删除并重新创建）
export const resetDB = async () => {
  try {
    await deleteDB();
    realmInstance = await initDB();
    console.log('数据库重置成功');
    return realmInstance;
  } catch (error) {
    console.error('重置数据库失败:', error);
    throw error;
  }
};

// 添加一个新的工具函数来获取所有表的数据
export const getAllTablesData = async () => {
  try {
    const realm = await getDB();
    const schemaNames = realm.schema.map(schema => schema.name);
    const allData: { [key: string]: any[] } = {};
    
    schemaNames.forEach(schemaName => {
      const objects = realm.objects(schemaName);
      // 改进数据转换方法
      allData[schemaName] = Array.from(objects).map(obj => {
        const plainObj: any = {};
        // 获取 schema 定义的所有属性
        const objectSchema = realm.schema.find(s => s.name === schemaName);
        if (objectSchema) {
          Object.keys(objectSchema.properties).forEach(propName => {
            plainObj[propName] = obj[propName];
          });
        }
        return plainObj;
      });
      console.log(`表 ${schemaName} 中有 ${objects.length} 条数据`);
    });
    
    return {
      schemaNames,
      tablesData: allData,
      totalTables: schemaNames.length
    };
  } catch (error) {
    console.error('读取数据库表数据失败:', error);
    throw error;
  }
};

// 获取单个表的数据
export const getTableData = async (tableName: string) => {
  try {
    const realm = await getDB();
    const objects = realm.objects(tableName);
    return Array.from(objects).map(obj => ({ ...obj }));
  } catch (error) {
    console.error(`读取表 ${tableName} 数据失败:`, error);
    throw error;
  }
};

 
