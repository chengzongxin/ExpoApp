import { makeAutoObservable } from 'mobx';
import { ServiceTypeConfig, ServiceTypeTreeDO } from '@/types';



const data1 = {
  code: 200,
  data: [
    {
      id: 65,
      parentId: 0,
      code: "PL01",
      name: "窗帘",
      remark: "",
      createTime: "2024-10-30 09:54:01",
      creatorName: "真实姓名",
      updateTime: "2024-10-30 10:23:15",
      updaterName: "",
      status: 0,
      sort: 0,
      children: [
        {
          id: 66,
          parentId: 65,
          code: "PL0101",
          name: "手动窗帘",
          remark: "",
          createTime: "2024-10-30 09:54:12",
          creatorName: "真实姓名",
          updateTime: "2024-10-30 10:23:15",
          updaterName: "",
          status: 0,
          sort: 0,
          children: [
            {
              id: 67,
              parentId: 66,
              code: "PL010101",
              name: "直轨",
              remark: "",
              createTime: "2024-10-30 09:54:32",
              creatorName: "真实姓名",
              updateTime: "2024-10-30 10:23:15",
              updaterName: "",
              status: 0,
              sort: 0,
              children: []
            }
          ]
        }
      ]
    },
    {
      id: 71,
      parentId: 0,
      code: "PL03",
      name: "测试",
      remark: "测试",
      createTime: "2024-10-30 16:50:41",
      creatorName: "真实姓名",
      updateTime: "2024-10-30 18:43:05",
      updaterName: "",
      status: 0,
      sort: 0,
      children: [
        {
          id: 73,
          parentId: 71,
          code: "PL0301",
          name: "测试-二级1",
          remark: "",
          createTime: "2024-10-30 18:42:23",
          creatorName: "真实姓名",
          updateTime: "2024-10-30 18:43:05",
          updaterName: "",
          status: 0,
          sort: 0,
          children: [
            {
              id: 75,
              parentId: 73,
              code: "PL030101",
              name: "测试-三级1",
              remark: "",
              createTime: "2024-10-30 18:43:11",
              creatorName: "真实姓名",
              updateTime: "2024-10-30 18:43:11",
              updaterName: "",
              status: 0,
              sort: 0,
              children: []
            },
            {
              id: 81,
              parentId: 73,
              code: "PL030102",
              name: "测试-三级2",
              remark: "",
              createTime: "2024-10-31 11:25:17",
              creatorName: "真实姓名",
              updateTime: "2024-10-31 11:25:17",
              updaterName: "",
              status: 0,
              sort: 0,
              children: []
            }
          ]
        },
        {
          id: 78,
          parentId: 71,
          code: "PL0302",
          name: "测试-二级2",
          remark: "",
          createTime: "2024-10-31 11:24:47",
          creatorName: "真实姓名",
          updateTime: "2024-10-31 11:24:47",
          updaterName: "",
          status: 0,
          sort: 0,
          children: []
        }
      ]
    },
    {
      id: 72,
      parentId: 0,
      code: "PL04",
      name: "牙刷",
      remark: "",
      createTime: "2024-10-30 18:40:48",
      creatorName: "真实姓名",
      updateTime: "2024-10-30 18:40:48",
      updaterName: "",
      status: 0,
      sort: 0,
      children: [
        {
          id: 74,
          parentId: 72,
          code: "PL0401",
          name: "牙刷-二级",
          remark: "",
          createTime: "2024-10-30 18:42:35",
          creatorName: "真实姓名",
          updateTime: "2024-10-30 18:42:35",
          updaterName: "",
          status: 0,
          sort: 0,
          children: []
        }
      ]
    },
    {
      id: 76,
      parentId: 0,
      code: "PL05",
      name: "墙布",
      remark: "",
      createTime: "2024-10-30 18:55:36",
      creatorName: "真实姓名",
      updateTime: "2024-10-30 19:09:59",
      updaterName: "",
      status: 0,
      sort: 0,
      children: []
    }
  ],
  msg: ""
};

const data2 = {
  code: 200,
  data: [
    {
      id: 1,
      code: "YHLX001",
      serviceTypeCode: "LX001",
      serviceTypeName: "测量",
      relationSpuNum: null,
      icon: "https://hxc1.obs.cn-south-1.myhuaweicloud.com/image_1730266140617.jpg",
      remark: null,
      createTime: "2024-10-18 13:15:58",
      updateTime: "2024-10-18 13:16:04",
      creatorName: "真实姓名",
      updaterName: "真实姓名",
      status: 0,
      sort: null
    },
    {
      id: 2,
      code: "YHLX002",
      serviceTypeCode: "LX002",
      serviceTypeName: "安装",
      relationSpuNum: null,
      icon: "https://hxc1.obs.cn-south-1.myhuaweicloud.com/image_1730266143317.jpg",
      remark: null,
      createTime: "2024-10-18 13:15:58",
      updateTime: "2024-10-18 13:16:04",
      creatorName: "真实姓名",
      updaterName: "真实姓名",
      status: 0,
      sort: null
    },
    {
      id: 3,
      code: "YHLX003",
      serviceTypeCode: "LX003",
      serviceTypeName: "维修",
      relationSpuNum: null,
      icon: "https://hxc1.obs.cn-south-1.myhuaweicloud.com/image_1730266145565.jpg",
      remark: null,
      createTime: "2024-10-18 13:15:58",
      updateTime: "2024-10-18 13:16:04",
      creatorName: "真实姓名",
      updaterName: "真实姓名",
      status: 0,
      sort: null
    }
  ],
  msg: ""
};

export default class ServiceCategoryStore {
  // 当前tab索引
  currentTabIdx: number = 0;
  currentTabName: string = '';
  // 服务类型
  serviceTypes: ServiceTypeConfig[] = [];
  // 分类树
  categoryTree1: ServiceTypeTreeDO[] = [];
  categoryTree2: ServiceTypeTreeDO[] = [];
  categoryTree3: ServiceTypeTreeDO[] = [];
  // 分类树选中节点
  categoryCheckedNodes1: ServiceTypeTreeDO[] = [];
  categoryCheckedNodes2: ServiceTypeTreeDO[] = [];
  categoryCheckedNodes3: ServiceTypeTreeDO[] = [];

  // 设置选择高亮
  selectedLevel1: ServiceTypeTreeDO | null = null;
  selectedLevel2: ServiceTypeTreeDO | null = null;
  selectedLevel3: ServiceTypeTreeDO | null = null;

  constructor() {
    makeAutoObservable(this);
    this.fetchAllServiceTypes();
    this.getCategoriesTree();
  }

  async fetchAllServiceTypes() {
    const result = data2;
    const { code, data } = result;
    if (code === 200) {
      this.serviceTypes = data;
    }
  }

  deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  async getCategoriesTree() {
    const result = data1;
    const { code, data } = result;
    if (code === 200) {
      this.categoryTree1 = this.deepCopy(data);
      this.categoryTree2 = this.deepCopy(data);
      this.categoryTree3 = this.deepCopy(data);
    }
  }

  getCurrentCategoryTree(): ServiceTypeTreeDO[] {
    if (this.currentTabIdx === 0) {
      return this.categoryTree1;
    } else if (this.currentTabIdx === 1) {
      return this.categoryTree2;
    } else if (this.currentTabIdx === 2) {
      return this.categoryTree3;
    }
    return [];
  }

  storeCurrentCheckedNodes(checkedNodes: ServiceTypeTreeDO[]) {
    if (this.currentTabIdx === 0) {
      this.categoryCheckedNodes1 = checkedNodes;
    } else if (this.currentTabIdx === 1) {
      this.categoryCheckedNodes2 = checkedNodes;
    } else if (this.currentTabIdx === 2) {
      this.categoryCheckedNodes3 = checkedNodes;
    }
  }

  getCurrentCheckedNodes(index: number): ServiceTypeTreeDO[] {
    if (index === 0) {
      return this.categoryCheckedNodes1;
    } else if (index === 1) {
      return this.categoryCheckedNodes2;
    } else if (index === 2) {
      return this.categoryCheckedNodes3;
    }
    return [];
  }

  getAllCheckedNodes(): ServiceTypeTreeDO[] {
    return [...this.categoryCheckedNodes1, ...this.categoryCheckedNodes2, ...this.categoryCheckedNodes3];
  }

  getResultData(): Record<string, string[]> {
    // return {"LX001":["1"],"LX002":["2"],"LX003":["3"]};
    const result: Record<string, string[]> = {};
    if (this.serviceTypes.length > 0) {
      this.serviceTypes.forEach((item, index) => {
        const checkedNodes = this.getCurrentCheckedNodes(index).map(node => node.id.toString());
        result[item.serviceTypeCode] = checkedNodes;
      });
    }
    return result;
  }

  getResultDataForDisplay(): string {
    let displayData = '';
    this.serviceTypes.forEach((item, index) => {
      const checkedNodes = this.getCurrentCheckedNodes(index).map(node => node.name);
      displayData += `${item.serviceTypeName}: ${checkedNodes.join(",")} `;
    });
    return displayData.trim();
  }
}
