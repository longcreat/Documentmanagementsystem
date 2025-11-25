import { useState, useMemo, useEffect, useCallback } from 'react';
import { KnowledgeGap, KnowledgeGapStatus, CategoryEditState } from '../../components/knowledge-gap/types';
import { DocumentCategory } from '../../components/DocumentManager';
import { DOCUMENT_STRUCTURE } from '../../constants/documentStructure';

// Mock 数据
const mockGaps: KnowledgeGap[] = [
  {
    id: '1',
    question: '健身房开放时间',
    questionTheme: '健身房开放时间',
    aiResponse: '抱歉，关于健身房的开放时间，我暂时无法查询到。',
    status: 'pending',
    priorityLevel: 'high',
    frequencyDescription: '近期被多名住客反复提问',
    lastAskedAt: '2024-01-22 09:15',
    suggestedCategory: '设施信息',
    suggestedSection: '运动设施',
    suggestedSubsection: '健身室',
    recommendationLevel: 'ai_recommended',
    conversationSnippet: [
      { role: 'user', content: '健身房几点开门？' },
      { role: 'assistant', content: '抱歉，关于健身房的开放时间，我暂时无法查询到。' },
    ],
  },
  {
    id: '2',
    question: '可以预订景点门票吗',
    questionTheme: '景点门票预订',
    aiResponse: '抱歉，我暂时没有找到相关信息。',
    status: 'pending',
    priorityLevel: 'medium',
    lastAskedAt: '2024-01-22 14:30',
    suggestedCategory: '政策信息',
    suggestedSection: '前台服务',
    recommendationLevel: 'need_confirm',
  },
  {
    id: '3',
    question: '酒店是否提供宠物寄养服务',
    questionTheme: '宠物寄养服务',
    aiResponse: '抱歉，我暂时没有找到关于酒店宠物寄养服务的相关信息。',
    status: 'pending',
    priorityLevel: 'medium',
    lastAskedAt: '2024-01-22 11:20',
    recommendationLevel: 'need_manual',
  },
  {
    id: '4',
    question: 'SPA营业时间',
    questionTheme: 'SPA营业时间',
    status: 'resolved',
    priorityLevel: 'low',
    lastAskedAt: '2024-01-20 16:45',
    confirmedCategory: '设施信息',
    confirmedSection: '康体设施',
    recommendationLevel: 'ai_recommended',
    resolvedAt: '2024-01-21 10:00',
    resolution: '已补充到设施信息-康体设施-SPA模块',
  },
];

export interface UseKnowledgeGapModuleResult {
  // 数据
  gaps: KnowledgeGap[];
  filteredGaps: KnowledgeGap[];
  
  // 筛选状态
  activeStatus: 'all' | KnowledgeGapStatus;
  setActiveStatus: (status: 'all' | KnowledgeGapStatus) => void;
  
  // 选中的缺口（用于编辑）
  selectedGap: KnowledgeGap | null;
  setSelectedGap: (gap: KnowledgeGap | null) => void;
  
  // 分类编辑状态
  editState: CategoryEditState;
  setEditCategory: (category: DocumentCategory | '') => void;
  setEditSection: (section: string) => void;
  setEditSubsection: (subsection: string) => void;
  
  // 可用选项
  availableSections: { name: string; subsections?: string[] }[];
  availableSubsections: string[];
  
  // 操作
  updateGapCategory: (gapId: string, category: DocumentCategory, section: string, subsection?: string) => void;
  resolveGap: (gapId: string, resolution: string) => void;
  ignoreGap: (gapId: string) => void;
  
  // 统计
  stats: {
    total: number;
    pending: number;
    resolved: number;
    ignored: number;
  };
}

export function useKnowledgeGapModule(): UseKnowledgeGapModuleResult {
  const [gaps, setGaps] = useState<KnowledgeGap[]>(mockGaps);
  const [activeStatus, setActiveStatus] = useState<'all' | KnowledgeGapStatus>('all');
  const [selectedGap, setSelectedGap] = useState<KnowledgeGap | null>(null);
  
  // 分类编辑状态
  const [editCategory, setEditCategory] = useState<DocumentCategory | ''>('');
  const [editSection, setEditSection] = useState<string>('');
  const [editSubsection, setEditSubsection] = useState<string>('');

  // 筛选后的缺口
  const filteredGaps = useMemo(() => {
    return gaps.filter((gap) =>
      activeStatus === 'all' ? true : gap.status === activeStatus
    );
  }, [gaps, activeStatus]);

  // 统计数据
  const stats = useMemo(() => ({
    total: gaps.length,
    pending: gaps.filter(g => g.status === 'pending').length,
    resolved: gaps.filter(g => g.status === 'resolved').length,
    ignored: gaps.filter(g => g.status === 'ignored').length,
  }), [gaps]);

  // 可用章节
  const availableSections = useMemo(() => {
    if (!editCategory) return [];
    const categoryStruct = DOCUMENT_STRUCTURE.find((item) => item.key === editCategory);
    return categoryStruct?.sections ?? [];
  }, [editCategory]);

  // 可用子章节
  const availableSubsections = useMemo(() => {
    if (!editCategory || !editSection) return [];
    const categoryStruct = DOCUMENT_STRUCTURE.find((item) => item.key === editCategory);
    const sectionStruct = categoryStruct?.sections.find((section) => section.name === editSection);
    return sectionStruct?.subsections ?? [];
  }, [editCategory, editSection]);

  // 当选中缺口变化时，初始化编辑状态
  useEffect(() => {
    if (!selectedGap) {
      setEditCategory('');
      setEditSection('');
      setEditSubsection('');
      return;
    }

    const initialCategory = selectedGap.confirmedCategory || selectedGap.suggestedCategory || '';
    setEditCategory(initialCategory);
    setEditSection(selectedGap.confirmedSection || selectedGap.suggestedSection || '');
    setEditSubsection(selectedGap.confirmedSubsection || selectedGap.suggestedSubsection || '');
  }, [selectedGap]);

  // 当分类变化时，重置章节
  useEffect(() => {
    if (!editCategory) {
      setEditSection('');
      setEditSubsection('');
      return;
    }

    const categoryStruct = DOCUMENT_STRUCTURE.find((item) => item.key === editCategory);
    const hasSection = categoryStruct?.sections.some((section) => section.name === editSection);
    if (!hasSection) {
      setEditSection('');
      setEditSubsection('');
    }
  }, [editCategory]);

  // 当章节变化时，重置子章节
  useEffect(() => {
    if (!editSection) {
      setEditSubsection('');
      return;
    }

    const sectionStruct = availableSections.find((section) => section.name === editSection);
    const hasSubsection = sectionStruct?.subsections?.some((name) => name === editSubsection);
    if (sectionStruct?.subsections && sectionStruct.subsections.length > 0 && !hasSubsection) {
      setEditSubsection('');
    }
  }, [editSection, availableSections]);

  // 更新缺口分类
  const updateGapCategory = useCallback((
    gapId: string,
    category: DocumentCategory,
    section: string,
    subsection?: string
  ) => {
    setGaps((prev) => prev.map((gap) => {
      if (gap.id !== gapId) return gap;
      return {
        ...gap,
        confirmedCategory: category,
        confirmedSection: section,
        confirmedSubsection: subsection,
      };
    }));
  }, []);

  // 解决缺口
  const resolveGap = useCallback((gapId: string, resolution: string) => {
    setGaps((prev) => prev.map((gap) => {
      if (gap.id !== gapId) return gap;
      return {
        ...gap,
        status: 'resolved',
        resolvedAt: new Date().toISOString(),
        resolution,
      };
    }));
  }, []);

  // 忽略缺口
  const ignoreGap = useCallback((gapId: string) => {
    setGaps((prev) => prev.map((gap) => {
      if (gap.id !== gapId) return gap;
      return {
        ...gap,
        status: 'ignored',
      };
    }));
  }, []);

  return {
    gaps,
    filteredGaps,
    activeStatus,
    setActiveStatus,
    selectedGap,
    setSelectedGap,
    editState: {
      category: editCategory,
      section: editSection,
      subsection: editSubsection,
    },
    setEditCategory,
    setEditSection,
    setEditSubsection,
    availableSections,
    availableSubsections,
    updateGapCategory,
    resolveGap,
    ignoreGap,
    stats,
  };
}
