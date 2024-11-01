
// 定义服务类型的接口
export interface ServiceTypeConfig {
  id: number;
  code: string;
  serviceTypeCode: string;
  serviceTypeName: string;
  relationSpuNum: number | null;
  icon: string;
  remark: string | null;
  createTime: string;
  creatorName: string;
  status: number;
  sort: number | null;
  selected?: boolean;
}

export interface ServiceTypeTreeDO {
  id: number;
  parentId: number;
  code: string;
  name: string;
  remark: string;
  createTime: string;
  creatorName: string;
  updateTime: string;
  updaterName: string;
  status: number;
  sort: number;
  children: ServiceTypeTreeDO[]; // 递归定义子节点
  selected?: boolean;
  checked?: boolean;
}
