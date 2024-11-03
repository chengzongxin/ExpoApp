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
  categoryTree: ServiceTypeTreeDO[] = [];

  constructor(initialSelectedCategories?: Record<string, string[]>) {
    makeAutoObservable(this);
    this.fetchServiceTypes();
    this.getCategoriesTree();
    
    // 如果有传入初始选择数据，则使用传入的数据
    if (initialSelectedCategories) {
      this.selectedCategories = initialSelectedCategories;
    } else {
      // 否则获取默认数据
      this.getSelectedCategories();
    }
  }

  async getCategoriesTree() {
    const result = data1;
    const { code, data } = result;
    if (code === 200) {
      this.categoryTree = data;
    }
  }

  async getSelectedCategories() {
    const result = data3;
    const { code, data } = result;
    if (code === 200) {
      this.selectedCategories = data;
    }
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

  // 通过分类树结构和选择的节点获取选中品类树结构
  getSelectedCategoriesTree(categoryTree: ServiceTypeTreeDO[], selectedNodes: string[]): ServiceTypeTreeDO[] {
    if (!selectedNodes || selectedNodes.length === 0) {
      return [];
    }

    // 深拷贝原始树，避免修改原始数据
    const clonedTree: ServiceTypeTreeDO[] = JSON.parse(JSON.stringify(categoryTree));
    
    // 用于存储节点ID到其完整路径的映射
    const nodePathMap = new Map<string, ServiceTypeTreeDO[]>();
    
    // 递归遍历树，构建节点路径映射
    const buildNodePathMap = (nodes: ServiceTypeTreeDO[], parentPath: ServiceTypeTreeDO[] = []) => {
      nodes.forEach(node => {
        const currentPath = [...parentPath, node];
        nodePathMap.set(node.id.toString(), currentPath);
        
        if (node.children && node.children.length > 0) {
          buildNodePathMap(node.children, currentPath);
        }
      });
    };
    
    buildNodePathMap(clonedTree);
    
    // 用于存储所有需要保留的节点ID
    const nodesToKeep = new Set<string>();
    
    // 收集选中节点及其所有父节点
    selectedNodes.forEach(nodeId => {
      const path = nodePathMap.get(nodeId);
      if (path) {
        path.forEach(node => {
          nodesToKeep.add(node.id.toString());
        });
      }
    });
    
    // 递归过滤树，只保留需要的节点
    const filterTree = (nodes: ServiceTypeTreeDO[]): ServiceTypeTreeDO[] => {
      return nodes
        .filter(node => nodesToKeep.has(node.id.toString()))
        .map(node => ({
          ...node,
          children: node.children ? filterTree(node.children) : []
        }));
    };
    
    // 过滤得到最终的树结构
    const filteredTree = filterTree(clonedTree);
    
    return filteredTree;
  }
}




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

  const data3 = {
    code: 200,
    data: {"LX001": ["75", "81", "78", "74"], "LX002": ["67", "75", "81", "78", "76"], "LX003": ["67"]},
    msg: ""
  };