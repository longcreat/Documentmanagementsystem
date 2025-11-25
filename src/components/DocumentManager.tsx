import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DocumentList } from './DocumentList';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

export type DocumentCategory = '酒店基础信息' | '房型信息' | '设施信息' | '政策信息' | '周边POI' | '自定义类别';

export interface PoiEntry {
  id: string;
  tag?: string;
  name: string;
  distance: string;
}

export interface DocumentField {
  key: string;
  label: string;
  value: string | boolean | PoiEntry[] | string[];
  required: boolean;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'number' | 'boolean' | 'boolean-with-options' | 'boolean-with-languages' | 'boolean-with-text' | 'poi-list';
  section?: string; // 字段所属模块
  subsection?: string; // 字段所属子模块
  isCustom?: boolean; // 是否为自定义字段
  // 收费相关字段（用于boolean-with-options类型）
  feeStatus?: 'free' | 'charged' | 'conditional' | ''; // 收费状态
  feeNote?: string; // 收费说明
  additionalNote?: string; // 额外备注（营业时间、预约方式等）
  // 语言选择字段（用于boolean-with-languages类型）
  languages?: string[]; // 支持的语言列表
}

export interface Document {
  id: string;
  title: string;
  fields: DocumentField[];
  category: DocumentCategory;
  status: 'pending' | 'confirmed' | 'draft';
  source: string;
  lastModified: Date;
  completeness: number;
}

// 根据类别定义字段模板
export const getFieldsTemplate = (category: DocumentCategory): DocumentField[] => {
  switch (category) {
    case '酒店基础信息':
      return [
        // 酒店基本信息
        { key: 'hotelNameCn', label: '酒店中文名称', value: '', required: true, placeholder: '请输入酒店中文名称', type: 'text', section: '酒店基本信息' },
        { key: 'hotelNameEn', label: '酒店英文名称', value: '', required: false, placeholder: '请输入酒店英文名称', type: 'text', section: '酒店基本信息' },
        { key: 'addressCn', label: '酒店中文地址', value: '', required: true, placeholder: '请输入酒店中文地址', type: 'textarea', section: '酒店基本信息' },
        { key: 'addressEn', label: '酒店英文地址', value: '', required: false, placeholder: '请输入酒店英文地址', type: 'textarea', section: '酒店基本信息' },
        { key: 'description', label: '酒店介绍', value: '', required: true, placeholder: '请输入酒店介绍', type: 'textarea', section: '酒店基本信息' },
        { key: 'country', label: '国家', value: '', required: true, placeholder: '例如：中国', type: 'text', section: '酒店基本信息' },
        { key: 'city', label: '城市', value: '', required: true, placeholder: '例如：北京', type: 'text', section: '酒店基本信息' },
        { key: 'specificAddress', label: '具体地址', value: '', required: true, placeholder: '请输入详细地址', type: 'text', section: '酒店基本信息' },
        
        // 联系方式
        { key: 'phone', label: '联系电话', value: '', required: true, placeholder: '例如：010-12345678', type: 'text', section: '联系方式' },
        { key: 'email', label: '邮箱', value: '', required: false, placeholder: '例如：hotel@example.com', type: 'text', section: '联系方式' },
        { key: 'postalCode', label: '邮政编码', value: '', required: false, placeholder: '例如：100000', type: 'text', section: '联系方式' },
        
        // 酒店基本设施
        { key: 'starRating', label: '酒店星级', value: '', required: true, placeholder: '例如：五星级', type: 'text', section: '酒店基本设施' },
        { key: 'brandName', label: '品牌名称', value: '', required: false, placeholder: '例如：希尔顿', type: 'text', section: '酒店基本设施' },
        { key: 'roomCount', label: '客房数', value: '', required: true, placeholder: '例如：200间', type: 'text', section: '酒店基本设施' },
        
        // 开业和装修
        { key: 'openingYear', label: '开业年份', value: '', required: false, placeholder: '例如：2020年', type: 'text', section: '开业和装修' },
        { key: 'renovationYear', label: '装修年份', value: '', required: false, placeholder: '例如：2023年', type: 'text', section: '开业和装修' },
        
        // 交通信息
        { key: 'subway', label: '地铁', value: '', required: false, placeholder: '例如：距离1号线XX站500米', type: 'textarea', section: '交通信息' },
        { key: 'airport', label: '机场', value: '', required: false, placeholder: '例如：距离首都国际机场30公里', type: 'textarea', section: '交通信息' },
        { key: 'publicTransport', label: '公共线路', value: '', required: false, placeholder: '请列出附近的公交线路', type: 'textarea', section: '交通信息' },
        { key: 'driving', label: '自驾', value: '', required: false, placeholder: '请说明自驾路线或停车信息', type: 'textarea', section: '交通信息' },
      ];
    case '房型信息':
      return [
        // 房型名称
        { key: 'roomTypeName', label: '房型名称', value: '', required: true, placeholder: '例如：豪华海景大床房', type: 'text', section: '房型名称' },
        
        // 基础信息
        { key: 'roomArea', label: '客房面积', value: '', required: true, placeholder: '例如：45㎡', type: 'text', section: '基础信息' },
        { key: 'bedType', label: '床型', value: '', required: true, placeholder: '例如：1张1.8米大床', type: 'text', section: '基础信息' },
        { key: 'floor', label: '楼层', value: '', required: false, placeholder: '例如：4-7层', type: 'text', section: '基础信息' },
        { key: 'nonSmoking', label: '是否禁烟', value: '', required: false, placeholder: '例如：禁烟', type: 'text', section: '基础信息' },
        { key: 'capacity', label: '容纳人数', value: '', required: true, placeholder: '例如：2人入住', type: 'text', section: '基础信息' },
        { key: 'view', label: '景观', value: '', required: false, placeholder: '例如：海景房', type: 'text', section: '基础信息' },
        { key: 'hasWindow', label: '是否有窗', value: '', required: false, placeholder: '例如：有窗', type: 'text', section: '基础信息' },
        
        // 浴室信息 - 洗浴用品
        { key: 'amenity_toothbrush', label: '牙刷', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
        { key: 'amenity_toothpaste', label: '牙膏', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
        { key: 'amenity_shower_gel', label: '沐浴露', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
        { key: 'amenity_shampoo', label: '洗发水', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
        { key: 'amenity_conditioner', label: '护发素', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
        { key: 'amenity_soap', label: '香皂', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
        { key: 'amenity_shower_cap', label: '浴帽', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
        { key: 'amenity_bath_towel', label: '浴巾', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
        { key: 'amenity_comb', label: '梳子', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
        { key: 'amenity_razor', label: '剃须刀', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
        { key: 'amenity_towel', label: '毛巾', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
        { key: 'amenity_bathrobe', label: '浴袍', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
        { key: 'amenity_cotton_pads', label: '化妆棉', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
        { key: 'amenity_cotton_swabs', label: '棉签', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
        
        // 浴室信息 - 卫浴设施
        { key: 'bathroom_bathtub', label: '浴缸', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
        { key: 'bathroom_shower', label: '淋浴', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
        { key: 'bathroom_toilet', label: '卫生间', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
        { key: 'bathroom_hairdryer', label: '吹风机', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
        { key: 'bathroom_mirror', label: '化妆镜', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
        { key: 'bathroom_hot_water', label: '24小时热水', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
        { key: 'bathroom_slippers', label: '拖鞋', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
        { key: 'bathroom_toilet_paper', label: '卫生纸', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
        { key: 'bathroom_anti_slip_mat', label: '浴室防滑垫', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
        
        // 网络与通讯
        { key: 'network_wifi', label: '客房WIFI', value: false, required: false, type: 'boolean', section: '网络与通讯' },
        { key: 'network_wired', label: '有线上网', value: false, required: false, type: 'boolean', section: '网络与通讯' },
        { key: 'network_phone', label: '客房电话', value: false, required: false, type: 'boolean', section: '网络与通讯' },
        { key: 'network_intl_phone', label: '国际长途电话', value: false, required: false, type: 'boolean', section: '网络与通讯' },
        
        // 客房布局和家具
        { key: 'furniture_desk', label: '书桌', value: false, required: false, type: 'boolean', section: '客房布局和家具' },
        { key: 'furniture_sofa', label: '沙发', value: false, required: false, type: 'boolean', section: '客房布局和家具' },
        { key: 'furniture_wardrobe', label: '衣柜/衣橱', value: false, required: false, type: 'boolean', section: '客房布局和家具' },
        { key: 'furniture_chair', label: '休闲椅', value: false, required: false, type: 'boolean', section: '客房布局和家具' },
        { key: 'furniture_balcony', label: '阳台', value: false, required: false, type: 'boolean', section: '客房布局和家具' },
        
        // 客房设施
        { key: 'facility_ac', label: '空调', value: false, required: false, type: 'boolean', section: '客房设施' },
        { key: 'facility_fridge', label: '冰箱', value: false, required: false, type: 'boolean', section: '客房设施' },
        { key: 'facility_washer', label: '洗衣机', value: false, required: false, type: 'boolean', section: '客房设施' },
        { key: 'facility_microwave', label: '微波炉', value: false, required: false, type: 'boolean', section: '客房设施' },
        { key: 'facility_heater', label: '暖气', value: false, required: false, type: 'boolean', section: '客房设施' },
        { key: 'facility_blackout_curtain', label: '遮光窗帘', value: false, required: false, type: 'boolean', section: '客房设施' },
        { key: 'facility_air_purifier', label: '空气净化器', value: false, required: false, type: 'boolean', section: '客房设施' },
        { key: 'facility_alarm_clock', label: '闹钟', value: false, required: false, type: 'boolean', section: '客房设施' },
        { key: 'facility_iron', label: '熨衣设备', value: false, required: false, type: 'boolean', section: '客房设施' },
        { key: 'facility_soundproof', label: '隔音门窗', value: false, required: false, type: 'boolean', section: '客房设施' },
        
        // 媒体科技
        { key: 'media_tv', label: '液晶电视机', value: false, required: false, type: 'boolean', section: '媒体科技' },
        { key: 'media_projector', label: '投影仪', value: false, required: false, type: 'boolean', section: '媒体科技' },
        { key: 'media_smart_lock', label: '智能门锁', value: false, required: false, type: 'boolean', section: '媒体科技' },
        { key: 'media_smart_control', label: '智能客控', value: false, required: false, type: 'boolean', section: '媒体科技' },
        
        // 食品饮品
        { key: 'food_kettle', label: '电热水壶', value: false, required: false, type: 'boolean', section: '食品饮品' },
        { key: 'food_water', label: '瓶装水', value: false, required: false, type: 'boolean', section: '食品饮品' },
        { key: 'food_coffee_pot', label: '咖啡壶/茶壶', value: false, required: false, type: 'boolean', section: '食品饮品' },
        { key: 'food_tea', label: '茶包', value: false, required: false, type: 'boolean', section: '食品饮品' },
        
        // 便民服务
        { key: 'service_safe', label: '房内保险箱', value: false, required: false, type: 'boolean', section: '便民服务' },
        { key: 'service_sewing_kit', label: '针线包', value: false, required: false, type: 'boolean', section: '便民服务' },
        { key: 'service_power_outlets', label: '多种规格电源插座', value: false, required: false, type: 'boolean', section: '便民服务' },
        { key: 'service_umbrella', label: '雨伞', value: false, required: false, type: 'boolean', section: '便民服务' },
        { key: 'service_lounge', label: '行政酒廊待遇', value: false, required: false, type: 'boolean', section: '便民服务' },
        { key: 'service_wake_up', label: '唤醒服务', value: false, required: false, type: 'boolean', section: '便民服务' },
      ];
    case '设施信息':
      return [
        // 前台服务
        { key: 'frontdesk_multilingual', label: '多语言服务', value: false, required: false, type: 'boolean-with-languages', section: '前台服务', languages: [] },
        { key: 'frontdesk_luggage', label: '行李寄存', value: false, required: false, type: 'boolean-with-options', section: '前台服务', feeStatus: '', feeNote: '', additionalNote: '' },
        { key: 'frontdesk_24h', label: '24小时前台', value: false, required: false, type: 'boolean', section: '前台服务' },
        { key: 'frontdesk_porter', label: '专职行李员', value: false, required: false, type: 'boolean-with-options', section: '前台服务', feeStatus: '', feeNote: '', additionalNote: '' },
        { key: 'frontdesk_self_checkin', label: '自助入住机', value: false, required: false, type: 'boolean', section: '前台服务' },
        { key: 'frontdesk_locker', label: '储物柜', value: false, required: false, type: 'boolean-with-options', section: '前台服务', feeStatus: '', feeNote: '', additionalNote: '' },
        { key: 'frontdesk_concierge', label: '礼宾服务', value: false, required: false, type: 'boolean-with-options', section: '前台服务', feeStatus: '', feeNote: '', additionalNote: '' },
        { key: 'frontdesk_eid', label: '电子身份证入住', value: false, required: false, type: 'boolean', section: '前台服务' },
        { key: 'frontdesk_safe', label: '前台贵重物品保险柜', value: false, required: false, type: 'boolean-with-options', section: '前台服务', feeStatus: '', feeNote: '', additionalNote: '' },
        { key: 'frontdesk_wakeup', label: '叫醒服务', value: false, required: false, type: 'boolean-with-options', section: '前台服务', feeStatus: '', feeNote: '', additionalNote: '' },
        { key: 'frontdesk_currency', label: '外币兑换服务', value: false, required: false, type: 'boolean-with-options', section: '前台服务', feeStatus: '', feeNote: '', additionalNote: '' },
        
        // 公共区
        { key: 'public_chinese_sign', label: '中文指示', value: false, required: false, type: 'boolean', section: '公共区' },
        { key: 'public_atm', label: '自助取款机', value: false, required: false, type: 'boolean', section: '公共区' },
        { key: 'public_wifi', label: '公共区WIFI', value: false, required: false, type: 'boolean', section: '公共区' },
        { key: 'public_smoking_area', label: '吸烟区', value: false, required: false, type: 'boolean', section: '公共区' },
        { key: 'public_elevator', label: '电梯', value: false, required: false, type: 'boolean', section: '公共区' },
        { key: 'public_garden', label: '花园', value: false, required: false, type: 'boolean', section: '公共区' },
        { key: 'public_ventilation', label: '新风系统', value: false, required: false, type: 'boolean', section: '公共区' },
        { key: 'public_nonsmoking_floor', label: '无烟楼层', value: false, required: false, type: 'boolean', section: '公共区' },
        { key: 'public_humidifier', label: '加湿器', value: false, required: false, type: 'boolean', section: '公共区' },
        { key: 'public_audio', label: '公共音响系统', value: false, required: false, type: 'boolean', section: '公共区' },
        { key: 'public_robot', label: '机器人服务', value: false, required: false, type: 'boolean', section: '公共区' },
        { key: 'public_nosmoking', label: '公共区域禁烟', value: false, required: false, type: 'boolean', section: '公共区' },
        
        // 商务服务
        { key: 'business_multifunction', label: '多功能厅', value: false, required: false, type: 'boolean', section: '商务服务' },
        { key: 'business_service', label: '商务服务', value: false, required: false, type: 'boolean', section: '商务服务' },
        { key: 'business_fax', label: '传真/复印', value: false, required: false, type: 'boolean', section: '商务服务' },
        { key: 'business_meeting', label: '会议厅', value: false, required: false, type: 'boolean', section: '商务服务' },
        { key: 'business_express', label: '快递服务', value: false, required: false, type: 'boolean', section: '商务服务' },
        { key: 'business_coworking', label: '共享办公空间', value: false, required: false, type: 'boolean', section: '商务服务' },
        { key: 'business_multimedia', label: '多媒体演示系统', value: false, required: false, type: 'boolean', section: '商务服务' },
        { key: 'business_wedding', label: '婚宴服务', value: false, required: false, type: 'boolean', section: '商务服务' },
        
        // 无障碍设施服务
        { key: 'accessible_passage', label: '无障碍通道', value: false, required: false, type: 'boolean', section: '无障碍设施服务' },
        { key: 'accessible_stair_rail', label: '楼梯扶手', value: false, required: false, type: 'boolean', section: '无障碍设施服务' },
        { key: 'accessible_room', label: '无障碍客房', value: false, required: false, type: 'boolean', section: '无障碍设施服务' },
        { key: 'accessible_corridor_rail', label: '走廊扶手', value: false, required: false, type: 'boolean', section: '无障碍设施服务' },
        { key: 'accessible_wheelchair', label: '提供轮椅', value: false, required: false, type: 'boolean', section: '无障碍设施服务' },
        { key: 'accessible_pool_ramp', label: '提供泳池坡道', value: false, required: false, placeholder: '有泳池的请填写具体信息', type: 'boolean-with-text', section: '无障碍设施服务', additionalNote: '' },
        
        // 娱乐设施
        { key: 'entertainment_pool', label: '泳池', value: false, required: false, type: 'boolean', section: '娱乐设施', subsection: '泳池' },
        { key: 'entertainment_pool_type', label: '类型', value: '', required: false, placeholder: '例如：室内/室外/恒温/无边际', type: 'text', section: '娱乐设施', subsection: '泳池' },
        { key: 'entertainment_pool_fee', label: '收费情况', value: '', required: false, placeholder: '例如：免费/收费/会员免费', type: 'text', section: '娱乐设施', subsection: '泳池' },
        { key: 'entertainment_pool_hours', label: '开放时间', value: '', required: false, placeholder: '例如：6:00-22:00', type: 'text', section: '娱乐设施', subsection: '泳池' },
        { key: 'entertainment_pool_note', label: '说明', value: '', required: false, placeholder: '位置、特色、使用规则等', type: 'textarea', section: '娱乐设施', subsection: '泳池' },
        
        { key: 'entertainment_mahjong', label: '棋牌室', value: false, required: false, type: 'boolean', section: '娱乐设施', subsection: '棋牌室' },
        { key: 'entertainment_mahjong_fee', label: '收费情况', value: '', required: false, placeholder: '例如：按小时收费100元', type: 'text', section: '娱乐设施', subsection: '棋牌室' },
        { key: 'entertainment_mahjong_hours', label: '开放时间', value: '', required: false, placeholder: '例如：全天', type: 'text', section: '娱乐设施', subsection: '棋牌室' },
        
        { key: 'entertainment_game', label: '游戏室', value: false, required: false, type: 'boolean', section: '娱乐设施', subsection: '游戏室' },
        { key: 'entertainment_game_fee', label: '收费情况', value: '', required: false, placeholder: '免费/收费', type: 'text', section: '娱乐设施', subsection: '游戏室' },
        
        { key: 'entertainment_cinema', label: '观影房', value: false, required: false, type: 'boolean', section: '娱乐设施', subsection: '观影房' },
        { key: 'entertainment_cinema_fee', label: '收费情况', value: '', required: false, placeholder: '需预约/收费标准', type: 'text', section: '娱乐设施', subsection: '观影房' },
        
        // 交通服务
        { key: 'transport_airport', label: '专车接机', value: false, required: false, placeholder: '收费信息，如：200元/次', type: 'boolean-with-text', section: '交通服务', additionalNote: '' },
        { key: 'transport_parking', label: '私人停车场', value: false, required: false, placeholder: '收费信息，如：50元/天', type: 'boolean-with-text', section: '交通服务', additionalNote: '' },
        { key: 'transport_shuttle', label: '班车服务', value: false, required: false, placeholder: '收费信息及时间', type: 'boolean-with-text', section: '交通服务', additionalNote: '' },
        { key: 'transport_station', label: '接站服务', value: false, required: false, placeholder: '收费信息', type: 'boolean-with-text', section: '交通服务', additionalNote: '' },
        { key: 'transport_taxi', label: '叫车服务', value: false, required: false, type: 'boolean', section: '交通服务' },
        { key: 'transport_rental', label: '租车服务', value: false, required: false, type: 'boolean', section: '交通服务' },
        
        // 亲子设施
        { key: 'kids_care', label: '儿童托管', value: false, required: false, placeholder: '收费标准', type: 'boolean-with-text', section: '亲子设施', additionalNote: '' },
        { key: 'kids_club', label: '儿童俱乐部', value: false, required: false, type: 'boolean', section: '亲子设施' },
        { key: 'kids_pool', label: '儿童泳池', value: false, required: false, type: 'boolean', section: '亲子设施' },
        { key: 'kids_meal', label: '儿童餐', value: false, required: false, type: 'boolean', section: '亲子设施' },
        { key: 'kids_playground', label: '儿童乐园', value: false, required: false, type: 'boolean', section: '亲子设施' },
        { key: 'kids_books', label: '儿童书籍/影视', value: false, required: false, type: 'boolean', section: '亲子设施' },
        { key: 'kids_toys', label: '儿童玩具', value: false, required: false, type: 'boolean', section: '亲子设施' },
        { key: 'kids_stroller', label: '婴儿推车', value: false, required: false, type: 'boolean', section: '亲子设施' },
        { key: 'kids_toothbrush', label: '儿童牙刷', value: false, required: false, type: 'boolean', section: '亲子设施' },
        { key: 'kids_slippers', label: '儿童拖鞋', value: false, required: false, type: 'boolean', section: '亲子设施' },
        
        // 康体设施
        { key: 'wellness_spa', label: 'Spa', value: false, required: false, type: 'boolean', section: '康体设施', subsection: 'Spa' },
        { key: 'wellness_spa_fee', label: '收费情况', value: '', required: false, placeholder: '按项目收费/套餐价格', type: 'text', section: '康体设施', subsection: 'Spa' },
        { key: 'wellness_spa_hours', label: '营业时间', value: '', required: false, placeholder: '例如：10:00-22:00', type: 'text', section: '康体设施', subsection: 'Spa' },
        { key: 'wellness_spa_note', label: '说明', value: '', required: false, placeholder: '预约方式、特色项目等', type: 'textarea', section: '康体设施', subsection: 'Spa' },
        
        { key: 'wellness_massage', label: '按摩室', value: false, required: false, type: 'boolean', section: '康体设施', subsection: '按摩室' },
        { key: 'wellness_massage_fee', label: '收费情况', value: '', required: false, placeholder: '按时长收费', type: 'text', section: '康体设施', subsection: '按摩室' },
        
        { key: 'wellness_sauna', label: '桑拿', value: false, required: false, type: 'boolean', section: '康体设施', subsection: '桑拿' },
        { key: 'wellness_sauna_fee', label: '收费情况', value: '', required: false, placeholder: '免费/收费', type: 'text', section: '康体设施', subsection: '桑拿' },
        { key: 'wellness_sauna_hours', label: '开放时间', value: '', required: false, placeholder: '例如：全天', type: 'text', section: '康体设施', subsection: '桑拿' },
        
        { key: 'wellness_sunbath', label: '日光浴场', value: false, required: false, type: 'boolean', section: '康体设施', subsection: '其他' },
        { key: 'wellness_bath', label: '公共浴池', value: false, required: false, type: 'boolean', section: '康体设施', subsection: '其他' },
        { key: 'wellness_nail', label: '美甲', value: false, required: false, type: 'boolean', section: '康体设施', subsection: '其他' },
        
        // 餐饮服务
        { key: 'dining_restaurant', label: '餐厅', value: false, required: false, type: 'boolean', section: '餐饮服务', subsection: '餐厅' },
        { key: 'dining_restaurant_name', label: '餐厅名称', value: '', required: false, placeholder: '例如：海悦中餐厅', type: 'text', section: '餐饮服务', subsection: '餐厅' },
        { key: 'dining_restaurant_cuisine', label: '菜系', value: '', required: false, placeholder: '例如：中餐/西餐/日料', type: 'text', section: '餐饮服务', subsection: '餐厅' },
        { key: 'dining_restaurant_hours', label: '营业时间', value: '', required: false, placeholder: '例如：早餐7:00-10:00，午餐11:30-14:00', type: 'text', section: '餐饮服务', subsection: '餐厅' },
        { key: 'dining_restaurant_note', label: '说明', value: '', required: false, placeholder: '特色菜品、预约方式等', type: 'textarea', section: '餐饮服务', subsection: '餐厅' },
        
        { key: 'dining_bar', label: '酒吧', value: false, required: false, type: 'boolean', section: '餐饮服务', subsection: '酒吧' },
        { key: 'dining_bar_hours', label: '营业时间', value: '', required: false, placeholder: '例如：18:00-2:00', type: 'text', section: '餐饮服务', subsection: '酒吧' },
        { key: 'dining_bar_note', label: '说明', value: '', required: false, placeholder: '特色酒品、氛围等', type: 'textarea', section: '餐饮服务', subsection: '酒吧' },
        
        { key: 'dining_cafe', label: '咖啡厅', value: false, required: false, type: 'boolean', section: '餐饮服务', subsection: '咖啡厅' },
        { key: 'dining_cafe_hours', label: '营业时间', value: '', required: false, placeholder: '例如：8:00-20:00', type: 'text', section: '餐饮服务', subsection: '咖啡厅' },
        
        { key: 'dining_lobby_bar', label: '大堂吧', value: false, required: false, type: 'boolean', section: '餐饮服务', subsection: '其他' },
        { key: 'dining_room_service', label: '送餐服务', value: false, required: false, type: 'boolean', section: '餐饮服务', subsection: '其他' },
        { key: 'dining_snack', label: '小吃吧', value: false, required: false, type: 'boolean', section: '餐饮服务', subsection: '其他' },
        { key: 'dining_shop', label: '便利店/售货亭', value: false, required: false, type: 'boolean', section: '餐饮服务', subsection: '其他' },
        
        // 运动设施
        { key: 'sports_gym', label: '健身室', value: false, required: false, type: 'boolean', section: '运动设施', subsection: '健身室' },
        { key: 'sports_gym_fee', label: '收费情况', value: '', required: false, placeholder: '免费/收费', type: 'text', section: '运动设施', subsection: '健身室' },
        { key: 'sports_gym_hours', label: '开放时间', value: '', required: false, placeholder: '例如：6:00-23:00', type: 'text', section: '运动设施', subsection: '健身室' },
        { key: 'sports_gym_note', label: '说明', value: '', required: false, placeholder: '设备情况、是否有教练等', type: 'textarea', section: '运动设施', subsection: '健身室' },
        
        { key: 'sports_yoga', label: '瑜伽课程', value: false, required: false, type: 'boolean', section: '运动设施', subsection: '瑜伽课程' },
        { key: 'sports_yoga_fee', label: '收费情况', value: '', required: false, placeholder: '免费/按次收费', type: 'text', section: '运动设施', subsection: '瑜伽课程' },
        { key: 'sports_yoga_schedule', label: '课程时间', value: '', required: false, placeholder: '例如：每天8:00-9:00', type: 'text', section: '运动设施', subsection: '瑜伽课程' },
        
        { key: 'sports_fitness_class', label: '健身课程', value: false, required: false, type: 'boolean', section: '运动设施', subsection: '其他' },
        { key: 'sports_billiards', label: '桌球室', value: false, required: false, type: 'boolean', section: '运动设施', subsection: '其他' },
        { key: 'sports_pingpong', label: '乒乓球室', value: false, required: false, type: 'boolean', section: '运动设施', subsection: '其他' },
        
        // 清洁服务
        { key: 'cleaning_dry', label: '干洗服务', value: false, required: false, type: 'boolean', section: '清洁服务' },
        { key: 'cleaning_laundry_room', label: '洗衣房', value: false, required: false, type: 'boolean', section: '清洁服务' },
        { key: 'cleaning_laundry', label: '洗衣服务', value: false, required: false, type: 'boolean', section: '清洁服务' },
        { key: 'cleaning_delivery', label: '外送洗衣服务', value: false, required: false, type: 'boolean', section: '清洁服务' },
        { key: 'cleaning_iron', label: '熨衣服务', value: false, required: false, type: 'boolean', section: '清洁服务' },
        
        // 安全与安保
        { key: 'security_cctv', label: '公共区域监控', value: false, required: false, type: 'boolean', section: '安全与安保' },
        { key: 'security_first_aid', label: '急救包', value: false, required: false, type: 'boolean', section: '安全与安保' },
        { key: 'security_fire_alarm', label: '火灾报警器', value: false, required: false, type: 'boolean', section: '安全与安保' },
        { key: 'security_access', label: '门禁系统', value: false, required: false, type: 'boolean', section: '安全与安保' },
        { key: 'security_extinguisher', label: '灭火器', value: false, required: false, type: 'boolean', section: '安全与安保' },
        { key: 'security_personnel', label: '安保人员', value: false, required: false, type: 'boolean', section: '安全与安保' },
        { key: 'security_smoke_alarm', label: '烟雾报警器', value: false, required: false, type: 'boolean', section: '安全与安保' },
        { key: 'security_safety_alarm', label: '安全报警器', value: false, required: false, type: 'boolean', section: '安全与安保' },
      ];
    case '政策信息':
      return [
        // 入离时间
        { key: 'checkinTime', label: '入住时间', value: '', required: true, placeholder: '例如：14:00', type: 'text', section: '入离时间' },
        { key: 'checkoutTime', label: '退房时间', value: '', required: true, placeholder: '例如：12:00', type: 'text', section: '入离时间' },
        
        // 预订提示
        { key: 'bookingNote', label: '预订提示', value: '', required: false, placeholder: '请填写预订相关提示信息', type: 'textarea', section: '预订提示' },
        
        // 入住提示
        { key: 'checkinNote', label: '入住提示', value: '', required: false, placeholder: '请填写入住相关提示信息', type: 'textarea', section: '入住提示' },
        { key: 'checkinMethod', label: '入住方式', value: '', required: false, placeholder: '例如：前台办理、自助入住机', type: 'text', section: '入住提示' },
        
        // 年龄限制
        { key: 'ageRestriction', label: '年龄限制', value: '', required: false, placeholder: '例如：18周岁以上可单独入住', type: 'text', section: '年龄限制' },
        
        // 宠物
        { key: 'petPolicy', label: '宠物政策', value: '', required: false, placeholder: '例如：允许携带宠物，需额外收费', type: 'text', section: '宠物' },
        
        // 服务型动物
        { key: 'serviceAnimal', label: '服务型动物', value: '', required: false, placeholder: '例如：允许携带服务型动物', type: 'text', section: '服务型动物' },
        
        // 支付方式
        { key: 'payment_unionpay', label: 'UnionPay银联', value: false, required: false, type: 'boolean', section: '支付方式' },
        { key: 'payment_wechat', label: '微信支付', value: false, required: false, type: 'boolean', section: '支付方式' },
        { key: 'payment_alipay', label: '支付宝', value: false, required: false, type: 'boolean', section: '支付方式' },
        { key: 'payment_mastercard', label: 'Mastercard', value: false, required: false, type: 'boolean', section: '支付方式' },
        { key: 'payment_visa', label: 'Visa', value: false, required: false, type: 'boolean', section: '支付方式' },
        { key: 'payment_amex', label: 'American Express', value: false, required: false, type: 'boolean', section: '支付方式' },
        { key: 'payment_diners', label: 'Diners Club International', value: false, required: false, type: 'boolean', section: '支付方式' },
        { key: 'payment_jcb', label: 'JCB', value: false, required: false, type: 'boolean', section: '支付方式' },
        
        // 早餐
        { key: 'breakfast_type', label: '早餐类型', value: '', required: false, placeholder: '例如：自助餐', type: 'text', section: '早餐' },
        { key: 'breakfast_cuisine', label: '早餐菜品', value: '', required: false, placeholder: '例如：西式、中式、美式、亚洲菜、欧陆菜', type: 'text', section: '早餐' },
        { key: 'breakfast_hours', label: '早餐营业时间', value: '', required: false, placeholder: '例如：7:00-10:00', type: 'text', section: '早餐' },
        { key: 'breakfast_adult_fee', label: '成人加早费用', value: '', required: false, placeholder: '例如：80元/人', type: 'text', section: '早餐' },
        
        // 儿童入住及加床政策
        { key: 'childStayPolicy', label: '儿童入住政策', value: '', required: false, placeholder: '例如：0-6岁可免费入住，无需加床', type: 'textarea', section: '儿童入住及加床政策' },
        { key: 'extraBedPolicy', label: '加床政策', value: '', required: false, placeholder: '请说明可加床人群、收费标准等', type: 'textarea', section: '儿童入住及加床政策' },
        { key: 'childBreakfastPolicy', label: '儿童早餐政策', value: '', required: false, placeholder: '例如：身高1.2米以下免费，1.2-1.4米半价', type: 'text', section: '儿童入住及加床政策' },
      ];
    case '周边POI':
      return [
        { key: 'poiTraffic', label: '交通出行', value: [], required: false, type: 'poi-list', section: '交通' },
        { key: 'poiAttractions', label: '城市景点', value: [], required: false, type: 'poi-list', section: '景点' },
        { key: 'poiFood', label: '餐饮美食', value: [], required: false, type: 'poi-list', section: '美食' },
        { key: 'poiShopping', label: '购物商圈', value: [], required: false, type: 'poi-list', section: '购物' },
      ];

    case '自定义类别':
      return [
        { key: 'customTitle', label: '标题', value: '', required: true, placeholder: '请输入标题', type: 'text', section: '基本信息' },
        { key: 'customType', label: '类型', value: '', required: false, placeholder: '例如：营销服务、旅行套餐、特色设施、特色活动等', type: 'text', section: '基本信息' },
        { key: 'customContent', label: '内容', value: '', required: true, placeholder: '请输入详细内容', type: 'textarea', section: '基本信息' },
        { key: 'customNote', label: '备注', value: '', required: false, placeholder: '补充说明', type: 'textarea', section: '基本信息' },
      ];
    default:
      return [];
  }
};

const initialDocuments: Document[] = [
  {
    id: '1',
    title: '酒店基本介绍',
    fields: [
      // 酒店基本信息
      { key: 'hotelNameCn', label: '酒店中文名称', value: '市中心豪华酒店', required: true, type: 'text', section: '酒店基本信息' },
      { key: 'hotelNameEn', label: '酒店英文名称', value: 'Downtown Luxury Hotel', required: false, type: 'text', section: '酒店基本信息' },
      { key: 'addressCn', label: '酒店中文地址', value: '北京市朝阳区建国门外大街1号', required: true, type: 'textarea', section: '酒店基本信息' },
      { key: 'addressEn', label: '酒店英文地址', value: '', required: false, type: 'textarea', section: '酒店基本信息' },
      { key: 'description', label: '酒店介绍', value: '', required: true, type: 'textarea', section: '酒店基本信息' },
      { key: 'country', label: '国家', value: '中国', required: true, type: 'text', section: '酒店基本信息' },
      { key: 'city', label: '城市', value: '北京', required: true, type: 'text', section: '酒店基本信息' },
      { key: 'specificAddress', label: '具体地址', value: '', required: true, type: 'text', section: '酒店基本信息' },
      
      // 联系方式
      { key: 'phone', label: '联系电话', value: '', required: true, type: 'text', section: '联系方式' },
      { key: 'email', label: '邮箱', value: '', required: false, type: 'text', section: '联系方式' },
      { key: 'postalCode', label: '邮政编码', value: '', required: false, type: 'text', section: '联系方式' },
      
      // 酒店基本设施
      { key: 'starRating', label: '酒店星级', value: '五星级', required: true, type: 'text', section: '酒店基本设施' },
      { key: 'brandName', label: '品牌名称', value: '', required: false, type: 'text', section: '酒店基本设施' },
      { key: 'roomCount', label: '客房数', value: '', required: true, type: 'text', section: '酒店基本设施' },
      
      // 开业和装修
      { key: 'openingYear', label: '开业年份', value: '', required: false, type: 'text', section: '开业和装修' },
      { key: 'renovationYear', label: '装修年份', value: '', required: false, type: 'text', section: '开业和装修' },
      
      // 交通信息
      { key: 'subway', label: '地铁', value: '', required: false, type: 'textarea', section: '交通信息' },
      { key: 'airport', label: '机场', value: '', required: false, type: 'textarea', section: '交通信息' },
      { key: 'publicTransport', label: '公共线路', value: '', required: false, type: 'textarea', section: '交通信息' },
      { key: 'driving', label: '自驾', value: '', required: false, type: 'textarea', section: '交通信息' },
    ],
    category: '酒店基础信息',
    status: 'pending',
    source: 'OTA平台',
    lastModified: new Date('2024-01-15'),
    completeness: 45
  },
  {
    id: '2',
    title: '标准大床房',
    fields: [
      // 房型名称
      { key: 'roomTypeName', label: '房型名称', value: '标准大床房', required: true, type: 'text', section: '房型名称' },
      
      // 基础信息
      { key: 'roomArea', label: '客房面积', value: '28㎡', required: true, type: 'text', section: '基础信息' },
      { key: 'bedType', label: '床型', value: '1张1.8米大床', required: true, type: 'text', section: '基础信息' },
      { key: 'floor', label: '楼层', value: '', required: false, type: 'text', section: '基础信息' },
      { key: 'nonSmoking', label: '是否禁烟', value: '', required: false, type: 'text', section: '基础信息' },
      { key: 'capacity', label: '容纳人数', value: '', required: true, type: 'text', section: '基础信息' },
      { key: 'view', label: '景观', value: '', required: false, type: 'text', section: '基础信息' },
      { key: 'hasWindow', label: '是否有窗', value: '', required: false, type: 'text', section: '基础信息' },
      
      // 浴室信息 - 洗浴用品
      { key: 'amenity_toothbrush', label: '牙刷', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_toothpaste', label: '牙膏', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_shower_gel', label: '沐浴露', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_shampoo', label: '洗发水', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_conditioner', label: '护发素', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_soap', label: '香皂', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_shower_cap', label: '浴帽', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_bath_towel', label: '浴巾', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_comb', label: '梳子', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_razor', label: '剃须刀', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_towel', label: '毛巾', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_bathrobe', label: '浴袍', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_cotton_pads', label: '化妆棉', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_cotton_swabs', label: '棉签', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      
      // 浴室信息 - 卫浴设施
      { key: 'bathroom_bathtub', label: '浴缸', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      { key: 'bathroom_shower', label: '淋浴', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      { key: 'bathroom_toilet', label: '卫生间', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      { key: 'bathroom_hairdryer', label: '吹风机', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      { key: 'bathroom_mirror', label: '化妆镜', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      { key: 'bathroom_hot_water', label: '24小时热水', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      { key: 'bathroom_slippers', label: '拖鞋', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      { key: 'bathroom_toilet_paper', label: '卫生纸', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      { key: 'bathroom_anti_slip_mat', label: '浴室防滑垫', value: false, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      
      // 网络与通讯
      { key: 'network_wifi', label: '客房WIFI', value: true, required: false, type: 'boolean', section: '网络与通讯' },
      { key: 'network_wired', label: '有线上网', value: false, required: false, type: 'boolean', section: '网络与通讯' },
      { key: 'network_phone', label: '客房电话', value: true, required: false, type: 'boolean', section: '网络与通讯' },
      { key: 'network_intl_phone', label: '国际长途电话', value: false, required: false, type: 'boolean', section: '网络与通讯' },
      
      // 客房布局和家具
      { key: 'furniture_desk', label: '书桌', value: true, required: false, type: 'boolean', section: '客房布局和家具' },
      { key: 'furniture_sofa', label: '沙发', value: false, required: false, type: 'boolean', section: '客房布局和家具' },
      { key: 'furniture_wardrobe', label: '衣柜/衣橱', value: true, required: false, type: 'boolean', section: '客房布局和家具' },
      { key: 'furniture_chair', label: '休闲椅', value: true, required: false, type: 'boolean', section: '客房布局和家具' },
      { key: 'furniture_balcony', label: '阳台', value: false, required: false, type: 'boolean', section: '客房布局和家具' },
      
      // 客房设施
      { key: 'facility_ac', label: '空调', value: true, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_fridge', label: '冰箱', value: true, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_washer', label: '洗衣机', value: false, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_microwave', label: '微波炉', value: false, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_heater', label: '暖气', value: true, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_blackout_curtain', label: '遮光窗帘', value: true, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_air_purifier', label: '空气净化器', value: false, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_alarm_clock', label: '闹钟', value: true, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_iron', label: '熨衣设备', value: false, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_soundproof', label: '隔音门窗', value: true, required: false, type: 'boolean', section: '客房设施' },
      
      // 媒体科技
      { key: 'media_tv', label: '液晶电视机', value: true, required: false, type: 'boolean', section: '媒体科技' },
      { key: 'media_projector', label: '投影仪', value: false, required: false, type: 'boolean', section: '媒体科技' },
      { key: 'media_smart_lock', label: '智能门锁', value: true, required: false, type: 'boolean', section: '媒体科技' },
      { key: 'media_smart_control', label: '智能客控', value: false, required: false, type: 'boolean', section: '媒体科技' },
      
      // 食品饮品
      { key: 'food_kettle', label: '电热水壶', value: true, required: false, type: 'boolean', section: '食品饮品' },
      { key: 'food_water', label: '瓶装水', value: true, required: false, type: 'boolean', section: '食品饮品' },
      { key: 'food_coffee_pot', label: '咖啡壶/茶壶', value: false, required: false, type: 'boolean', section: '食品饮品' },
      { key: 'food_tea', label: '茶包', value: true, required: false, type: 'boolean', section: '食品饮品' },
      
      // 便民服务
      { key: 'service_safe', label: '房内保险箱', value: true, required: false, type: 'boolean', section: '便民服务' },
      { key: 'service_sewing_kit', label: '针线包', value: false, required: false, type: 'boolean', section: '便民服务' },
      { key: 'service_power_outlets', label: '多种规格电源插座', value: true, required: false, type: 'boolean', section: '便民服务' },
      { key: 'service_umbrella', label: '雨伞', value: false, required: false, type: 'boolean', section: '便民服务' },
      { key: 'service_lounge', label: '行政酒廊待遇', value: false, required: false, type: 'boolean', section: '便民服务' },
      { key: 'service_wake_up', label: '唤醒服务', value: true, required: false, type: 'boolean', section: '便民服务' },
    ],
    category: '房型信息',
    status: 'pending',
    source: '携程',
    lastModified: new Date('2024-01-16'),
    completeness: 70
  },
  {
    id: '3',
    title: '豪华海景套房',
    fields: [
      // 房型名称
      { key: 'roomTypeName', label: '房型名称', value: '豪华海景套房', required: true, type: 'text', section: '房型名称' },
      
      // 基础信息
      { key: 'roomArea', label: '客房面积', value: '60㎡', required: true, type: 'text', section: '基础信息' },
      { key: 'bedType', label: '床型', value: '1张2米大床', required: true, type: 'text', section: '基础信息' },
      { key: 'floor', label: '楼层', value: '15-20层', required: false, type: 'text', section: '基础信息' },
      { key: 'nonSmoking', label: '是否禁烟', value: '禁烟', required: false, type: 'text', section: '基础信息' },
      { key: 'capacity', label: '容纳人数', value: '2人入住', required: true, type: 'text', section: '基础信息' },
      { key: 'view', label: '景观', value: '海景房', required: false, type: 'text', section: '基础信息' },
      { key: 'hasWindow', label: '是否有窗', value: '有窗', required: false, type: 'text', section: '基础信息' },
      
      // 浴室信息 - 洗浴用品
      { key: 'amenity_toothbrush', label: '牙刷', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_toothpaste', label: '牙膏', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_shower_gel', label: '沐浴露', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_shampoo', label: '洗发水', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_conditioner', label: '护发素', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_soap', label: '香皂', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_shower_cap', label: '浴帽', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_bath_towel', label: '浴巾', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_comb', label: '梳子', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_razor', label: '剃须刀', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_towel', label: '毛巾', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_bathrobe', label: '浴袍', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_cotton_pads', label: '化妆棉', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      { key: 'amenity_cotton_swabs', label: '棉签', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '洗浴用品' },
      
      // 浴室信息 - 卫浴设施
      { key: 'bathroom_bathtub', label: '浴缸', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      { key: 'bathroom_shower', label: '淋浴', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      { key: 'bathroom_toilet', label: '卫生间', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      { key: 'bathroom_hairdryer', label: '吹风机', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      { key: 'bathroom_mirror', label: '化妆镜', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      { key: 'bathroom_hot_water', label: '24小时热水', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      { key: 'bathroom_slippers', label: '拖鞋', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      { key: 'bathroom_toilet_paper', label: '卫生纸', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      { key: 'bathroom_anti_slip_mat', label: '浴室防滑垫', value: true, required: false, type: 'boolean', section: '浴室信息', subsection: '卫浴设施' },
      
      // 网络与通讯
      { key: 'network_wifi', label: '客房WIFI', value: true, required: false, type: 'boolean', section: '网络与通讯' },
      { key: 'network_wired', label: '有线上网', value: true, required: false, type: 'boolean', section: '网络与通讯' },
      { key: 'network_phone', label: '客房电话', value: true, required: false, type: 'boolean', section: '网络与通讯' },
      { key: 'network_intl_phone', label: '国际长途电话', value: true, required: false, type: 'boolean', section: '网络与通讯' },
      
      // 客房布局和家具
      { key: 'furniture_desk', label: '书桌', value: true, required: false, type: 'boolean', section: '客房布局和家具' },
      { key: 'furniture_sofa', label: '沙发', value: true, required: false, type: 'boolean', section: '客房布局和家具' },
      { key: 'furniture_wardrobe', label: '衣柜/衣橱', value: true, required: false, type: 'boolean', section: '客房布局和家具' },
      { key: 'furniture_chair', label: '休闲椅', value: true, required: false, type: 'boolean', section: '客房布局和家具' },
      { key: 'furniture_balcony', label: '阳台', value: true, required: false, type: 'boolean', section: '客房布局和家具' },
      
      // 客房设施
      { key: 'facility_ac', label: '空调', value: true, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_fridge', label: '冰箱', value: true, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_washer', label: '洗衣机', value: false, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_microwave', label: '微波炉', value: true, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_heater', label: '暖气', value: true, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_blackout_curtain', label: '遮光窗帘', value: true, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_air_purifier', label: '空气净化器', value: true, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_alarm_clock', label: '闹钟', value: true, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_iron', label: '熨衣设备', value: true, required: false, type: 'boolean', section: '客房设施' },
      { key: 'facility_soundproof', label: '隔音门窗', value: true, required: false, type: 'boolean', section: '客房设施' },
      
      // 媒体科技
      { key: 'media_tv', label: '液晶电视机', value: true, required: false, type: 'boolean', section: '媒体科技' },
      { key: 'media_projector', label: '投影仪', value: true, required: false, type: 'boolean', section: '媒体科技' },
      { key: 'media_smart_lock', label: '智能门锁', value: true, required: false, type: 'boolean', section: '媒体科技' },
      { key: 'media_smart_control', label: '智能客控', value: true, required: false, type: 'boolean', section: '媒体科技' },
      
      // 食品饮品
      { key: 'food_kettle', label: '电热水壶', value: true, required: false, type: 'boolean', section: '���品饮品' },
      { key: 'food_water', label: '瓶装水', value: true, required: false, type: 'boolean', section: '食品饮品' },
      { key: 'food_coffee_pot', label: '咖啡壶/茶壶', value: true, required: false, type: 'boolean', section: '食品饮品' },
      { key: 'food_tea', label: '茶包', value: true, required: false, type: 'boolean', section: '食品饮品' },
      
      // 便民服务
      { key: 'service_safe', label: '房内保险箱', value: true, required: false, type: 'boolean', section: '便民服务' },
      { key: 'service_sewing_kit', label: '针线包', value: true, required: false, type: 'boolean', section: '便民服务' },
      { key: 'service_power_outlets', label: '多种规格电源插座', value: true, required: false, type: 'boolean', section: '便民服务' },
      { key: 'service_umbrella', label: '雨伞', value: true, required: false, type: 'boolean', section: '便民服务' },
      { key: 'service_lounge', label: '行政酒廊待遇', value: true, required: false, type: 'boolean', section: '便民服务' },
      { key: 'service_wake_up', label: '唤醒服务', value: true, required: false, type: 'boolean', section: '便民服务' },
    ],
    category: '房型信息',
    status: 'confirmed',
    source: '官网',
    lastModified: new Date('2024-01-10'),
    completeness: 100
  },
  {
    id: '4',
    title: '酒店综合设施',
    fields: getFieldsTemplate('设施信息').map(field => {
      // 设置一些示例值
      if (field.key === 'facilityName') return { ...field, value: '酒店综合设施' };
      if (field.key === 'frontdesk_multilingual') return { ...field, value: '中文、英语、日语' };
      if (field.key === 'frontdesk_luggage') return { ...field, value: true };
      if (field.key === 'frontdesk_24h') return { ...field, value: true };
      if (field.key === 'frontdesk_porter') return { ...field, value: true };
      if (field.key === 'frontdesk_locker') return { ...field, value: true };
      if (field.key === 'frontdesk_concierge') return { ...field, value: true };
      if (field.key === 'frontdesk_eid') return { ...field, value: true };
      if (field.key === 'frontdesk_safe') return { ...field, value: true };
      if (field.key === 'frontdesk_wakeup') return { ...field, value: true };
      if (field.key === 'public_chinese_sign') return { ...field, value: true };
      if (field.key === 'public_atm') return { ...field, value: true };
      if (field.key === 'public_wifi') return { ...field, value: true };
      if (field.key === 'public_elevator') return { ...field, value: true };
      if (field.key === 'public_garden') return { ...field, value: true };
      if (field.key === 'public_ventilation') return { ...field, value: true };
      if (field.key === 'public_nonsmoking_floor') return { ...field, value: true };
      if (field.key === 'public_nosmoking') return { ...field, value: true };
      if (field.key === 'business_multifunction') return { ...field, value: true };
      if (field.key === 'business_service') return { ...field, value: true };
      if (field.key === 'business_fax') return { ...field, value: true };
      if (field.key === 'business_meeting') return { ...field, value: true };
      if (field.key === 'business_express') return { ...field, value: true };
      if (field.key === 'business_multimedia') return { ...field, value: true };
      if (field.key === 'accessible_passage') return { ...field, value: true };
      if (field.key === 'accessible_stair_rail') return { ...field, value: true };
      if (field.key === 'accessible_room') return { ...field, value: true };
      if (field.key === 'accessible_corridor_rail') return { ...field, value: true };
      if (field.key === 'accessible_wheelchair') return { ...field, value: true };
      if (field.key === 'accessible_pool_ramp') return { ...field, value: '室内泳池配备坡道' };
      if (field.key === 'entertainment_pool') return { ...field, value: true };
      if (field.key === 'entertainment_pool_type') return { ...field, value: '室内恒温无边际泳池' };
      if (field.key === 'entertainment_pool_fee') return { ...field, value: '住店客人免费' };
      if (field.key === 'entertainment_pool_hours') return { ...field, value: '6:00-22:00' };
      if (field.key === 'entertainment_pool_note') return { ...field, value: '位于25楼，可俯瞰CBD全景。配备专业救生员，提供浴巾和休闲躺椅。' };
      if (field.key === 'entertainment_mahjong') return { ...field, value: true };
      if (field.key === 'entertainment_mahjong_fee') return { ...field, value: '100元/小时' };
      if (field.key === 'entertainment_mahjong_hours') return { ...field, value: '全天开放，需提前预约' };
      if (field.key === 'entertainment_game') return { ...field, value: true };
      if (field.key === 'entertainment_game_fee') return { ...field, value: '免费' };
      if (field.key === 'transport_airport') return { ...field, value: '提供收费接机服务，200元/次' };
      if (field.key === 'transport_parking') return { ...field, value: '免费提供地下停车场' };
      if (field.key === 'transport_shuttle') return { ...field, value: '免费提供往返市中心班车' };
      if (field.key === 'transport_taxi') return { ...field, value: true };
      if (field.key === 'kids_care') return { ...field, value: '提供收费托管，100元/小时' };
      if (field.key === 'kids_club') return { ...field, value: true };
      if (field.key === 'kids_pool') return { ...field, value: true };
      if (field.key === 'kids_meal') return { ...field, value: true };
      if (field.key === 'kids_playground') return { ...field, value: true };
      if (field.key === 'kids_books') return { ...field, value: true };
      if (field.key === 'kids_toys') return { ...field, value: true };
      if (field.key === 'kids_stroller') return { ...field, value: true };
      if (field.key === 'kids_toothbrush') return { ...field, value: true };
      if (field.key === 'kids_slippers') return { ...field, value: true };
      if (field.key === 'wellness_spa') return { ...field, value: true };
      if (field.key === 'wellness_spa_fee') return { ...field, value: '按项目收费，套餐588元起' };
      if (field.key === 'wellness_spa_hours') return { ...field, value: '10:00-22:00' };
      if (field.key === 'wellness_spa_note') return { ...field, value: '提供泰式按摩、精油SPA等多种项目，需提前预约。专业理疗师服务。' };
      if (field.key === 'wellness_massage') return { ...field, value: true };
      if (field.key === 'wellness_massage_fee') return { ...field, value: '288元/小时' };
      if (field.key === 'wellness_sauna') return { ...field, value: true };
      if (field.key === 'wellness_sauna_fee') return { ...field, value: '免费' };
      if (field.key === 'wellness_sauna_hours') return { ...field, value: '全天开放' };
      if (field.key === 'wellness_nail') return { ...field, value: true };
      if (field.key === 'dining_restaurant') return { ...field, value: true };
      if (field.key === 'dining_restaurant_name') return { ...field, value: '全日餐厅、海悦中餐厅、樱花日本料理' };
      if (field.key === 'dining_restaurant_cuisine') return { ...field, value: '中餐、西餐、日料' };
      if (field.key === 'dining_restaurant_hours') return { ...field, value: '早餐7:00-10:00，午餐11:30-14:00，晚餐17:30-21:30' };
      if (field.key === 'dining_restaurant_note') return { ...field, value: '中餐厅主打粤菜和本帮菜，日料餐厅提供寿司、刺身等正宗日式料理' };
      if (field.key === 'dining_bar') return { ...field, value: true };
      if (field.key === 'dining_bar_hours') return { ...field, value: '18:00-2:00' };
      if (field.key === 'dining_bar_note') return { ...field, value: '屋顶酒吧，每周五晚现场乐队演出' };
      if (field.key === 'dining_cafe') return { ...field, value: true };
      if (field.key === 'dining_cafe_hours') return { ...field, value: '8:00-20:00' };
      if (field.key === 'dining_lobby_bar') return { ...field, value: true };
      if (field.key === 'dining_room_service') return { ...field, value: true };
      if (field.key === 'dining_shop') return { ...field, value: true };
      if (field.key === 'sports_gym') return { ...field, value: true };
      if (field.key === 'sports_gym_fee') return { ...field, value: '住店客人免费' };
      if (field.key === 'sports_gym_hours') return { ...field, value: '6:00-23:00' };
      if (field.key === 'sports_gym_note') return { ...field, value: '配备跑步机、椭圆机、力量训练器械等专业设备，提供专业健身教练指导服务（需预约）' };
      if (field.key === 'sports_yoga') return { ...field, value: true };
      if (field.key === 'sports_yoga_fee') return { ...field, value: '住店客人免费' };
      if (field.key === 'sports_yoga_schedule') return { ...field, value: '每天8:00-9:00，需提前预约' };
      if (field.key === 'sports_fitness_class') return { ...field, value: true };
      if (field.key === 'sports_billiards') return { ...field, value: true };
      if (field.key === 'sports_pingpong') return { ...field, value: true };
      if (field.key === 'cleaning_dry') return { ...field, value: true };
      if (field.key === 'cleaning_laundry') return { ...field, value: true };
      if (field.key === 'cleaning_iron') return { ...field, value: true };
      if (field.key === 'security_cctv') return { ...field, value: true };
      if (field.key === 'security_first_aid') return { ...field, value: true };
      if (field.key === 'security_fire_alarm') return { ...field, value: true };
      if (field.key === 'security_access') return { ...field, value: true };
      if (field.key === 'security_extinguisher') return { ...field, value: true };
      if (field.key === 'security_personnel') return { ...field, value: true };
      if (field.key === 'security_smoke_alarm') return { ...field, value: true };
      if (field.key === 'security_safety_alarm') return { ...field, value: true };
      return field;
    }),
    category: '设施信息',
    status: 'confirmed',
    source: '人工录入',
    lastModified: new Date('2024-01-18'),
    completeness: 100
  },
  {
    id: '5',
    title: '酒店政策及服务',
    fields: getFieldsTemplate('政策信息').map(field => {
      // 设置示例值
      if (field.key === 'checkinTime') return { ...field, value: '14:00' };
      if (field.key === 'checkoutTime') return { ...field, value: '12:00' };
      if (field.key === 'bookingNote') return { ...field, value: '请提前预订，节假日房源紧张' };
      if (field.key === 'checkinNote') return { ...field, value: '入住需提供有效身份证件，外宾需提供护照' };
      if (field.key === 'checkinMethod') return { ...field, value: '前台办理、自助入住机、手机办理' };
      if (field.key === 'ageRestriction') return { ...field, value: '18周岁以上可单独入住' };
      if (field.key === 'petPolicy') return { ...field, value: '不允许携带宠物' };
      if (field.key === 'serviceAnimal') return { ...field, value: '允许携带服务型动物' };
      if (field.key === 'payment_unionpay') return { ...field, value: true };
      if (field.key === 'payment_wechat') return { ...field, value: true };
      if (field.key === 'payment_alipay') return { ...field, value: true };
      if (field.key === 'payment_mastercard') return { ...field, value: true };
      if (field.key === 'payment_visa') return { ...field, value: true };
      if (field.key === 'payment_amex') return { ...field, value: true };
      if (field.key === 'payment_jcb') return { ...field, value: true };
      if (field.key === 'breakfast_type') return { ...field, value: '自助餐' };
      if (field.key === 'breakfast_cuisine') return { ...field, value: '西式、中式、日式、亚洲菜、欧陆菜' };
      if (field.key === 'breakfast_hours') return { ...field, value: '7:00-10:00' };
      if (field.key === 'breakfast_adult_fee') return { ...field, value: '88元/人' };
      if (field.key === 'extraBedPolicy') return { ...field, value: '可加床，加床费用200元/晚。12岁以下儿童可免费加床（不含早餐）' };
      if (field.key === 'childBreakfastPolicy') return { ...field, value: '儿童早餐50元/人（6-12岁），6岁以下免费' };
      return field;
    }),
    category: '政策信息',
    status: 'confirmed',
    source: '官网',
    lastModified: new Date('2024-01-19'),
    completeness: 100
  },
  {
    id: '6',
    title: '春季旅行套餐',
    fields: [
      { key: 'customTitle', label: '标题', value: '春季旅行套餐', required: true, type: 'text', section: '基本信息' },
      { key: 'customType', label: '类型', value: '旅行套餐', required: false, type: 'text', section: '基本信息' },
      { key: 'customContent', label: '内容', value: '春季特惠套餐，含故宫、颐和园门票+2晚豪华海景房+双人早餐，优惠价1688元起。套餐有效期至2024年5月31日。', required: true, type: 'textarea', section: '基本信息' },
      { key: 'customNote', label: '备注', value: '需提前3天预订，不可退改', required: false, type: 'textarea', section: '基本信息' },
    ],
    category: '自定义类别',
    status: 'confirmed',
    source: '营销部',
    lastModified: new Date('2024-01-20'),
    completeness: 100
  },
  {
    id: '7',
    title: '屋顶酒吧音乐之夜',
    fields: [
      { key: 'customTitle', label: '标题', value: '屋顶酒吧音乐之夜', required: true, type: 'text', section: '基本信息' },
      { key: 'customType', label: '类型', value: '特色活动', required: false, type: 'text', section: '基本信息' },
      { key: 'customContent', label: '内容', value: '每周五晚20:00-23:00，屋顶酒吧现场乐队演出，俯瞰CBD全景，享受美酒与音乐。每周日15:00-17:00下午茶品鉴会，品尝精选茶点与咖啡。', required: true, type: 'textarea', section: '基本信息' },
      { key: 'customNote', label: '备注', value: '住店客人免费参加，非住店客人需提前预约', required: false, type: 'textarea', section: '基本信息' },
    ],
    category: '自定义类别',
    status: 'confirmed',
    source: '市场部',
    lastModified: new Date('2024-01-20'),
    completeness: 100
  },
  {
    id: '8',
    title: '无边际泳池',
    fields: [
      { key: 'customTitle', label: '标题', value: '无边际泳池', required: true, type: 'text', section: '基本信息' },
      { key: 'customType', label: '类型', value: '特色设施', required: false, type: 'text', section: '基本信息' },
      { key: 'customContent', label: '内容', value: '位于酒店25楼的屋顶无边际泳池，全天候恒温，可俯瞰CBD全景。配备专业救生员，提供浴巾和休闲躺椅。', required: true, type: 'textarea', section: '基本信息' },
      { key: 'customNote', label: '备注', value: '开放时间：6:00-22:00，仅限住店客人使用', required: false, type: 'textarea', section: '基本信息' },
    ],
    category: '自定义类别',
    status: 'pending',
    source: '运营部',
    lastModified: new Date('2024-01-21'),
    completeness: 80
  },
  {
    id: '9',
    title: 'CBD周边配套洞察',
    fields: getFieldsTemplate('周边POI').map(field => {
      if (field.key === 'poiTraffic') return {
        ...field,
        value: [
          { id: 'traffic-1', tag: '地铁', name: '伊犁路地铁站', distance: '220米' },
          { id: 'traffic-2', tag: '地铁', name: '红宝石路地铁站-2口', distance: '630米' },
          { id: 'traffic-3', tag: '机场', name: '上海虹桥国际机场-T1航站楼', distance: '6.6千米' },
          { id: 'traffic-4', tag: '机场', name: '浦东国际机场', distance: '46千米' },
          { id: 'traffic-5', tag: '火车站', name: '上海南站', distance: '7.5千米' },
          { id: 'traffic-6', tag: '火车站', name: '上山西站', distance: '8.2千米' },
        ]
      };
      if (field.key === 'poiAttractions') return {
        ...field,
        value: [
          { id: 'attraction-1', name: '武康路', distance: '3.8千米' },
          { id: 'attraction-2', name: '东华大学(延安路校区)', distance: '1.3千米' },
          { id: 'attraction-3', name: '新华路', distance: '1.6千米' },
          { id: 'attraction-4', name: '上海儿童博物馆', distance: '885米' },
          { id: 'attraction-5', name: '武康大楼', distance: '3.3千米' },
          { id: 'attraction-6', name: '上海国际舞蹈中心', distance: '991米' },
          { id: 'attraction-7', name: '上海宋庆龄故居纪念馆', distance: '3.4千米' },
          { id: 'attraction-8', name: '上海长风海洋世界', distance: '3.2千米' },
          { id: 'attraction-9', name: '愚园路历史文化风貌区', distance: '4.7千米' },
          { id: 'attraction-10', name: '上海国际展览中心', distance: '684米' },
          { id: 'attraction-11', name: '上海动物园', distance: '4千米' },
          { id: 'attraction-12', name: '上海乐高探索中心', distance: '3千米' },
          { id: 'attraction-13', name: '上海消防博物馆', distance: '2.4千米' },
          { id: 'attraction-14', name: '上海体育场', distance: '4千米' },
        ]
      };
      if (field.key === 'poiFood') return {
        ...field,
        value: [
          { id: 'food-1', name: '上古北禧玥酒店·玛瑙花园', distance: '<100米' },
          { id: 'food-2', name: 'BELLOCO倍乐(古北店)', distance: '104米' },
          { id: 'food-3', name: '初花·日本料理(高岛屋店)', distance: '102米' },
          { id: 'food-4', name: '成隆行·颐丰花园(虹桥店)', distance: '285米' },
          { id: 'food-5', name: 'GREEN & SAFE(高岛屋店)', distance: '178米' },
          { id: 'food-6', name: '上海会馆(高岛屋店)', distance: '150米' },
          { id: 'food-7', name: '麦当劳(高岛屋店)', distance: '219米' },
          { id: 'food-8', name: '虎连坊日本料理自助餐(国贸店)', distance: '592米' },
          { id: 'food-9', name: '齐民市集(高岛屋百货店)', distance: '134米' },
          { id: 'food-10', name: 'Katsukura名藏炸猪排(高岛屋百货店)', distance: '110米' },
          { id: 'food-11', name: '烧肉万两(高岛屋店)', distance: '107米' },
          { id: 'food-12', name: '臻之宴', distance: '1千米' },
        ]
      };
      if (field.key === 'poiShopping') return {
        ...field,
        value: [
          { id: 'shopping-1', name: '上高岛屋百货', distance: '130米' },
          { id: 'shopping-2', name: '上海世贸商城', distance: '674米' },
          { id: 'shopping-3', name: '虹桥南丰城', distance: '1.2千米' },
          { id: 'shopping-4', name: '上海尚嘉中心', distance: '1千米' },
          { id: 'shopping-5', name: '古北1699(虹桥大成商务广场店)', distance: '974米' },
        ]
      };
      return field;
    }),
    category: '周边POI',
    status: 'confirmed',
    source: '目的地洞察',
    lastModified: new Date('2024-01-22'),
    completeness: 100
  },
];

export function DocumentManager() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [activeCategory, setActiveCategory] = useState<DocumentCategory>('酒店基础信息');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');

  const categories: DocumentCategory[] = [
    '酒店基础信息',
    '房型信息',
    '设施信息',
    '政策信息',
    '周边POI',
    '自定义类别'
  ];

  const filteredDocuments = documents.filter(doc => doc.category === activeCategory);
  const hotelInfoCount = documents.filter(doc => doc.category === '酒店基础信息').length;
  const isHotelInfoCategory = activeCategory === '酒店基础信息';
  const canAddHotelInfo = !isHotelInfoCategory || hotelInfoCount === 0;

  const handleAddDocument = () => {
    if (!newDocTitle.trim()) return;
    if (activeCategory === '酒店基础信息' && hotelInfoCount >= 1) return;

    const newDoc: Document = {
      id: Date.now().toString(),
      title: newDocTitle,
      fields: getFieldsTemplate(activeCategory),
      category: activeCategory,
      status: 'draft',
      source: '手动创建',
      lastModified: new Date(),
      completeness: 0
    };

    setDocuments([...documents, newDoc]);
    setNewDocTitle('');
    setIsAddDialogOpen(false);
  };

  const handleUpdateDocument = (updatedDoc: Document) => {
    setDocuments(documents.map(doc => 
      doc.id === updatedDoc.id ? updatedDoc : doc
    ));
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  const getAddButtonText = (category: DocumentCategory) => {
    switch (category) {
      case '房型信息':
        return '新增房型';
      case '设施信息':
        return '新增设施';
      case '政策信息':
        return '新增政策';
      default:
        return '新增文档';
    }
  };

  const getDialogTitle = (category: DocumentCategory) => {
    switch (category) {
      case '房型信息':
        return '新增房型';
      case '设施信息':
        return '新增设施';
      case '政策信息':
        return '新增政策';
      default:
        return '新增文档';
    }
  };

  const getPlaceholder = (category: DocumentCategory) => {
    switch (category) {
      case '房型信息':
        return '请输入房型名称';
      case '设施信息':
        return '请输入设施名称';
      case '政策信息':
        return '请输入政策名称';
      default:
        return '请输入文档标题';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeCategory} onValueChange={(value: string) => setActiveCategory(value as DocumentCategory)} className="flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <TabsList className="flex-wrap h-auto">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="whitespace-nowrap">
                {category}
                <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                  {documents.filter(doc => doc.category === category).length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0" disabled={!canAddHotelInfo}>
                <Plus className="mr-2 h-4 w-4" />
                {getAddButtonText(activeCategory)}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{getDialogTitle(activeCategory)}</DialogTitle>
                <DialogDescription>
                  创建一个新的{activeCategory === '房型信息' ? '房型' : activeCategory === '设施信息' ? '设施' : activeCategory === '政策信息' ? '政策' : '文档'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    {activeCategory === '房型信息' ? '房型名称' : activeCategory === '设施信息' ? '设施名称' : activeCategory === '政策信息' ? '政策名称' : '文档标题'}
                  </Label>
                  <Input
                    id="title"
                    placeholder={getPlaceholder(activeCategory)}
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddDocument()}
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddDocument} className="flex-1" disabled={!newDocTitle.trim()}>
                    创建
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                    取消
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="flex-1 overflow-auto">
            <DocumentList
              documents={filteredDocuments}
              onUpdate={handleUpdateDocument}
              onDelete={handleDeleteDocument}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
