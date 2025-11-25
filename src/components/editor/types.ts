import { DocumentField } from '../DocumentManager';

// 字段渲染器通用 Props
export interface FieldRendererProps {
  field: DocumentField;
  fields: DocumentField[];
  setFields: React.Dispatch<React.SetStateAction<DocumentField[]>>;
  isRoomInfoCategory?: boolean;
  onConvertType?: (key: string, newType: 'boolean' | 'boolean-with-options') => void;
  onRemoveField?: (key: string) => void;
  onUpdateField?: (key: string, value: string | boolean) => void;
  onUpdateFieldWithOptions?: (key: string, updates: Partial<DocumentField>) => void;
}

// POI 条目类型
export interface PoiEntry {
  id: string;
  name: string;
  distance: string;
  tag?: string;
}

// POI 字段渲染器 Props
export interface PoiFieldRendererProps {
  field: DocumentField;
  onAddEntry: (fieldKey: string) => void;
  onRemoveEntry: (fieldKey: string, entryId: string) => void;
  onUpdateEntry: (fieldKey: string, entryId: string, updates: Partial<PoiEntry>) => void;
  asPoiEntries: (value: unknown) => PoiEntry[];
}

// 简单字段表单 Props
export interface SimpleFieldFormProps {
  labelValue: string;
  setLabel: (value: string) => void;
  valueValue: string;
  setValue: (value: string) => void;
  onAdd: () => void;
  onCancel: () => void;
}

// 二级指标表单 Props
export interface SubsectionFormProps {
  subsectionName: string;
  setSubsectionName: (value: string) => void;
  onAdd: () => void;
  onCancel: () => void;
  placeholder?: string;
}
