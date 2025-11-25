import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { KnowledgeGap } from './types';

interface GapRecordDialogProps {
  gap: KnowledgeGap | null;
  onClose: () => void;
}

export function GapRecordDialog({ gap, onClose }: GapRecordDialogProps) {
  if (!gap) return null;

  return (
    <Dialog open={!!gap} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>处理记录</DialogTitle>
          <DialogDescription>
            查看该知识缺口的处理详情
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* 问题 */}
          <div>
            <label className="text-sm font-medium text-gray-700">问题</label>
            <div className="mt-1.5 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-900">{gap.question}</p>
            </div>
          </div>

          {/* 状态 */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">状态</label>
            {gap.status === 'resolved' ? (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                已处理
              </Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                已忽略
              </Badge>
            )}
          </div>

          {/* 分类路径 */}
          {(gap.confirmedCategory || gap.suggestedCategory) && (
            <div>
              <label className="text-sm font-medium text-gray-700">归属分类</label>
              <div className="mt-1.5 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  {gap.confirmedCategory || gap.suggestedCategory}
                  {(gap.confirmedSection || gap.suggestedSection) && 
                    ` / ${gap.confirmedSection || gap.suggestedSection}`}
                  {(gap.confirmedSubsection || gap.suggestedSubsection) && 
                    ` / ${gap.confirmedSubsection || gap.suggestedSubsection}`}
                </p>
              </div>
            </div>
          )}

          {/* 处理时间 */}
          {gap.resolvedAt && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>处理时间: {new Date(gap.resolvedAt).toLocaleString('zh-CN')}</span>
            </div>
          )}

          {/* 处理结果 */}
          {gap.resolution && (
            <div>
              <label className="text-sm font-medium text-gray-700">处理结果</label>
              <div className="mt-1.5 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-900">{gap.resolution}</p>
              </div>
            </div>
          )}

          {/* 原始对话 */}
          {gap.conversationSnippet && gap.conversationSnippet.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />
                原始对话
              </label>
              <div className="mt-1.5 space-y-2">
                {gap.conversationSnippet.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg text-sm ${
                      msg.role === 'user'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-blue-50 text-blue-900'
                    }`}
                  >
                    <span className="font-medium">
                      {msg.role === 'user' ? '用户' : 'AI'}:
                    </span>{' '}
                    {msg.content}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
