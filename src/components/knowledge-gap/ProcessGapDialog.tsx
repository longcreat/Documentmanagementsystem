import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Bot, FileText, ArrowRight } from 'lucide-react';
import { KnowledgeGap } from './types';

interface ProcessGapDialogProps {
  gap: KnowledgeGap | null;
  onResolve: (gapId: string, resolution: string) => void;
  onIgnore: (gapId: string) => void;
  onClose: () => void;
}

export function ProcessGapDialog({ gap, onResolve, onIgnore, onClose }: ProcessGapDialogProps) {
  const [resolution, setResolution] = useState('');
  const [mode, setMode] = useState<'resolve' | 'ignore'>('resolve');

  if (!gap) return null;

  const category = gap.confirmedCategory || gap.suggestedCategory;
  const section = gap.confirmedSection || gap.suggestedSection;
  const subsection = gap.confirmedSubsection || gap.suggestedSubsection;

  const handleResolve = () => {
    if (!resolution.trim()) return;
    onResolve(gap.id, resolution);
    setResolution('');
    onClose();
  };

  const handleIgnore = () => {
    onIgnore(gap.id);
    onClose();
  };

  return (
    <Dialog open={!!gap} onOpenChange={(open: boolean) => {
      if (!open) {
        setResolution('');
        setMode('resolve');
        onClose();
      }
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>处理知识缺口</DialogTitle>
          <DialogDescription>
            补充缺失的知识信息，或选择忽略该问题
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* 问题信息 */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{gap.question}</h4>
                {gap.aiResponse && (
                  <p className="text-sm text-gray-600 mt-1">
                    <Bot className="h-3.5 w-3.5 inline mr-1" />
                    AI 回复: {gap.aiResponse}
                  </p>
                )}
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                待处理
              </Badge>
            </div>
          </div>

          {/* 目标分类 */}
          {category && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">将补充到:</span>
              <div className="flex items-center gap-1 text-blue-700 font-medium">
                <span>{category}</span>
                {section && (
                  <>
                    <ArrowRight className="h-3 w-3" />
                    <span>{section}</span>
                  </>
                )}
                {subsection && (
                  <>
                    <ArrowRight className="h-3 w-3" />
                    <span>{subsection}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 处理方式选择 */}
          <div className="flex gap-2">
            <Button
              variant={mode === 'resolve' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('resolve')}
            >
              补充信息
            </Button>
            <Button
              variant={mode === 'ignore' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setMode('ignore')}
              className={mode === 'ignore' ? 'bg-gray-700 text-white hover:bg-gray-800' : ''}
            >
              忽略问题
            </Button>
          </div>

          {/* 补充信息 */}
          {mode === 'resolve' && (
            <div>
              <Label className="text-sm font-medium text-gray-700">
                补充的信息内容 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                className="mt-1.5"
                placeholder="请输入要补充到文档中的信息内容..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                该内容将被添加到对应的文档模块中
              </p>
            </div>
          )}

          {/* 忽略确认 */}
          {mode === 'ignore' && (
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800">
                确定要忽略这个问题吗？忽略后该问题将不再出现在待处理列表中。
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          {mode === 'resolve' ? (
            <Button
              onClick={handleResolve}
              disabled={!resolution.trim()}
            >
              确认补充
            </Button>
          ) : (
            <Button
              onClick={handleIgnore}
              variant="destructive"
            >
              确认忽略
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
