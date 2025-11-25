import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Document, DocumentField } from '../../components/DocumentManager';

const POLICY_BASE_SECTIONS = [
  '入离时间',
  '预订提示',
  '入住提示',
  '年龄限制',
  '宠物',
  '服务型动物',
  '支付方式',
  '早餐',
  '儿童入住及加床政策',
];

const collectCustomSections = (fields: DocumentField[]) => {
  const baseSet = new Set(POLICY_BASE_SECTIONS);
  const names = new Set<string>();

  fields.forEach(field => {
    if (field.section && !baseSet.has(field.section)) {
      names.add(field.section);
    }
  });

  return Array.from(names);
};

interface UsePolicyModuleParams {
  document: Document;
  fields: DocumentField[];
  setFields: Dispatch<SetStateAction<DocumentField[]>>;
  setOpenSections: Dispatch<SetStateAction<Set<string>>>;
  addingFieldToSection: string | null;
  setAddingFieldToSection: Dispatch<SetStateAction<string | null>>;
  isActive: boolean;
}

export interface PolicyModuleResult {
  isActive: boolean;
  customSections: string[];
  newSectionName: string;
  setNewSectionName: Dispatch<SetStateAction<string>>;
  newFieldLabel: string;
  setNewFieldLabel: Dispatch<SetStateAction<string>>;
  newFieldValue: string;
  setNewFieldValue: Dispatch<SetStateAction<string>>;
  addSection: () => void;
  removeSection: (sectionName: string) => void;
  addSimpleField: (section: string, subsection?: string) => void;
  resetSimpleFieldInputs: () => void;
}

export const usePolicyModule = ({
  document,
  fields,
  setFields,
  setOpenSections,
  addingFieldToSection,
  setAddingFieldToSection,
  isActive,
}: UsePolicyModuleParams): PolicyModuleResult => {
  const [customSections, setCustomSections] = useState<string[]>(() =>
    isActive ? collectCustomSections(document.fields) : []
  );
  const [newSectionName, setNewSectionName] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  useEffect(() => {
    if (!isActive) {
      setCustomSections([]);
      return;
    }
    setCustomSections(collectCustomSections(document.fields));
  }, [document, isActive]);

  useEffect(() => {
    if (!isActive) return;
    setNewFieldLabel('');
    setNewFieldValue('');
  }, [addingFieldToSection, isActive]);

  const resetSimpleFieldInputs = () => {
    setNewFieldLabel('');
    setNewFieldValue('');
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
    POLICY_BASE_SECTIONS.forEach(name => names.add(name));

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

  return {
    isActive,
    customSections,
    newSectionName,
    setNewSectionName,
    newFieldLabel,
    setNewFieldLabel,
    newFieldValue,
    setNewFieldValue,
    addSection,
    removeSection,
    addSimpleField,
    resetSimpleFieldInputs,
  };
};
