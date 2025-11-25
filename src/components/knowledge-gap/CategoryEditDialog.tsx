import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Bot } from 'lucide-react';
import { KnowledgeGap, CategoryEditState } from './types';
import { DocumentCategory } from '../DocumentManager';
import { DOCUMENT_STRUCTURE } from '../../constants/documentStructure';

interface CategoryEditDialogProps {
  gap: KnowledgeGap | null;
  editState: CategoryEditState;
  availableSections: { name: string; subsections?: string[] }[];
  availableSubsections: string[];
  onCategoryChange: (category: DocumentCategory | '') => void;
  onSectionChange: (section: string) => void;
  onSubsectionChange: (subsection: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CategoryEditDialog({
  gap,
  editState,
  availableSections,
  availableSubsections,
  onCategoryChange,
  onSectionChange,
  onSubsectionChange,
  onConfirm,
  onCancel,
}: CategoryEditDialogProps) {
  if (!gap) return null;

  const canConfirm = editState.category && editState.section;

  return (
    <Dialog open={!!gap} onOpenChange={(open: boolean) => !open && onCancel()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>修改知识缺口分类</DialogTitle>
          <DialogDescription>
            为该知识缺口选择正确的分类，以便补齐到对应的文档模块
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* 问题显示 */}
          <div>
            <Label className="text-sm font-medium text-gray-700">问题</Label>
            <div className="mt-1.5 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-900">{gap.question}</p>
            </div>
          </div>

          {/* AI 推荐分类 */}
          {gap.suggestedCategory && (
            <div>
              <Label className="text-sm font-medium text-gray-700">AI 推荐分类</Label>
              <div className="mt-1.5 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-sm">
                  <Bot className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-blue-900">
                    {gap.suggestedCategory}
                    {gap.suggestedSection && ` / ${gap.suggestedSection}`}
                    {gap.suggestedSubsection && ` / ${gap.suggestedSubsection}`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 分类选择 */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                业务分类 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={editState.category}
                onValueChange={(value: string) => onCategoryChange(value as DocumentCategory)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="选择业务分类" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_STRUCTURE.map((category) => (
                    <SelectItem key={category.key} value={category.key}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                章节 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={editState.section}
                onValueChange={onSectionChange}
                disabled={!editState.category || availableSections.length === 0}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder={editState.category ? '选择章节' : '请先选择业务分类'} />
                </SelectTrigger>
                <SelectContent>
                  {availableSections.map((section) => (
                    <SelectItem key={section.name} value={section.name}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">子章节（可选）</Label>
              {availableSubsections.length > 0 ? (
                <Select
                  value={editState.subsection}
                  onValueChange={onSubsectionChange}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="选择子章节" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubsections.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1.5 h-9 flex items-center rounded-md border border-dashed border-gray-200 px-3 text-sm text-gray-400">
                  {editState.section ? '该章节无子章节' : '请先选择章节'}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button onClick={onConfirm} disabled={!canConfirm}>
            确认分类
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
