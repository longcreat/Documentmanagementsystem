import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useKnowledgeGapModule } from '../modules/knowledge-gap/useKnowledgeGapModule';
import {
  KnowledgeGap,
  KnowledgeGapStatus,
  GapList,
  CategoryEditDialog,
  GapRecordDialog,
  ProcessGapDialog,
} from './knowledge-gap';
import { DocumentCategory } from './DocumentManager';

// 重新导出类型供外部使用
export type { KnowledgeGapStatus, KnowledgeGap };
export type { RecommendationLevel, PriorityLevel } from './knowledge-gap/types';

const STATUS_FILTERS = [
  { key: 'all' as const, label: '全部问题' },
  { key: 'pending' as const, label: '待处理' },
  { key: 'resolved' as const, label: '已处理' },
  { key: 'ignored' as const, label: '已忽略' },
];

export function KnowledgeGapManager() {
  const {
    filteredGaps,
    activeStatus,
    setActiveStatus,
    selectedGap,
    setSelectedGap,
    editState,
    setEditCategory,
    setEditSection,
    setEditSubsection,
    availableSections,
    availableSubsections,
    updateGapCategory,
    resolveGap,
    ignoreGap,
    stats,
  } = useKnowledgeGapModule();

  // 处理弹窗状态
  const [processingGap, setProcessingGap] = useState<KnowledgeGap | null>(null);
  const [viewingGap, setViewingGap] = useState<KnowledgeGap | null>(null);

  // 处理去处理按钮
  const handleProcess = (gap: KnowledgeGap) => {
    setProcessingGap(gap);
  };

  // 处理修改分类按钮
  const handleEditCategory = (gap: KnowledgeGap) => {
    setSelectedGap(gap);
  };

  // 处理查看记录按钮
  const handleViewRecord = (gap: KnowledgeGap) => {
    setViewingGap(gap);
  };

  // 确认分类修改
  const handleConfirmCategory = () => {
    if (!selectedGap || !editState.category || !editState.section) return;
    
    updateGapCategory(
      selectedGap.id,
      editState.category as DocumentCategory,
      editState.section,
      editState.subsection || undefined
    );
    setSelectedGap(null);
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs 
        value={activeStatus} 
        onValueChange={(v: string) => setActiveStatus(v as 'all' | KnowledgeGapStatus)} 
        className="flex-1 flex flex-col"
      >
        <TabsList className="flex-wrap h-auto">
          {STATUS_FILTERS.map((filter) => (
            <TabsTrigger key={filter.key} value={filter.key}>
              {filter.label}
              <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                {filter.key === 'all' ? stats.total : stats[filter.key]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {STATUS_FILTERS.map((filter) => (
          <TabsContent key={filter.key} value={filter.key} className="flex-1 mt-4 overflow-auto">
            <GapList
              gaps={filteredGaps}
              onProcess={handleProcess}
              onEditCategory={handleEditCategory}
              onViewRecord={handleViewRecord}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* 修改分类弹窗 */}
      <CategoryEditDialog
        gap={selectedGap}
        editState={editState}
        availableSections={availableSections}
        availableSubsections={availableSubsections}
        onCategoryChange={setEditCategory}
        onSectionChange={setEditSection}
        onSubsectionChange={setEditSubsection}
        onConfirm={handleConfirmCategory}
        onCancel={() => setSelectedGap(null)}
      />

      {/* 处理缺口弹窗 */}
      <ProcessGapDialog
        gap={processingGap}
        onResolve={resolveGap}
        onIgnore={ignoreGap}
        onClose={() => setProcessingGap(null)}
      />

      {/* 查看记录弹窗 */}
      <GapRecordDialog
        gap={viewingGap}
        onClose={() => setViewingGap(null)}
      />
    </div>
  );
}
