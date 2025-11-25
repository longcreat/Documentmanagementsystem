import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Plus } from 'lucide-react';

interface SubsectionFormProps {
  subsectionName: string;
  setSubsectionName: (value: string) => void;
  onAdd: () => void;
  onCancel: () => void;
  placeholder?: string;
}

export function SubsectionForm({
  subsectionName,
  setSubsectionName,
  onAdd,
  onCancel,
  placeholder = '例如：洗浴用品、卫浴设施、特色服务',
}: SubsectionFormProps) {
  return (
    <div className="mb-3 rounded-2xl border border-blue-100 bg-white/90 shadow-sm">
      <div className="p-4 space-y-4">
        <div>
          <Label className="text-xs font-medium text-gray-700 mb-1.5 block">二级指标名称</Label>
          <Input
            placeholder={placeholder}
            value={subsectionName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubsectionName(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' && subsectionName.trim()) {
                onAdd();
              }
              if (e.key === 'Escape') {
                onCancel();
              }
            }}
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-2 pt-1 sm:flex-row">
          <Button
            size="sm"
            onClick={onAdd}
            disabled={!subsectionName.trim()}
            className="flex-1"
          >
            <Plus className="h-3 w-3 mr-1" />
            添加二级指标
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="bg-white"
          >
            取消
          </Button>
        </div>
      </div>
    </div>
  );
}
