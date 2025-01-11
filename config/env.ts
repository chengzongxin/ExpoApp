// 验证环境变量是否存在
const requiredEnvVars = [
  'EXPO_PUBLIC_OBS_BUCKET',
  'EXPO_PUBLIC_OBS_ENDPOINT',
  'EXPO_PUBLIC_OBS_ACCESS_KEY_ID',
  'EXPO_PUBLIC_OBS_SECRET_ACCESS_KEY'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// 导出环境变量
export const ENV = {
  OBS: {
    BUCKET: process.env.EXPO_PUBLIC_OBS_BUCKET!,
    ENDPOINT: process.env.EXPO_PUBLIC_OBS_ENDPOINT!,
    ACCESS_KEY_ID: process.env.EXPO_PUBLIC_OBS_ACCESS_KEY_ID!,
    SECRET_ACCESS_KEY: process.env.EXPO_PUBLIC_OBS_SECRET_ACCESS_KEY!
  }
}; 