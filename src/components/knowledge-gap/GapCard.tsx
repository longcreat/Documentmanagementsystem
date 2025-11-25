import { Bot, CheckCircle, AlertCircle, Clock, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { KnowledgeGap, PriorityLevel, KnowledgeGapStatus } from './types';

interface GapCardProps {
  gap: KnowledgeGap;
  onProcess: (gap: KnowledgeGap) => void;
  onEditCategory: (gap: KnowledgeGap) => void;
  onViewRecord: (gap: KnowledgeGap) => void;
}

// 优先级指示器（左侧竖条）
function getPriorityColor(priority: PriorityLevel) {
  const colors = {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-gray-300',
  };
  return colors[priority];
}

// 状态配置
function getStatusConfig(status: KnowledgeGapStatus) {
  const config = {
    pending: { label: '待处理', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    resolved: { label: '已处理', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    ignored: { label: '已忽略', bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' },
  };
  return config[status];
}

export function GapCard({ gap, onProcess, onEditCategory, onViewRecord }: GapCardProps) {
  const isPending = gap.status === 'pending';
  const statusConfig = getStatusConfig(gap.status);
  
  const category = gap.confirmedCategory || gap.suggestedCategory;
  const section = gap.confirmedSection || gap.suggestedSection;
  const subsection = gap.confirmedSubsection || gap.suggestedSubsection;

  return (
    <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* 左侧优先级指示条 */}
      <div className={`w-1 ${getPriorityColor(gap.priorityLevel)} shrink-0`} />
      
      {/* 主内容区 */}
      <div className="flex-1 p-4">
        {/* 顶部：状态 + 时间 */}
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
            {statusConfig.label}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {gap.lastAskedAt}
          </span>
        </div>

        {/* 问题标题 */}
        <h3 className="text-sm font-medium text-gray-900 mb-2 leading-snug">
          {gap.question}
        </h3>

        {/* 分类路径 */}
        {category && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            {gap.confirmedCategory ? (
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            ) : gap.recommendationLevel === 'ai_recommended' ? (
              <Bot className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            )}
            <span className="truncate">
              {category}
              {section && ` / ${section}`}
              {subsection && ` / ${subsection}`}
            </span>
          </div>
        )}

        {/* 处理结果（仅已处理状态显示） */}
        {gap.resolution && !isPending && (
          <p className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded mt-2 line-clamp-1">
            {gap.resolution}
          </p>
        )}
      </div>

      {/* 右侧操作区 */}
      <div className="flex items-center px-4 border-l border-gray-100 bg-gray-50/50">
        {isPending ? (
          <div className="flex flex-col gap-2">
            <Button size="sm" onClick={() => onProcess(gap)}>
              处理
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEditCategory(gap)}>
              改分类
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => onViewRecord(gap)}>
            详情
          </Button>
        )}
      </div>
    </div>
  );
}
