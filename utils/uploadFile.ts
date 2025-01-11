// @ts-ignore
import ObsClient from "esdk-obs-browserjs";
import RNFS from 'react-native-fs';
import { ENV } from '../config/env';

const bucket = process.env.EXPO_PUBLIC_OBS_BUCKET!;
const endpoint = process.env.EXPO_PUBLIC_OBS_ENDPOINT!;
const accessKeyId = process.env.EXPO_PUBLIC_OBS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.EXPO_PUBLIC_OBS_SECRET_ACCESS_KEY!;

// backups/                          # 根目录
// ├── realm/                        # Realm备份专用目录
// │   ├── manually/                 # 手动备份
// │   │   └── realm_backup_xxx.realm
// │   └── auto/                     # 自动备份
// │       └── realm_backup_xxx.realm
// ├── 2024/                         # 年份
// │   ├── 01/                      # 月份
// │   │   ├── 01/                  # 日期
// │   │   │   └── file_xxx.ext
// │   │   └── 02/
// │   └── 02/
// └── other_folders/                # 其他自定义文件夹

// 使用默认文件夹结构（按日期）
// await uploadFile(filePath);
// 使用自定义文件夹
// await uploadFile(filePath, 'myfile.txt', 'custom/folder/path');
// 上传Realm备份
// await uploadRealmBackup(realmPath, 'manually');

// 创建ObsClient实例
const obsClient = new ObsClient({
  access_key_id: ENV.OBS.ACCESS_KEY_ID,
  secret_access_key: ENV.OBS.SECRET_ACCESS_KEY,
  server: ENV.OBS.ENDPOINT
});

// MIME类型映射
const mimeTypes: { [key: string]: string } = {
  realm: 'application/octet-stream',
  json: 'application/json',
  txt: 'text/plain',
};

// 生成文件夹路径
function generateFolderPath(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `backups/${year}/${month}/${day}`;
}

// 生成唯一文件名
function generateUniqueFileName(originalName: string, extension: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const secondRandom = Math.random().toString(36).substring(2, 10);
  
  return `${originalName}_${timestamp}_${randomString}_${secondRandom}.${extension}`;
}

/**
 * 上传文件到OBS
 * @param filePath 文件路径
 * @param customFileName 自定义文件名（可选）
 * @param customFolder 自定义文件夹路径（可选）
 * @param onProgress 上传进度回调（可选）
 * @returns 返回文件的URL
 */
export const uploadFile = async (
  filePath: string,
  customFileName?: string,
  customFolder?: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // 获取文件扩展名
    const extension = filePath.split('.').pop()?.toLowerCase() || 'realm';

    console.log('filePath extension',filePath, extension);
    
    // 获取原始文件名（不包含路径）
    const originalName = filePath.split('/').pop()?.split('.')[0] || 'file';
    
    // 生成文件名
    const fileName = customFileName || generateUniqueFileName(originalName, extension);

    // 生成完整的文件路径（包含文件夹）
    const folderPath = customFolder || generateFolderPath();
    const fullPath = `${folderPath}/${fileName}`;

    // 读取文件内容为base64
    const fileContent = await RNFS.readFile(filePath, 'base64');

    // 设置正确的MIME类型
    const contentType = mimeTypes[extension] || 'application/octet-stream';

    // 上传文件到OBS
    const result = await new Promise((resolve, reject) => {
      obsClient.putObject(
        {
          Bucket: bucket,
          Key: fullPath, // 使用包含文件夹的完整路径
          Body: fileContent,
          ContentType: contentType,
          ContentTransferEncoding: 'base64',
          ProgressCallback: (transferredAmount: number, totalAmount: number) => {
            const progress = (transferredAmount / totalAmount) * 100;
            onProgress?.(progress);
            console.log(`上传进度: ${progress.toFixed(2)}%`);
          },
        },
        (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    // 构造并返回文件URL
    const url = `https://${bucket}.${endpoint}/${fullPath}`;
    console.log("文件上传成功，URL：", url);
    return url;
  } catch (error) {
    console.error("上传错误：", error);
    throw new Error("文件上传失败，请重试");
  }
};

/**
 * 删除指定文件夹下的所有文件
 * @param folderPath 文件夹路径
 */
async function deleteFilesInFolder(folderPath: string): Promise<void> {
  try {

    console.log('====================================');
    console.log('listobjects1 = ', folderPath);
    console.log('====================================');

    // 列出文件夹中的所有文件
    const result = await obsClient.listObjects({
      Bucket: bucket,
    });

    console.log('====================================');
    console.log('listobjects2 = ',result);
    console.log('====================================');

    if (result.CommonMsg.Status === 200 && result.InterfaceResult.Contents) {
      // 删除每个文件
      for (const file of result.InterfaceResult.Contents) {
        await obsClient.deleteObject({
          Bucket: bucket,
          Key: file.Key
        });
        console.log(`已删除旧备份文件: ${file.Key}`);
      }
    }
  } catch (error) {
    console.error('删除旧备份文件失败:', error);
    // 继续执行，不中断上传流程
  }
}

/**
 * 上传Realm数据库文件
 * @param realmPath Realm数据库文件路径
 * @param note 备注信息（可选）
 * @param onProgress 上传进度回调（可选）
 */
export const uploadRealmBackup = async (
  realmPath: string,
  note?: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    // const userId = userStore.userId;
    const customFileName = `realm_backup_${note ? note + '_' : ''}${timestamp}.realm`;
    
    // 使用自定义文件夹路径
    const customFolder = `backups/realm/${note || 'default'}`;
    
    // 上传新备份
    return await uploadFile(realmPath, customFileName, customFolder, onProgress);
  } catch (error) {
    console.error("备份上传失败：", error);
    throw error;
  }
}; 