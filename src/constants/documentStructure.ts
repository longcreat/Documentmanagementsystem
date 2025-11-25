import { DocumentCategory } from "../components/DocumentManager";

export interface SectionStructure {
  name: string;
  subsections?: string[];
}

export interface CategoryStructure {
  key: DocumentCategory | "自定义类别";
  label: string;
  sections: SectionStructure[];
}

export const DOCUMENT_STRUCTURE: CategoryStructure[] = [
  {
    key: "酒店基础信息",
    label: "酒店基础信息",
    sections: [
      { name: "酒店基本信息" },
      { name: "联系方式" },
      { name: "酒店基本设施" },
      { name: "开业和装修" },
      { name: "交通信息" },
    ],
  },
  {
    key: "房型信息",
    label: "房型信息",
    sections: [
      { name: "房型名称" },
      { name: "基础信息" },
      { name: "浴室信息", subsections: ["洗浴用品", "卫浴设施"] },
      { name: "网络与通讯" },
      { name: "客房布局和家具" },
      { name: "客房设施" },
      { name: "媒体科技" },
      { name: "食品饮品" },
      { name: "便民服务" },
    ],
  },
  {
    key: "设施信息",
    label: "设施信息",
    sections: [
      { name: "基本信息" },
      { name: "前台服务" },
      { name: "公共区" },
      { name: "商务服务" },
      { name: "无障碍设施服务" },
      { name: "娱乐设施", subsections: ["泳池", "棋牌室", "游戏室", "观影房"] },
      { name: "交通服务" },
      { name: "亲子设施" },
      { name: "康体设施", subsections: ["Spa", "按摩室", "桑拿", "其他"] },
      { name: "餐饮服务", subsections: ["餐厅", "酒吧", "咖啡厅", "其他"] },
      { name: "运动设施", subsections: ["健身室", "瑜伽课程", "其他"] },
      { name: "清洁服务" },
      { name: "安全与安保" },
    ],
  },
  {
    key: "政策信息",
    label: "政策信息",
    sections: [
      { name: "入离时间" },
      { name: "预订提示" },
      { name: "入住提示" },
      { name: "年龄限制" },
      { name: "宠物" },
      { name: "服务型动物" },
      { name: "儿童入住及加床政策" },
      { name: "支付方式" },
      { name: "早餐" },
    ],
  },
  {
    key: "周边POI",
    label: "周边POI",
    sections: [
      { name: "交通" },
      { name: "美食" },
      { name: "景点" },
      { name: "购物" }
    ],
  },
  {
    key: "自定义类别",
    label: "自定义类别",
    sections: [],
  },
];
