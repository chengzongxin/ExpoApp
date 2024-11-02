import { makeAutoObservable } from 'mobx';
import { ServiceTypeConfig, ServiceTypeTreeDO } from '@/types';

// 定义本地使用的服务类型接口
interface ServiceTypeWithCount extends Omit<ServiceTypeConfig, 'id' | 'code' | 'relationSpuNum' | 'icon' | 'remark' | 'createTime' | 'updateTime' | 'creatorName' | 'updaterName' | 'status' | 'sort'> {
  count: number;
}

export default class ServiceCategoryCheckStore {
  // 服务类型数据
  serviceTypes: ServiceTypeWithCount[] = [];
  // 选中的品类数据
  selectedCategories: Record<string, string[]> = {};

  constructor() {
    makeAutoObservable(this);
    this.fetchServiceTypes();
  }

  // 获取服务类型数据
  async fetchServiceTypes() {
    const result = {
      code: 200,
      data: [
        {
          serviceTypeCode: "LX001",
          serviceTypeName: "测量",
          count: 999
        },
        {
          serviceTypeCode: "LX002", 
          serviceTypeName: "安装",
          count: 48
        },
        {
          serviceTypeCode: "LX003",
          serviceTypeName: "维修",
          count: 0
        }
      ]
    };
    
    if (result.code === 200) {
      this.serviceTypes = result.data;
    }
  }

  // 设置选中的品类数据
  setSelectedCategories(data: Record<string, string[]>) {
    this.selectedCategories = data;
  }

  // 获取指定服务类型的选中品类数量
  getSelectedCount(serviceTypeCode: string): number {
    return this.selectedCategories[serviceTypeCode]?.length || 0;
  }
}
