import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Document, DocumentField } from '../../components/DocumentManager';

const collectCustomSections = (fields: DocumentField[]) => {
  const baseSections = new Set([
    '前台服务',
    '公共区',
    '商务服务',
    '无障碍设施服务',
    '娱乐设施',
    '交通服务',
    '亲子设施',
    '康体设施',
    '餐饮服务',
    '运动设施',
    '清洁服务',
    '安全与安保',
  ]);
  const names = new Set<string>();

  fields.forEach(field => {
    if (field.section && !baseSections.has(field.section)) {
      names.add(field.section);
    }
  });

  return Array.from(names);
};

interface UseFacilityModuleParams {
  document: Document;
  fields: DocumentField[];
  setFields: Dispatch<SetStateAction<DocumentField[]>>;
  setOpenSections: Dispatch<SetStateAction<Set<string>>>;
  addingFieldToSection: string | null;
  setAddingFieldToSection: Dispatch<SetStateAction<string | null>>;
  isActive: boolean;
}

// 字段类型
type FieldType = 'boolean' | 'key-value';
// 收费状态
type FeeStatus = 'free' | 'charged';

export interface FacilityModuleResult {
  isActive: boolean;
  customSections: string[];
  newSectionName: string;
  setNewSectionName: Dispatch<SetStateAction<string>>;
  newFieldLabel: string;
  setNewFieldLabel: Dispatch<SetStateAction<string>>;
  newFieldValue: string;
  setNewFieldValue: Dispatch<SetStateAction<string>>;
  // 新增字段类型和收费相关状态
  newFieldType: FieldType;
  setNewFieldType: Dispatch<SetStateAction<FieldType>>;
  newFeeStatus: FeeStatus;
  setNewFeeStatus: Dispatch<SetStateAction<FeeStatus>>;
  newFeeType: string;
  setNewFeeType: Dispatch<SetStateAction<string>>;
  newFeeAmount: string;
  setNewFeeAmount: Dispatch<SetStateAction<string>>;
  newFeeNote: string;
  setNewFeeNote: Dispatch<SetStateAction<string>>;
  // 二级指标相关
  newSubsectionName: string;
  setNewSubsectionName: Dispatch<SetStateAction<string>>;
  addSubsection: (section: string) => void;
  addSection: () => void;
  removeSection: (sectionName: string) => void;
  addSimpleField: (section: string, subsection?: string) => void;
  addFacilityField: (section: string, subsection?: string) => void;
  resetSimpleFieldInputs: () => void;
}

export const useFacilityModule = ({
  document,
  fields,
  setFields,
  setOpenSections,
  addingFieldToSection,
  setAddingFieldToSection,
  isActive,
}: UseFacilityModuleParams): FacilityModuleResult => {
  const [customSections, setCustomSections] = useState<string[]>(() =>
    isActive ? collectCustomSections(document.fields) : []
  );
  const [newSectionName, setNewSectionName] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  // 新增字段类型和收费相关状态
  const [newFieldType, setNewFieldType] = useState<FieldType>('boolean');
  const [newFeeStatus, setNewFeeStatus] = useState<FeeStatus>('free');
  const [newFeeType, setNewFeeType] = useState('per_use');
  const [newFeeAmount, setNewFeeAmount] = useState('');
  const [newFeeNote, setNewFeeNote] = useState('');
  // 二级指标相关
  const [newSubsectionName, setNewSubsectionName] = useState('');

  useEffect(() => {
    if (!isActive) {
      setCustomSections([]);
      return;
    }
    setCustomSections(collectCustomSections(document.fields));
  }, [document, isActive]);

  useEffect(() => {
    if (!isActive) return;
    resetSimpleFieldInputs();
  }, [addingFieldToSection, isActive]);

  const resetSimpleFieldInputs = () => {
    setNewFieldLabel('');
    setNewFieldValue('');
    setNewFieldType('boolean');
    setNewFeeStatus('free');
    setNewFeeType('per_use');
    setNewFeeAmount('');
    setNewFeeNote('');
  };

  const addSection = () => {
    if (!isActive) return;
    const sectionName = newSectionName.trim();
    if (!sectionName) return;

    const names = new Set<string>();
    fields.forEach(field => {
      if (field.section) names.add(field.section);
    });
    customSections.forEach(name => names.add(name));

    if (names.has(sectionName)) {
      window.alert('Module already exists. Please choose another name.');
      return;
    }

    setCustomSections(prev => [...prev, sectionName]);
    setNewSectionName('');
    setAddingFieldToSection(`${sectionName}::main`);
    setOpenSections(prev => {
      const updated = new Set(prev);
      updated.add(sectionName);
      return updated;
    });
  };

  const removeSection = (sectionName: string) => {
    if (!isActive) return;
    if (!window.confirm(`Delete module "${sectionName}" and its fields?`)) return;

    setFields(prevFields => prevFields.filter(field => field.section !== sectionName));
    setCustomSections(prev => prev.filter(name => name !== sectionName));
  };

  // 添加二级指标
  const addSubsection = (section: string) => {
    if (!isActive) return;
    const subsectionName = newSubsectionName.trim();
    if (!subsectionName) return;

    // 检查是否已存在同名二级指标
    const existingSubsections = new Set<string>();
    fields.forEach(field => {
      if (field.section === section && field.subsection) {
        existingSubsections.add(field.subsection);
      }
    });

    if (existingSubsections.has(subsectionName)) {
      window.alert('该二级指标已存在，请使用其他名称');
      return;
    }

    // 创建一个占位字段来建立二级指标
    const placeholderField: DocumentField = {
      key: `facility_subsection_${Date.now()}`,
      label: '请添加字段',
      value: false,
      required: false,
      type: 'boolean',
      section,
      subsection: subsectionName,
      isCustom: true,
    };

    setFields(prev => [...prev, placeholderField]);
    setNewSubsectionName('');
    setAddingFieldToSection(`${section}::${subsectionName}::field`);
  };

  const addSimpleField = (section: string, subsection?: string) => {
    if (!isActive) return;
    if (!newFieldLabel.trim()) return;

    const newField: DocumentField = {
      key: `custom_${Date.now()}`,
      label: newFieldLabel.trim(),
      value: newFieldValue.trim(),
      required: false,
      type: 'text',
      section,
      subsection,
      isCustom: true,
    };

    setFields(prev => [...prev, newField]);
    resetSimpleFieldInputs();
    setAddingFieldToSection(null);
  };

  // 添加设施字段（支持 boolean 和 key-value 两种类型，都支持收费配置）
  const addFacilityField = (section: string, subsection?: string) => {
    if (!isActive) return;
    if (!newFieldLabel.trim()) return;

    // 组合收费信息
    let feeNoteValue = '';
    if (newFeeStatus === 'charged' && newFeeAmount.trim()) {
      feeNoteValue = newFeeNote.trim() 
        ? `${newFeeAmount.trim()}，${newFeeNote.trim()}`
        : newFeeAmount.trim();
    }

    const newField: DocumentField = {
      key: `custom_${Date.now()}`,
      label: newFieldLabel.trim(),
      value: newFieldType === 'boolean' ? false : newFieldValue.trim(),
      required: false,
      type: newFieldType === 'boolean' ? 'boolean-with-options' : 'text',
      section,
      subsection,
      isCustom: true,
      feeStatus: newFeeStatus === 'charged' ? 'charged' : 'free',
      feeNote: feeNoteValue,
      additionalNote: newFeeStatus === 'charged' ? newFeeType : '',
    };

    setFields(prev => [...prev, newField]);
    resetSimpleFieldInputs();
    setAddingFieldToSection(null);
  };

  return {
    isActive,
    customSections,
    newSectionName,
    setNewSectionName,
    newFieldLabel,
    setNewFieldLabel,
    newFieldValue,
    setNewFieldValue,
    newFieldType,
    setNewFieldType,
    newFeeStatus,
    setNewFeeStatus,
    newFeeType,
    setNewFeeType,
    newFeeAmount,
    setNewFeeAmount,
    newFeeNote,
    setNewFeeNote,
    newSubsectionName,
    setNewSubsectionName,
    addSubsection,
    addSection,
    removeSection,
    addSimpleField,
    addFacilityField,
    resetSimpleFieldInputs,
  };
};
