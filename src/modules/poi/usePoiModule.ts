import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Document, DocumentField, PoiEntry } from '../../components/DocumentManager';

const POI_BASE_SECTIONS = ['交通', '景点', '美食', '购物'];

const collectCustomSections = (fields: DocumentField[]) => {
  const baseSections = new Set(POI_BASE_SECTIONS);
  const names = new Set<string>();

  fields.forEach(field => {
    if (field.section && !baseSections.has(field.section)) {
      names.add(field.section);
    }
  });

  return Array.from(names);
};

export const asPoiEntries = (value: DocumentField['value']): PoiEntry[] =>
  Array.isArray(value) ? (value as PoiEntry[]) : [];

interface UsePoiModuleParams {
  document: Document;
  fields: DocumentField[];
  setFields: Dispatch<SetStateAction<DocumentField[]>>;
  setOpenSections: Dispatch<SetStateAction<Set<string>>>;
  isActive: boolean;
}

export interface PoiModuleResult {
  isActive: boolean;
  customSections: string[];
  newSectionName: string;
  setNewSectionName: Dispatch<SetStateAction<string>>;
  addSection: () => void;
  removeSection: (sectionName: string) => void;
  addEntry: (fieldKey: string) => void;
  updateEntry: (fieldKey: string, entryId: string, updates: Partial<PoiEntry>) => void;
  removeEntry: (fieldKey: string, entryId: string) => void;
}

const createPoiEntryId = (fieldKey: string) =>
  `${fieldKey}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export const usePoiModule = ({
  document,
  fields,
  setFields,
  setOpenSections,
  isActive,
}: UsePoiModuleParams): PoiModuleResult => {
  const [customSections, setCustomSections] = useState<string[]>(() =>
    isActive ? collectCustomSections(document.fields) : []
  );
  const [newSectionName, setNewSectionName] = useState('');

  useEffect(() => {
    if (!isActive) {
      setCustomSections([]);
      setNewSectionName('');
      return;
    }
    setCustomSections(collectCustomSections(document.fields));
  }, [document, isActive]);

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
      window.alert('该模块已存在，请更换名称');
      return;
    }

    const newField: DocumentField = {
      key: `poi_custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      label: sectionName,
      value: [],
      required: false,
      type: 'poi-list',
      section: sectionName,
      isCustom: true,
    };

    setFields(prev => [...prev, newField]);
    setCustomSections(prev => [...prev, sectionName]);
    setNewSectionName('');
    setOpenSections(prev => {
      const updated = new Set(prev);
      updated.add(sectionName);
      return updated;
    });
  };

  const removeSection = (sectionName: string) => {
    if (!isActive) return;
    setFields(prevFields => prevFields.filter(field => field.section !== sectionName));
    setCustomSections(prev => prev.filter(name => name !== sectionName));
  };

  const addEntry = (fieldKey: string) => {
    if (!isActive) return;
    setFields(prevFields =>
      prevFields.map(field => {
        if (field.key !== fieldKey) return field;
        const entries = asPoiEntries(field.value);
        const newEntry: PoiEntry = {
          id: createPoiEntryId(fieldKey),
          tag: '',
          name: '',
          distance: '',
        };
        return {
          ...field,
          value: [...entries, newEntry],
        };
      })
    );
  };

  const updateEntry = (fieldKey: string, entryId: string, updates: Partial<PoiEntry>) => {
    if (!isActive) return;
    setFields(prevFields =>
      prevFields.map(field => {
        if (field.key !== fieldKey) return field;
        const entries = asPoiEntries(field.value);
        return {
          ...field,
          value: entries.map(entry => (entry.id === entryId ? { ...entry, ...updates } : entry)),
        };
      })
    );
  };

  const removeEntry = (fieldKey: string, entryId: string) => {
    if (!isActive) return;
    setFields(prevFields =>
      prevFields.map(field => {
        if (field.key !== fieldKey) return field;
        const entries = asPoiEntries(field.value);
        return {
          ...field,
          value: entries.filter(entry => entry.id !== entryId),
        };
      })
    );
  };

  return {
    isActive,
    customSections,
    newSectionName,
    setNewSectionName,
    addSection,
    removeSection,
    addEntry,
    updateEntry,
    removeEntry,
  };
};
