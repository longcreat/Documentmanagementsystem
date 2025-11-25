import { DocumentCategory } from '../DocumentManager';

// 对话片段
export interface ConversationSnippet {
  role: 'user' | 'assistant';
  content: string;
}

// 知识缺口状态
export type KnowledgeGapStatus = 'pending' | 'resolved' | 'ignored';

// AI 推荐级别
export type RecommendationLevel = 'ai_recommended' | 'need_confirm' | 'need_manual';

// 优先级
export type PriorityLevel = 'high' | 'medium' | 'low';

// 知识缺口数据结构
export interface KnowledgeGap {
  id: string;
  question: string;
  questionTheme?: string;
  aiResponse?: string;
  status: KnowledgeGapStatus;
  priorityLevel: PriorityLevel;
  frequencyDescription?: string;
  lastAskedAt: string;
  suggestedCategory?: DocumentCategory;
  suggestedSection?: string;
  suggestedSubsection?: string;
  recommendationLevel: RecommendationLevel;
  confirmedCategory?: DocumentCategory;
  confirmedSection?: string;
  confirmedSubsection?: string;
  conversationSnippet?: ConversationSnippet[];
  // 处理记录
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
}

// 状态筛选选项
export interface StatusFilter {
  key: 'all' | KnowledgeGapStatus;
  label: string;
}

// 分类编辑状态
export interface CategoryEditState {
  category: DocumentCategory | '';
  section: string;
  subsection: string;
}
