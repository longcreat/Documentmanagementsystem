import { Card } from '../ui/card';
import { Bot } from 'lucide-react';
import { KnowledgeGap } from './types';
import { GapCard } from './GapCard';

interface GapListProps {
  gaps: KnowledgeGap[];
  onProcess: (gap: KnowledgeGap) => void;
  onEditCategory: (gap: KnowledgeGap) => void;
  onViewRecord: (gap: KnowledgeGap) => void;
}

export function GapList({ gaps, onProcess, onEditCategory, onViewRecord }: GapListProps) {
  if (gaps.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Bot className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">此分类下暂无知识缺口</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {gaps.map((gap) => (
        <GapCard
          key={gap.id}
          gap={gap}
          onProcess={onProcess}
          onEditCategory={onEditCategory}
          onViewRecord={onViewRecord}
        />
      ))}
    </div>
  );
}
