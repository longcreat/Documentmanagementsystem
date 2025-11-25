import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { FeeSettingPanel } from './FeeSettingPanel';
import { Document, DocumentField } from './DocumentManager';
import { useHotelInfoModule } from '../modules/hotel/useHotelInfoModule';
import { useRoomInfoModule } from '../modules/room/useRoomInfoModule';
import { useFacilityModule } from '../modules/facility/useFacilityModule';
import { usePolicyModule } from '../modules/policy/usePolicyModule';
import { useCustomCategoryModule } from '../modules/custom/useCustomCategoryModule';
import { usePoiModule, asPoiEntries } from '../modules/poi/usePoiModule';
import { RoomFieldForm } from './RoomFieldForm';
import { FacilityFieldForm } from './FacilityFieldForm';

// 导入新的编辑器组件
import {
  BooleanField,
  BooleanWithOptionsField,
  BooleanWithTextField,
  BooleanWithLanguagesField,
  TextField,
  PoiListField,
  SimpleFieldForm,
  SubsectionForm,
} from './editor';

const HOTEL_BASE_SECTIONS = [
  '酒店基本信息',
  '联系方式',
  '酒店基本设施',
  '开业和装修',
  '交通信息',
];

const ROOM_BASE_SECTIONS = [
  '基础信息',
  '浴室信息',
  '网络与通讯',
  '客房布局和家具',
  '客房设施',
  '媒体科技',
  '食品饮品',
  '便民服务',
];

const ROOM_SECTION_SUBSECTIONS: Record<string, string[]> = {
  '基础信息': [],
  '浴室信息': [],
  '网络与通讯': [],
  '客房布局和家具': [],
  '客房设施': [],
  '媒体科技': [],
  '食品饮品': [],
  '便民服务': [],
};

import { Badge } from './ui/badge';
import { CheckCircle, Save, AlertCircle, ChevronDown, ChevronRight, Plus, X, ArrowLeftRight, ToggleLeft, Coins } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Switch } from './ui/switch';

interface DocumentEditorProps {
  document: Document;
  onSave: (doc: Document) => void;
  onCancel: () => void;
}

export function DocumentEditor({ document, onSave, onCancel }: DocumentEditorProps) {
  const [title, setTitle] = useState(document.title);
  const [fields, setFields] = useState<DocumentField[]>(document.fields);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [addingFieldToSection, setAddingFieldToSection] = useState<string | null>(null);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<'boolean' | 'boolean-with-options'>('boolean');
  const [customRoomSubsections, setCustomRoomSubsections] = useState<Record<string, string[]>>(() => {
    if (document.category !== '房型信息') return {};
    const map: Record<string, string[]> = {};
    document.fields.forEach(field => {
      if (!field.section || field.section === '房型名称') return;
      if (!field.subsection) return;
      const baseSubs = ROOM_SECTION_SUBSECTIONS[field.section] || [];
      if (!baseSubs.includes(field.subsection)) {
        if (!map[field.section]) map[field.section] = [];
        if (!map[field.section].includes(field.subsection)) {
          map[field.section].push(field.subsection);
        }
      }
    });
    return map;
  });
  const isPoiCategory = document.category === '周边POI';
  const isHotelInfoCategory = document.category === '酒店基础信息';
  const isRoomInfoCategory = document.category === '房型信息';
  const isFacilityCategory = document.category === '设施信息';
  const isPolicyCategory = document.category === '政策信息';
  const isCustomCategory = document.category === '自定义类别';
  const canAddCustomFields = !isPoiCategory;
  const usesSimpleFieldForm = isHotelInfoCategory || isRoomInfoCategory || isPolicyCategory || isCustomCategory;

  const {
    customSections: customHotelSections,
    newSectionName: newHotelSectionName,
    setNewSectionName: setNewHotelSectionName,
    newFieldLabel: newHotelFieldLabel,
    setNewFieldLabel: setNewHotelFieldLabel,
    newFieldValue: newHotelFieldValue,
    setNewFieldValue: setNewHotelFieldValue,
    addSection: addHotelSection,
    removeSection: removeHotelSection,
    addSimpleField: addSimpleHotelField,
  } = useHotelInfoModule({
    document,
    fields,
    setFields,
    setOpenSections,
    addingFieldToSection,
    setAddingFieldToSection,
    isActive: isHotelInfoCategory,
  });

  const {
    customSections: customRoomSections,
    customSubsections: customRoomSubsectionsFromHook,
    newSectionName: newRoomSectionName,
    setNewSectionName: setNewRoomSectionName,
    newSubsectionName: newRoomSubsectionName,
    setNewSubsectionName: setNewRoomSubsectionName,
    newFieldLabel: newRoomFieldLabel,
    setNewFieldLabel: setNewRoomFieldLabel,
    newFieldValue: newRoomFieldValue,
    setNewFieldValue: setNewRoomFieldValue,
    newFieldType: newRoomFieldType,
    setNewFieldType: setNewRoomFieldType,
    newFeeNote: newRoomFeeNote,
    setNewFeeNote: setNewRoomFeeNote,
    newFeeType: newRoomFeeType,
    setNewFeeType: setNewRoomFeeType,
    newFeeAmount: newRoomFeeAmount,
    setNewFeeAmount: setNewRoomFeeAmount,
    addSection: addRoomSection,
    removeSection: removeRoomSection,
    addSubsection: addRoomSubsection,
    removeSubsection: removeRoomSubsection,
    addSimpleField: addSimpleRoomField,
    addBooleanField: addRoomBooleanField,
  } = useRoomInfoModule({
    document,
    fields,
    setFields,
    setOpenSections,
    addingFieldToSection,
    setAddingFieldToSection,
    isActive: isRoomInfoCategory,
    baseSections: ROOM_BASE_SECTIONS,
  });

  const {
    customSections: customFacilitySections,
    newSectionName: newFacilitySectionName,
    setNewSectionName: setNewFacilitySectionName,
    newFieldLabel: newFacilityFieldLabel,
    setNewFieldLabel: setNewFacilityFieldLabel,
    newFieldValue: newFacilityFieldValue,
    setNewFieldValue: setNewFacilityFieldValue,
    newFieldType: newFacilityFieldType,
    setNewFieldType: setNewFacilityFieldType,
    newFeeStatus: newFacilityFeeStatus,
    setNewFeeStatus: setNewFacilityFeeStatus,
    newFeeType: newFacilityFeeType,
    setNewFeeType: setNewFacilityFeeType,
    newFeeAmount: newFacilityFeeAmount,
    setNewFeeAmount: setNewFacilityFeeAmount,
    newFeeNote: newFacilityFeeNote,
    setNewFeeNote: setNewFacilityFeeNote,
    newSubsectionName: newFacilitySubsectionName,
    setNewSubsectionName: setNewFacilitySubsectionName,
    addSubsection: addFacilitySubsection,
    addSection: addFacilitySection,
    removeSection: removeFacilitySection,
    addSimpleField: addSimpleFacilityField,
    addFacilityField,
  } = useFacilityModule({
    document,
    fields,
    setFields,
    setOpenSections,
    addingFieldToSection,
    setAddingFieldToSection,
    isActive: isFacilityCategory,
  });

  const {
    customSections: customPolicySections,
    newSectionName: newPolicySectionName,
    setNewSectionName: setNewPolicySectionName,
    newFieldLabel: newPolicyFieldLabel,
    setNewFieldLabel: setNewPolicyFieldLabel,
    newFieldValue: newPolicyFieldValue,
    setNewFieldValue: setNewPolicyFieldValue,
    addSection: addPolicySection,
    removeSection: removePolicySection,
    addSimpleField: addSimplePolicyField,
  } = usePolicyModule({
    document,
    fields,
    setFields,
    setOpenSections,
    addingFieldToSection,
    setAddingFieldToSection,
    isActive: isPolicyCategory,
  });

  const {
    customSections: customCategorySections,
    newSectionName: newCustomSectionName,
    setNewSectionName: setNewCustomSectionName,
    newFieldLabel: newCustomFieldLabel,
    setNewFieldLabel: setNewCustomFieldLabel,
    newFieldValue: newCustomFieldValue,
    setNewFieldValue: setNewCustomFieldValue,
    addSection: addCustomSection,
    removeSection: removeCustomSection,
    addSimpleField: addSimpleCustomField,
  } = useCustomCategoryModule({
    document,
    fields,
    setFields,
    setOpenSections,
    addingFieldToSection,
    setAddingFieldToSection,
    isActive: isCustomCategory,
  });

  const {
    customSections: customPoiSections,
    newSectionName: newPoiSectionName,
    setNewSectionName: setNewPoiSectionName,
    addSection: addPoiSection,
    removeSection: removePoiSection,
    addEntry: addPoiEntry,
    updateEntry: updatePoiEntry,
    removeEntry: removePoiEntry,
  } = usePoiModule({
    document,
    fields,
    setFields,
    setOpenSections,
    isActive: isPoiCategory,
  });

  const isFieldFilled = (field: DocumentField, options?: { treatBooleanAsFilled?: boolean }) => {
    if (field.type === 'poi-list') {
      const entries = asPoiEntries(field.value);
      if (entries.length === 0) return false;
      return entries.every(entry => entry.name?.toString().trim() && entry.distance?.toString().trim());
    }
    if (typeof field.value === 'boolean') {
      return options?.treatBooleanAsFilled ? true : field.value === true;
    }
    return field.value.toString().trim().length > 0;
  };

  const sectionInputConfig = (() => {
    if (isPoiCategory) {
      return {
        placeholder: '输入模块名称，如夜生活、亲子娱乐',
        value: newPoiSectionName,
        setValue: setNewPoiSectionName,
        add: addPoiSection,
      };
    }
    if (isHotelInfoCategory) {
      return {
        placeholder: '输入模块名称，如品牌故事、设计亮点',
        value: newHotelSectionName,
        setValue: setNewHotelSectionName,
        add: addHotelSection,
      };
    }
    if (isRoomInfoCategory) {
      return {
        placeholder: '输入模块名称，如亲子套房、影音体验',
        value: newRoomSectionName,
        setValue: setNewRoomSectionName,
        add: addRoomSection,
      };
    }
    if (isFacilityCategory) {
      return {
        placeholder: '输入模块名称，如特色空间、增值服务',
        value: newFacilitySectionName,
        setValue: setNewFacilitySectionName,
        add: addFacilitySection,
      };
    }
    if (isPolicyCategory) {
      return {
        placeholder: '输入模块名称，如入住要求、票务说明',
        value: newPolicySectionName,
        setValue: setNewPolicySectionName,
        add: addPolicySection,
      };
    }
    if (isCustomCategory) {
      return {
        placeholder: '输入模块名称，如营销亮点、活动详情',
        value: newCustomSectionName,
        setValue: setNewCustomSectionName,
        add: addCustomSection,
      };
    }
    return null;
  })();

  const existingSectionNames = () => {
    const names = new Set<string>();
    fields.forEach(field => {
      if (field.section) names.add(field.section);
    });
    customPoiSections.forEach(name => names.add(name));
    customHotelSections.forEach(name => names.add(name));
    customRoomSections.forEach(name => names.add(name));
    customFacilitySections.forEach(name => names.add(name));
    customPolicySections.forEach(name => names.add(name));
    customCategorySections.forEach(name => names.add(name));
    return names;
  };

  const updateField = (key: string, value: string | boolean) => {
    setFields(fields.map((field: DocumentField) =>
      field.key === key ? { ...field, value } : field
    ));
  };

  const updateFieldWithOptions = (key: string, updates: Partial<DocumentField>) => {
    setFields(fields.map((field: DocumentField) =>
      field.key === key ? { ...field, ...updates } : field
    ));
  };

  const addCustomField = (section: string, subsection?: string) => {
    if (!newFieldName.trim()) return;

    const newField: DocumentField = {
      key: `custom_${Date.now()}`,
      label: newFieldName,
      value: false,
      required: false,
      type: newFieldType,
      section,
      subsection,
      isCustom: true,
      ...(newFieldType === 'boolean-with-options' ? {
        feeStatus: '',
        feeNote: '',
        additionalNote: ''
      } : {})
    };

    setFields([...fields, newField]);
    setNewFieldName('');
    setNewFieldType('boolean');
    setAddingFieldToSection(null);
  };

  const renderSimpleFieldForm = (section: string, subsection?: string) => {
    let labelValue = '';
    let valueValue = '';
    let setLabel: (value: string) => void = () => {};
    let setValue: (value: string) => void = () => {};
    let handleAdd = () => {};

    if (isHotelInfoCategory) {
      labelValue = newHotelFieldLabel;
      valueValue = newHotelFieldValue;
      setLabel = setNewHotelFieldLabel;
      setValue = setNewHotelFieldValue;
      handleAdd = () => addSimpleHotelField(section, subsection);
    } else if (isRoomInfoCategory) {
      labelValue = newRoomFieldLabel;
      valueValue = newRoomFieldValue;
      setLabel = setNewRoomFieldLabel;
      setValue = setNewRoomFieldValue;
      handleAdd = () => addSimpleRoomField(section, subsection);
    } else if (isPolicyCategory) {
      labelValue = newPolicyFieldLabel;
      valueValue = newPolicyFieldValue;
      setLabel = setNewPolicyFieldLabel;
      setValue = setNewPolicyFieldValue;
      handleAdd = () => addSimplePolicyField(section, subsection);
    } else if (isCustomCategory) {
      labelValue = newCustomFieldLabel;
      valueValue = newCustomFieldValue;
      setLabel = setNewCustomFieldLabel;
      setValue = setNewCustomFieldValue;
      handleAdd = () => addSimpleCustomField(section, subsection);
    }

    const handleCancel = () => {
      setAddingFieldToSection(null);
      setLabel('');
      setValue('');
    };

    return (
      <SimpleFieldForm
        labelValue={labelValue}
        setLabel={setLabel}
        valueValue={valueValue}
        setValue={setValue}
        onAdd={handleAdd}
        onCancel={handleCancel}
      />
    );
  };

  // 设施模块专用的添加字段表单
  const renderFacilityFieldForm = (section: string, subsection?: string) => {
    return (
      <FacilityFieldForm
        fieldLabel={newFacilityFieldLabel}
        setFieldLabel={setNewFacilityFieldLabel}
        fieldType={newFacilityFieldType}
        setFieldType={setNewFacilityFieldType}
        fieldValue={newFacilityFieldValue}
        setFieldValue={setNewFacilityFieldValue}
        feeStatus={newFacilityFeeStatus}
        setFeeStatus={setNewFacilityFeeStatus}
        feeType={newFacilityFeeType}
        setFeeType={setNewFacilityFeeType}
        feeAmount={newFacilityFeeAmount}
        setFeeAmount={setNewFacilityFeeAmount}
        feeNote={newFacilityFeeNote}
        setFeeNote={setNewFacilityFeeNote}
        onAdd={() => addFacilityField(section, subsection)}
        onCancel={() => setAddingFieldToSection(null)}
        radioName={`facility_field_${section}_${subsection || 'main'}`}
        placeholder="输入设施名称，如：健身房、游泳池"
        valuePlaceholder="输入具体信息，如：24小时开放"
      />
    );
  };

  const removeCustomField = (key: string) => {
    setFields(fields.filter((field: DocumentField) => field.key !== key));
  };

  const convertFieldType = (key: string, newType: 'boolean' | 'boolean-with-options') => {
    setFields(fields.map((field: DocumentField) => {
      if (field.key !== key) return field;
      
      if (newType === 'boolean-with-options') {
        return {
          ...field,
          type: 'boolean-with-options',
          feeStatus: '',
          feeNote: '',
          additionalNote: ''
        };
      } else {
        const { feeStatus, feeNote, additionalNote, ...rest } = field;
        return {
          ...rest,
          type: 'boolean'
        };
      }
    }));
  };

  const calculateCompleteness = (fields: DocumentField[]): number => {
    const requiredFields = fields.filter((f: DocumentField) => f.required);
    const filledRequiredFields = requiredFields.filter((f: DocumentField) =>
      isFieldFilled(f, { treatBooleanAsFilled: true })
    );
    
    if (requiredFields.length === 0) return 100;
    
    return Math.round((filledRequiredFields.length / requiredFields.length) * 100);
  };

  const getMissingFields = () => {
    return fields.filter((field: DocumentField) => field.required && !isFieldFilled(field, { treatBooleanAsFilled: true }));
  };

  const groupFieldsBySection = () => {
    const sections = new Map<string, Map<string, DocumentField[]>>();

    fields.forEach((field: DocumentField) => {
      if (isRoomInfoCategory && field.section === '房型名称') {
        return;
      }
      const section = field.section || '其他';
      const subsection = field.subsection || '';
      
      if (!sections.has(section)) {
        sections.set(section, new Map());
      }
      
      const sectionMap = sections.get(section)!;
      if (!sectionMap.has(subsection)) {
        sectionMap.set(subsection, []);
      }

      sectionMap.get(subsection)?.push(field);
    });

    if (isHotelInfoCategory) {
      customHotelSections.forEach((section) => {
        if (!sections.has(section)) {
          const sectionMap = new Map<string, DocumentField[]>();
          sectionMap.set('', []);
          sections.set(section, sectionMap);
        }
      });
    }
    if (isRoomInfoCategory) {
      customRoomSections.forEach((section) => {
        if (!sections.has(section)) {
          const sectionMap = new Map<string, DocumentField[]>();
          sectionMap.set('', []);
          sections.set(section, sectionMap);
        }
      });
      // 添加自定义二级指标（空的subsection）
      Object.entries(customRoomSubsectionsFromHook).forEach(([section, subsections]) => {
        if (!sections.has(section)) {
          sections.set(section, new Map());
        }
        const sectionMap = sections.get(section)!;
        subsections.forEach(subsection => {
          if (!sectionMap.has(subsection)) {
            sectionMap.set(subsection, []);
          }
        });
      });
    }
    if (isFacilityCategory) {
      customFacilitySections.forEach((section) => {
        if (!sections.has(section)) {
          const sectionMap = new Map<string, DocumentField[]>();
          sectionMap.set('', []);
          sections.set(section, sectionMap);
        }
      });
    }
    if (isPolicyCategory) {
      customPolicySections.forEach((section) => {
        if (!sections.has(section)) {
          const sectionMap = new Map<string, DocumentField[]>();
          sectionMap.set('', []);
          sections.set(section, sectionMap);
        }
      });
    }
    if (isCustomCategory) {
      customCategorySections.forEach((section) => {
        if (!sections.has(section)) {
          const sectionMap = new Map<string, DocumentField[]>();
          sectionMap.set('', []);
          sections.set(section, sectionMap);
        }
      });
    }

    return sections;
  };

  const toggleSection = (section: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(section)) {
      newOpenSections.delete(section);
    } else {
      newOpenSections.add(section);
    }
    setOpenSections(newOpenSections);
  };

  const getSectionStats = (sectionMap: Map<string, DocumentField[]>) => {
    let totalFields = 0;
    let filledFields = 0;
    let requiredTotal = 0;
    let requiredFilled = 0;

    sectionMap.forEach((fields: DocumentField[]) => {
      fields.forEach((field: DocumentField) => {
        totalFields++;
        const filled = isFieldFilled(field);
        if (filled) filledFields++;

        if (field.required) {
          requiredTotal++;
          if (isFieldFilled(field, { treatBooleanAsFilled: true })) {
            requiredFilled++;
          }
        }
      });
    });

    return { totalFields, filledFields, requiredTotal, requiredFilled };
  };

  const missingFields = getMissingFields();
  const completeness = calculateCompleteness(fields);
  const sections = groupFieldsBySection();

  const handleSave = () => {
    if (!title.trim()) {
      alert('请输入文档标题');
      return;
    }

    if (missingFields.length > 0) {
      const confirm = window.confirm(
        `还有 ${missingFields.length} 个必填字段未填写，确定要保存吗？\n未填写字段：${missingFields.map((f: DocumentField) => f.label).join('、')}`
      );
      if (!confirm) return;
    }

    const updatedDoc: Document = {
      ...document,
      title,
      fields,
      completeness,
      status: missingFields.length === 0 ? 'confirmed' : document.status,
      lastModified: new Date()
    };
    onSave(updatedDoc);
  };

  const renderField = (field: DocumentField) => {
    // POI 列表类型
    if (field.type === 'poi-list') {
      const entries = asPoiEntries(field.value);
      return (
        <PoiListField
          field={field}
          entries={entries}
          onAddEntry={() => addPoiEntry(field.key)}
          onRemoveEntry={(entryId) => removePoiEntry(field.key, entryId)}
          onUpdateEntry={(entryId, updates) => updatePoiEntry(field.key, entryId, updates)}
        />
      );
    }

    // 多语言服务类型
    if (field.type === 'boolean-with-languages') {
      return (
        <BooleanWithLanguagesField
          field={field}
          onUpdate={(updates) => setFields(fields.map(f => 
            f.key === field.key ? { ...f, ...updates } : f
          ))}
        />
      );
    }

    // 带文本输入的开关类型
    if (field.type === 'boolean-with-text') {
      return (
        <BooleanWithTextField
          field={field}
          onUpdate={(updates) => setFields(fields.map(f => 
            f.key === field.key ? { ...f, ...updates } : f
          ))}
        />
      );
    }

    // 带收费选项的开关类型
    if (field.type === 'boolean-with-options') {
      return (
        <BooleanWithOptionsField
          field={field}
          onUpdateWithOptions={(updates) => updateFieldWithOptions(field.key, updates)}
          onConvertType={() => convertFieldType(field.key, 'boolean')}
          onRemove={field.isCustom ? () => removeCustomField(field.key) : undefined}
        />
      );
    }

    // 简单开关类型
    if (field.type === 'boolean') {
      const showConvertButton = field.section !== '支付方式' && isRoomInfoCategory;
      
      return (
        <BooleanField
          field={field}
          showConvertButton={showConvertButton}
          onCheckedChange={(checked) => updateField(field.key, checked)}
          onConvertType={showConvertButton ? () => convertFieldType(field.key, 'boolean-with-options') : undefined}
          onRemove={field.isCustom ? () => removeCustomField(field.key) : undefined}
        />
      );
    }

    // 文本/数字输入类型（默认）
    return (
      <TextField
        field={field}
        onUpdate={(value) => updateField(field.key, value)}
      />
    );
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>编辑{document.category === '房型信息' ? '房型' : document.category === '设施信息' ? '设施' : document.category === '政策信息' ? '政策' : '文档'}</DialogTitle>
          <DialogDescription>
            填写各个字段，完善{document.category === '房型信息' ? '房型' : '文档'}内容
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">文档完善度</span>
              <span className="text-lg font-semibold text-gray-900">{completeness}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  completeness >= 90 ? 'bg-green-500' :
                  completeness >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
          {completeness === 100 && (
            <Badge className="bg-green-500 shadow-sm">
              <CheckCircle className="mr-1 h-3 w-3" />
              已完善
            </Badge>
          )}
        </div>

        <ScrollArea className="flex-1 -mx-6 px-6 overflow-y-auto">
          <div className="space-y-4 pr-4 pb-4">
            <div className="space-y-2 bg-white sticky top-0 pb-4 z-10">
              <Label htmlFor="doc-title" className="flex items-center gap-2 text-base">
                {document.category === '房型信息' ? '房型名称' : '文档标题'}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="doc-title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder={document.category === '房型信息' ? '例如：豪华海景大床房' : '请输入文档标题'}
                className="text-base"
              />
            </div>

            {sectionInputConfig && (
              <div className="p-4 border border-dashed border-blue-200 rounded-2xl bg-blue-50/40">
                <div className="flex flex-col gap-2 sm:flex-row items-stretch">
                  <Input
                    placeholder={sectionInputConfig.placeholder}
                    value={sectionInputConfig.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => sectionInputConfig.setValue(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter' && sectionInputConfig.value.trim()) {
                        sectionInputConfig.add();
                      }
                    }}
                    className="flex-1 border border-blue-200 bg-white/90 rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:border-blue-400"
                  />
                  <Button
                    onClick={sectionInputConfig.add}
                    disabled={!sectionInputConfig.value.trim()}
                    className="sm:w-36 rounded-xl"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    添加模块
                  </Button>
                </div>
              </div>
            )}

            {Array.from(sections.entries()).map(([sectionName, subsectionsMap]) => {
              const stats = getSectionStats(subsectionsMap);
              const isOpen = openSections.has(sectionName);
              const missingInSection = missingFields.filter((f: DocumentField) => f.section === sectionName).length;
              const isPoiSection =
                isPoiCategory &&
                Array.from(subsectionsMap.values()).some(fields =>
                  fields.some(field => field.type === 'poi-list')
                );
              const sectionFieldsFlat = Array.from(subsectionsMap.values()).flat();
              const poiEntriesCount = isPoiSection
                ? Array.from(subsectionsMap.values()).reduce((count, fields) => {
                    return (
                      count +
                      fields.reduce((fieldCount, field) => {
                        if (field.type === 'poi-list') {
                          return fieldCount + asPoiEntries(field.value).length;
                        }
                        return fieldCount;
                      }, 0)
                    );
                  }, 0)
                : 0;
              const isCustomPoiSection = isPoiSection && sectionFieldsFlat.every(field => field.isCustom);
              const isCustomHotelSection = isHotelInfoCategory && customHotelSections.includes(sectionName);
              const isCustomRoomSection = isRoomInfoCategory && customRoomSections.includes(sectionName);
              const isCustomFacilitySection = isFacilityCategory && customFacilitySections.includes(sectionName);
              const isCustomPolicySection = isPolicyCategory && customPolicySections.includes(sectionName);
              const isCustomCustomCategorySection = isCustomCategory && customCategorySections.includes(sectionName);
              return (
                <div key={sectionName} className="border rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow">
                  <Collapsible open={isOpen} onOpenChange={() => toggleSection(sectionName)}>
                    <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100">
                      <CollapsibleTrigger asChild>
                        <button className="flex-1 flex items-center justify-between p-4 hover:from-gray-100 hover:to-gray-200 transition-all">
                          <div className="flex items-center gap-3">
                            {isOpen ? <ChevronDown className="h-5 w-5 text-gray-600" /> : <ChevronRight className="h-5 w-5 text-gray-600" />}
                            <h4 className="font-medium text-gray-900">{sectionName}</h4>
                            {stats.requiredTotal > 0 && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">必填</Badge>
                            )}
                            {missingInSection > 0 && (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                {missingInSection} 个未填
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            {isPoiSection ? (
                              <span className="font-medium">{poiEntriesCount} 条</span>
                            ) : (
                              <>
                                <span className="font-medium">{stats.filledFields}/{stats.totalFields}</span>
                                <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${stats.totalFields > 0 ? (stats.filledFields / stats.totalFields) * 100 : 0}%` }}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </button>
                      </CollapsibleTrigger>
                      {(canAddCustomFields || isCustomPoiSection || isCustomHotelSection || isCustomRoomSection || isCustomFacilitySection || isCustomPolicySection || isCustomCustomCategorySection) && (
                        <div className="flex gap-1 pr-2">
                          {canAddCustomFields && (() => {
                            // 检查该模块是否有二级指标（subsection）
                            const sectionHasSubsections = (isRoomInfoCategory || isFacilityCategory) && 
                              Array.from(subsectionsMap.keys()).some(sub => sub !== '');
                            
                            // 房型信息基础信息不需要二级指标
                            const canAddSubsection = (isRoomInfoCategory && sectionName !== '基础信息') || isFacilityCategory;
                            
                            return (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.stopPropagation();
                                  if (canAddSubsection && sectionHasSubsections) {
                                    // 有二级指标的模块：添加新的二级指标
                                    setAddingFieldToSection(`${sectionName}::subsection`);
                                  } else if (canAddSubsection) {
                                    // 没有二级指标的模块：直接添加字段
                                    setAddingFieldToSection(`${sectionName}::main::field`);
                                  } else {
                                    setAddingFieldToSection(`${sectionName}::main`);
                                  }
                                  if (!isOpen) toggleSection(sectionName);
                                }}
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                title={canAddSubsection && sectionHasSubsections ? '添加二级指标' : '添加自定义字段'}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            );
                          })()}
                          {isCustomPoiSection && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                removePoiSection(sectionName);
                              }}
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                              title="删除此模块"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          {isCustomHotelSection && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                removeHotelSection(sectionName);
                              }}
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                              title="删除此模块"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          {isCustomRoomSection && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                removeRoomSection(sectionName);
                              }}
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                              title="删除此模块"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          {isCustomFacilitySection && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                removeFacilitySection(sectionName);
                              }}
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                              title="删除此模块"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          {isCustomPolicySection && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                removePolicySection(sectionName);
                              }}
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                              title="删除此模块"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          {isCustomCustomCategorySection && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                removeCustomSection(sectionName);
                              }}
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                              title="删除此模块"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    <CollapsibleContent>
                      <div className="p-4 space-y-4 bg-white">
                        {/* 房型信息：添加二级指标表单（放在 subsection 循环外部） */}
                        {isRoomInfoCategory && sectionName !== '基础信息' && addingFieldToSection === `${sectionName}::subsection` && (
                          <div className="mb-3 rounded-2xl border border-blue-100 bg-white/90 shadow-sm">
                            <div className="p-4 space-y-4">
                              <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">二级指标名称</Label>
                                <Input
                                  placeholder="例如：洗浴用品、卫浴设施、特色服务"
                                  value={newRoomSubsectionName}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRoomSubsectionName(e.target.value)}
                                  onKeyDown={(e: React.KeyboardEvent) => {
                                    if (e.key === 'Enter' && newRoomSubsectionName.trim()) {
                                      addRoomSubsection(sectionName);
                                    }
                                    if (e.key === 'Escape') {
                                      setAddingFieldToSection(null);
                                      setNewRoomSubsectionName('');
                                    }
                                  }}
                                  autoFocus
                                />
                              </div>
                              <div className="flex flex-col gap-2 pt-1 sm:flex-row">
                                <Button
                                  size="sm"
                                  onClick={() => addRoomSubsection(sectionName)}
                                  disabled={!newRoomSubsectionName.trim()}
                                  className="flex-1"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  添加二级指标
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setAddingFieldToSection(null);
                                    setNewRoomSubsectionName('');
                                  }}
                                  className="bg-white"
                                >
                                  取消
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 设施模块：添加二级指标表单 */}
                        {isFacilityCategory && addingFieldToSection === `${sectionName}::subsection` && (
                          <div className="mb-3 rounded-2xl border border-blue-100 bg-white/90 shadow-sm">
                            <div className="p-4 space-y-4">
                              <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">二级指标名称</Label>
                                <Input
                                  placeholder="例如：泳池、健身房、Spa"
                                  value={newFacilitySubsectionName}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFacilitySubsectionName(e.target.value)}
                                  onKeyDown={(e: React.KeyboardEvent) => {
                                    if (e.key === 'Enter' && newFacilitySubsectionName.trim()) {
                                      addFacilitySubsection(sectionName);
                                    }
                                    if (e.key === 'Escape') {
                                      setAddingFieldToSection(null);
                                      setNewFacilitySubsectionName('');
                                    }
                                  }}
                                  autoFocus
                                />
                              </div>
                              <div className="flex flex-col gap-2 pt-1 sm:flex-row">
                                <Button
                                  size="sm"
                                  onClick={() => addFacilitySubsection(sectionName)}
                                  disabled={!newFacilitySubsectionName.trim()}
                                  className="flex-1"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  添加二级指标
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setAddingFieldToSection(null);
                                    setNewFacilitySubsectionName('');
                                  }}
                                  className="bg-white"
                                >
                                  取消
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 房型信息：没有二级指标的模块直接添加字段（开关类型）表单 */}
                        {isRoomInfoCategory && sectionName !== '基础信息' && addingFieldToSection === `${sectionName}::main::field` && (
                          <RoomFieldForm
                            fieldLabel={newRoomFieldLabel}
                            setFieldLabel={setNewRoomFieldLabel}
                            fieldType={newRoomFieldType}
                            setFieldType={setNewRoomFieldType}
                            feeNote={newRoomFeeNote}
                            setFeeNote={setNewRoomFeeNote}
                            feeType={newRoomFeeType}
                            setFeeType={setNewRoomFeeType}
                            feeAmount={newRoomFeeAmount}
                            setFeeAmount={setNewRoomFeeAmount}
                            onAdd={() => addRoomBooleanField(sectionName, '')}
                            onCancel={() => {
                              setAddingFieldToSection(null);
                              setNewRoomFieldLabel('');
                              setNewRoomFieldType('boolean');
                              setNewRoomFeeNote('');
                              setNewRoomFeeType('per_use');
                              setNewRoomFeeAmount('');
                            }}
                            radioName={`room-field-type-${sectionName}-main`}
                            placeholder="输入字段名称，如：智能门锁、空气净化器"
                          />
                        )}

                        {Array.from(subsectionsMap.entries()).map(([subsectionName, subsectionFields]) => (
                          <div key={subsectionName || 'main'}>
                            {subsectionName && (
                              <div className="flex items-center justify-between mb-3 pb-2 border-b">
                                <h5 className="text-sm font-medium text-gray-700">{subsectionName}</h5>
                                <div className="flex items-center gap-1">
                                  {canAddCustomFields && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setAddingFieldToSection(`${sectionName}::${subsectionName}::field`)}
                                      className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      添加字段
                                    </Button>
                                  )}
                                  {isRoomInfoCategory && customRoomSubsectionsFromHook[sectionName]?.includes(subsectionName) && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeRoomSubsection(sectionName, subsectionName)}
                                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                                      title="删除此二级指标"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* 设施模块：二级指标下添加字段表单 */}
                            {isFacilityCategory && subsectionName && addingFieldToSection === `${sectionName}::${subsectionName}::field` && 
                              renderFacilityFieldForm(sectionName, subsectionName)
                            }

                            {/* 房型信息：添加三级字段（开关类型）表单 */}
                            {isRoomInfoCategory && subsectionName && addingFieldToSection === `${sectionName}::${subsectionName}::field` && (
                              <RoomFieldForm
                                fieldLabel={newRoomFieldLabel}
                                setFieldLabel={setNewRoomFieldLabel}
                                fieldType={newRoomFieldType}
                                setFieldType={setNewRoomFieldType}
                                feeNote={newRoomFeeNote}
                                setFeeNote={setNewRoomFeeNote}
                                feeType={newRoomFeeType}
                                setFeeType={setNewRoomFeeType}
                                feeAmount={newRoomFeeAmount}
                                setFeeAmount={setNewRoomFeeAmount}
                                onAdd={() => addRoomBooleanField(sectionName, subsectionName)}
                                onCancel={() => {
                                  setAddingFieldToSection(null);
                                  setNewRoomFieldLabel('');
                                  setNewRoomFieldType('boolean');
                                  setNewRoomFeeNote('');
                                  setNewRoomFeeType('per_use');
                                  setNewRoomFeeAmount('');
                                }}
                                radioName={`room-field-type-${sectionName}-${subsectionName}`}
                                placeholder="输入字段名称，如：牙刷、牙膏、沐浴露"
                              />
                            )}

                            {/* 房型信息基础信息：添加简单字段表单 */}
                            {isRoomInfoCategory && sectionName === '基础信息' && addingFieldToSection === `${sectionName}::main` && !subsectionName && (
                              renderSimpleFieldForm(sectionName, undefined)
                            )}

                            {/* 设施模块：使用专用表单（无二级指标时） */}
                            {isFacilityCategory && canAddCustomFields && !subsectionName && (
                              addingFieldToSection === `${sectionName}::main::field` || 
                              addingFieldToSection === `${sectionName}::main`
                            ) && renderFacilityFieldForm(sectionName, undefined)}

                            {/* 其他类别：原有表单逻辑 */}
                            {!isRoomInfoCategory && !isFacilityCategory && canAddCustomFields && (addingFieldToSection === `${sectionName}::${subsectionName}` || 
                              (addingFieldToSection === `${sectionName}::main` && !subsectionName)) && (
                                usesSimpleFieldForm ? (
                                  renderSimpleFieldForm(sectionName, subsectionName || undefined)
                                ) : (
                                  <div className="mb-3 rounded-2xl border border-blue-100 bg-white/90 shadow-sm">
                                    <div className="p-4 space-y-4">
                                      <div>
                                        <Label className="text-xs font-medium text-gray-700 mb-1.5 block">字段名称</Label>
                                        <Input
                                          placeholder="例如：宠物寄养、鲜花预订、代驾服务"
                                          value={newFieldName}
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFieldName(e.target.value)}
                                          onKeyDown={(e: React.KeyboardEvent) => {
                                            if (e.key === 'Enter' && newFieldName.trim()) {
                                              addCustomField(sectionName, subsectionName || undefined);
                                            }
                                            if (e.key === 'Escape') {
                                              setAddingFieldToSection(null);
                                              setNewFieldName('');
                                              setNewFieldType('boolean');
                                            }
                                          }}
                                          autoFocus
                                          className="bg-white/80"
                                        />
                                      </div>

                                      <div>
                                        <Label className="text-xs font-medium text-gray-700 mb-1.5 block">字段类型</Label>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                          <button
                                            type="button"
                                            onClick={() => setNewFieldType('boolean')}
                                            className={`rounded-2xl border p-3 text-left transition-all ${
                                              newFieldType === 'boolean'
                                                ? 'border-blue-500 bg-blue-50 shadow-[0_8px_20px_rgba(59,130,246,0.18)]'
                                                : 'border-gray-200 bg-white hover:border-blue-300'
                                            }`}
                                          >
                                            <div className="flex items-start gap-3">
                                              <div className={`p-2 rounded-full ${newFieldType === 'boolean' ? 'bg-blue-500/90 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                <ToggleLeft className="h-4 w-4" />
                                              </div>
                                              <div className="space-y-0.5">
                                                <p className={`font-semibold ${newFieldType === 'boolean' ? 'text-blue-700' : 'text-gray-800'}`}>
                                                  简单开关
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                  适用于有/无选项；无需收费信息
                                                </p>
                                              </div>
                                              {newFieldType === 'boolean' && (
                                                <CheckCircle className="ml-auto h-4 w-4 text-blue-500" />
                                              )}
                                            </div>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => setNewFieldType('boolean-with-options')}
                                            className={`rounded-2xl border p-3 text-left transition-all ${
                                              newFieldType === 'boolean-with-options'
                                                ? 'border-blue-500 bg-blue-50 shadow-[0_8px_20px_rgba(59,130,246,0.18)]'
                                                : 'border-gray-200 bg-white hover:border-blue-300'
                                            }`}
                                          >
                                            <div className="flex items-start gap-3">
                                              <div className={`p-2 rounded-full ${newFieldType === 'boolean-with-options' ? 'bg-blue-500/90 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                <Coins className="h-4 w-4" />
                                              </div>
                                              <div className="space-y-0.5">
                                                <p className={`font-semibold ${newFieldType === 'boolean-with-options' ? 'text-blue-700' : 'text-gray-800'}`}>
                                                  带收费选项
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                  支持收费状态、说明及额外备注
                                                </p>
                                              </div>
                                              {newFieldType === 'boolean-with-options' && (
                                                <CheckCircle className="ml-auto h-4 w-4 text-blue-500" />
                                              )}
                                            </div>
                                          </button>
                                        </div>
                                        <div className="mt-3 flex items-start gap-2 rounded-xl bg-blue-50/70 px-3 py-2 text-xs text-blue-800">
                                          <AlertCircle className="mt-0.5 h-3.5 w-3.5" />
                                          <span>
                                            {newFieldType === 'boolean'
                                              ? '适用于简单的有/无选项，如：24小时前台、电梯。'
                                              : '适用于需要说明收费情况的服务，如：礼宾服务、宠物寄养。'}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex flex-col gap-2 pt-1 sm:flex-row">
                                        <Button 
                                          size="sm" 
                                          onClick={() => addCustomField(sectionName, subsectionName || undefined)} 
                                          disabled={!newFieldName.trim()}
                                          className="flex-1"
                                        >
                                          <Plus className="h-3 w-3 mr-1" />
                                          添加字段
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          onClick={() => {
                                            setAddingFieldToSection(null);
                                            setNewFieldName('');
                                            setNewFieldType('boolean');
                                          }}
                                          className="bg-white"
                                        >
                                          取消
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}

                            <div className="space-y-2">
                              {(() => {
                                // 设施模块的二级指标：第一个 boolean 字段作为主开关，其他字段折叠
                                if (isFacilityCategory && subsectionName) {
                                  const mainField = subsectionFields.find((f: DocumentField) => f.type === 'boolean' || f.type === 'boolean-with-options');
                                  const detailFields = subsectionFields.filter((f: DocumentField) => f !== mainField);
                                  const isExpanded = mainField && mainField.value === true;

                                  return (
                                    <>
                                      {mainField && (
                                        <div key={mainField.key}>
                                          {renderField(mainField)}
                                        </div>
                                      )}
                                      {isExpanded && detailFields.map((field: DocumentField) => (
                                        <div key={field.key}>
                                          {renderField(field)}
                                        </div>
                                      ))}
                                    </>
                                  );
                                }
                                
                                // 其他模块：正常渲染所有字段
                                return subsectionFields.map((field: DocumentField) => (
                                  <div key={field.key}>
                                    {renderField(field)}
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              );
            })}

            <div className="p-4 bg-gray-50 rounded-lg text-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-600">分类：</span>
                  <span className="text-gray-900 font-medium">{document.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">最后修改：</span>
                  <span className="text-gray-900">{document.lastModified.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4 gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1 sm:flex-none">
            取消
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()} className="flex-1 sm:flex-none">
            <Save className="mr-2 h-4 w-4" />
            保存{missingFields.length === 0 && '并确认'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
