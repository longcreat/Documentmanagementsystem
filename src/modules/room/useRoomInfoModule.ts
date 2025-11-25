import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Document, DocumentField } from '../../components/DocumentManager';

const collectCustomSections = (fields: DocumentField[], baseSections: string[]) => {
  const baseSet = new Set([...baseSections, '房型名称']);
  const names = new Set<string>();

  fields.forEach(field => {
    if (field.section && !baseSet.has(field.section)) {
      names.add(field.section);
    }
  });

  return Array.from(names);
};

interface UseRoomInfoModuleParams {
  document: Document;
  fields: DocumentField[];
  setFields: Dispatch<SetStateAction<DocumentField[]>>;
  setOpenSections: Dispatch<SetStateAction<Set<string>>>;
  addingFieldToSection: string | null;
  setAddingFieldToSection: Dispatch<SetStateAction<string | null>>;
  isActive: boolean;
  baseSections: string[];
}

export interface RoomInfoModuleResult {
  isActive: boolean;
  customSections: string[];
  customSubsections: Record<string, string[]>;
  newSectionName: string;
  setNewSectionName: Dispatch<SetStateAction<string>>;
  newSubsectionName: string;
  setNewSubsectionName: Dispatch<SetStateAction<string>>;
  newFieldLabel: string;
  setNewFieldLabel: Dispatch<SetStateAction<string>>;
  newFieldValue: string;
  setNewFieldValue: Dispatch<SetStateAction<string>>;
  newFieldType: 'boolean' | 'boolean-with-options';
  setNewFieldType: Dispatch<SetStateAction<'boolean' | 'boolean-with-options'>>;
  newFeeNote: string;
  setNewFeeNote: Dispatch<SetStateAction<string>>;
  newFeeType: string;
  setNewFeeType: Dispatch<SetStateAction<string>>;
  newFeeAmount: string;
  setNewFeeAmount: Dispatch<SetStateAction<string>>;
  addSection: () => void;
  removeSection: (sectionName: string) => void;
  addSubsection: (section: string) => void;
  removeSubsection: (section: string, subsection: string) => void;
  addSimpleField: (section: string, subsection?: string) => void;
  addBooleanField: (section: string, subsection: string) => void;
  resetSimpleFieldInputs: () => void;
}

export const useRoomInfoModule = ({
  document,
  fields,
  setFields,
  setOpenSections,
  addingFieldToSection,
  setAddingFieldToSection,
  isActive,
  baseSections,
}: UseRoomInfoModuleParams): RoomInfoModuleResult => {
  const [customSections, setCustomSections] = useState<string[]>(() =>
    isActive ? collectCustomSections(document.fields, baseSections) : []
  );
  const [customSubsections, setCustomSubsections] = useState<Record<string, string[]>>(() => {
    if (!isActive) return {};
    const map: Record<string, string[]> = {};
    document.fields.forEach(field => {
      if (!field.section || field.section === '房型名称' || field.section === '基础信息') return;
      if (!field.subsection) return;
      if (!map[field.section]) map[field.section] = [];
      if (!map[field.section].includes(field.subsection)) {
        map[field.section].push(field.subsection);
      }
    });
    return map;
  });
  const [newSectionName, setNewSectionName] = useState('');
  const [newSubsectionName, setNewSubsectionName] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [newFieldType, setNewFieldType] = useState<'boolean' | 'boolean-with-options'>('boolean');
  const [newFeeNote, setNewFeeNote] = useState('');
  const [newFeeType, setNewFeeType] = useState('per_use');
  const [newFeeAmount, setNewFeeAmount] = useState('');

  useEffect(() => {
    if (!isActive) {
      setCustomSections([]);
      setCustomSubsections({});
      return;
    }
    setCustomSections(collectCustomSections(document.fields, baseSections));
    // Collect custom subsections
    const map: Record<string, string[]> = {};
    document.fields.forEach(field => {
      if (!field.section || field.section === '房型名称' || field.section === '基础信息') return;
      if (!field.subsection) return;
      if (!map[field.section]) map[field.section] = [];
      if (!map[field.section].includes(field.subsection)) {
        map[field.section].push(field.subsection);
      }
    });
    setCustomSubsections(map);
  }, [document, isActive, baseSections]);

  useEffect(() => {
    if (!isActive) return;
    setNewFieldLabel('');
    setNewFieldValue('');
    setNewSubsectionName('');
    setNewFieldType('boolean');
    setNewFeeNote('');
    setNewFeeType('per_use');
    setNewFeeAmount('');
  }, [addingFieldToSection, isActive]);

  const resetSimpleFieldInputs = () => {
    setNewFieldLabel('');
    setNewFieldValue('');
    setNewSubsectionName('');
    setNewFieldType('boolean');
    setNewFeeNote('');
    setNewFeeType('per_use');
    setNewFeeAmount('');
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
    baseSections.forEach(name => names.add(name));
    names.add('房型名称');

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
    setCustomSubsections(prev => {
      const updated = { ...prev };
      delete updated[sectionName];
      return updated;
    });
  };

  const addSubsection = (section: string) => {
    if (!isActive) return;
    const subsectionName = newSubsectionName.trim();
    if (!subsectionName) return;

    // Check if subsection already exists
    const existingSubs = customSubsections[section] || [];
    const fieldsInSection = fields.filter(f => f.section === section);
    const allSubs = new Set([...existingSubs, ...fieldsInSection.map(f => f.subsection).filter(Boolean)]);
    
    if (allSubs.has(subsectionName)) {
      window.alert('该二级指标已存在，请更换名称');
      return;
    }

    setCustomSubsections(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), subsectionName]
    }));
    setNewSubsectionName('');
    setAddingFieldToSection(`${section}::${subsectionName}::field`);
    setOpenSections(prev => {
      const updated = new Set(prev);
      updated.add(section);
      return updated;
    });
  };

  const removeSubsection = (section: string, subsection: string) => {
    if (!isActive) return;
    if (!window.confirm(`删除二级指标 "${subsection}" 及其所有字段？`)) return;

    setFields(prevFields => prevFields.filter(field => 
      !(field.section === section && field.subsection === subsection)
    ));
    setCustomSubsections(prev => ({
      ...prev,
      [section]: (prev[section] || []).filter(name => name !== subsection)
    }));
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

  const addBooleanField = (section: string, subsection: string) => {
    if (!isActive) return;
    if (!newFieldLabel.trim()) return;

    // 构建收费说明：收费方式 + 金额 + 备注
    let feeDescription = '';
    if (newFieldType === 'boolean-with-options') {
      const feeTypeLabels: Record<string, string> = {
        per_use: '按次',
        per_hour: '按时',
        per_day: '按天',
        per_quantity: '按量',
        other: '其他',
      };
      const parts: string[] = [];
      if (newFeeType) parts.push(feeTypeLabels[newFeeType] || newFeeType);
      if (newFeeAmount.trim()) parts.push(newFeeAmount.trim());
      if (newFeeNote.trim()) parts.push(newFeeNote.trim());
      feeDescription = parts.join('，');
    }

    const newField: DocumentField = {
      key: `custom_${Date.now()}`,
      label: newFieldLabel.trim(),
      value: false,
      required: false,
      type: newFieldType,
      section,
      subsection,
      isCustom: true,
      ...(newFieldType === 'boolean-with-options' ? {
        feeStatus: 'charged' as const,
        feeNote: feeDescription,
        additionalNote: ''
      } : {})
    };

    setFields(prev => [...prev, newField]);
    resetSimpleFieldInputs();
    setAddingFieldToSection(null);
  };

  return {
    isActive,
    customSections,
    customSubsections,
    newSectionName,
    setNewSectionName,
    newSubsectionName,
    setNewSubsectionName,
    newFieldLabel,
    setNewFieldLabel,
    newFieldValue,
    setNewFieldValue,
    newFieldType,
    setNewFieldType,
    newFeeNote,
    setNewFeeNote,
    newFeeType,
    setNewFeeType,
    newFeeAmount,
    setNewFeeAmount,
    addSection,
    removeSection,
    addSubsection,
    removeSubsection,
    addSimpleField,
    addBooleanField,
    resetSimpleFieldInputs,
  };
};
