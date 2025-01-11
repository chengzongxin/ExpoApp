import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { getDBPath, closeDB } from './db';
import { uploadRealmBackup } from '../utils/uploadFile';

// 定义备份目录
const BACKUP_DIR = Platform.select({
  ios: `${RNFS.DocumentDirectoryPath}/backups`,
  android: `${RNFS.ExternalDirectoryPath}/backups`,
})!;

// 确保备份目录存在
const ensureBackupDir = async () => {
  const exists = await RNFS.exists(BACKUP_DIR);
  if (!exists) {
    await RNFS.mkdir(BACKUP_DIR);
  }
};

// 生成备份文件名
const generateBackupFileName = () => {
  const date = new Date();
  return `backup_${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}.realm`;
};

// 备份数据库（本地+云端）
export const backupDatabase = async (note?: string) => {
  try {
    // 确保备份目录存在
    await ensureBackupDir();

    // 获取数据库文件路径
    const dbPath = getDBPath();
    
    // 关闭数据库连接以确保数据完整性
    closeDB();

    // 生成备份文件路径
    const backupFileName = generateBackupFileName();
    const localBackupPath = `${BACKUP_DIR}/${backupFileName}`;

    // 先进行本地备份
    await RNFS.copyFile(dbPath, localBackupPath);
    console.log('数据库本地备份成功:', localBackupPath);

    // 上传到华为云OBS
    const cloudUrl = await uploadRealmBackup(
      localBackupPath, 
      note || 'manual',
      (progress) => {
        console.log(`备份上传进度: ${progress}%`);
      }
    );

    console.log('数据库云端备份成功:', cloudUrl);

    return {
      localPath: localBackupPath,
      cloudUrl
    };
  } catch (error) {
    console.error('数据库备份失败:', error);
    throw error;
  }
};

// 获取所有本地备份文件列表
export const getBackupsList = async () => {
  try {
    await ensureBackupDir();
    const files = await RNFS.readDir(BACKUP_DIR);
    return files
      .filter(file => file.name.endsWith('.realm'))
      .sort((a, b) => (b.mtime?.getTime() || 0) - (a.mtime?.getTime() || 0));
  } catch (error) {
    console.error('获取备份列表失败:', error);
    throw error;
  }
};

// 从备份文件恢复数据库
export const restoreFromBackup = async (backupPath: string) => {
  try {
    // 检查备份文件是否存在
    const exists = await RNFS.exists(backupPath);
    if (!exists) {
      throw new Error('备份文件不存在');
    }

    // 获取当前数据库路径
    const dbPath = getDBPath();
    
    // 关闭数据库连接
    closeDB();

    // 删除当前数据库文件
    if (await RNFS.exists(dbPath)) {
      await RNFS.unlink(dbPath);
    }

    // 复制备份文件到数据库位置
    await RNFS.copyFile(backupPath, dbPath);

    console.log('数据库恢复成功');
    return true;
  } catch (error) {
    console.error('数据库恢复失败:', error);
    throw error;
  }
};

// 删除本地备份文件
export const deleteBackup = async (backupPath: string) => {
  try {
    if (await RNFS.exists(backupPath)) {
      await RNFS.unlink(backupPath);
      console.log('备份文件删除成功:', backupPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('删除备份文件失败:', error);
    throw error;
  }
};

// 获取备份文件信息
export const getBackupInfo = async (backupPath: string) => {
  try {
    const stat = await RNFS.stat(backupPath);
    return {
      path: backupPath,
      size: stat.size,
      created: stat.ctime,
      modified: stat.mtime,
    };
  } catch (error) {
    console.error('获取备份信息失败:', error);
    throw error;
  }
};

// 自动备份（可以设置定期自动备份）
export const autoBackup = async (maxBackups: number = 5) => {
  try {
    // 执行备份
    const backupResult = await backupDatabase('auto');

    // 获取所有本地备份
    const backups = await getBackupsList();

    // 如果超过最大备份数，删除最旧的备份
    if (backups.length > maxBackups) {
      const backupsToDelete = backups.slice(maxBackups);
      for (const backup of backupsToDelete) {
        await deleteBackup(backup.path);
      }
    }

    return backupResult;
  } catch (error) {
    console.error('自动备份失败:', error);
    throw error;
  }
}; 