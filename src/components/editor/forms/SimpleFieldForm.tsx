import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Plus } from 'lucide-react';

interface SimpleFieldFormProps {
  labelValue: string;
  setLabel: (value: string) => void;
  valueValue: string;
  setValue: (value: string) => void;
  onAdd: () => void;
  onCancel: () => void;
}

export function SimpleFieldForm({
  labelValue,
  setLabel,
  valueValue,
  setValue,
  onAdd,
  onCancel,
}: SimpleFieldFormProps) {
  return (
    <div className="mb-3 rounded-2xl border border-blue-100 bg-white/90 shadow-sm">
      <div className="p-4 space-y-4">
        <div>
          <Label className="text-xs font-medium text-gray-700 mb-1.5 block">字段名称</Label>
          <Input
            placeholder="例如：字段名称"
            value={labelValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLabel(e.target.value)}
            autoFocus
          />
        </div>
        <div>
          <Label className="text-xs font-medium text-gray-700 mb-1.5 block">字段值</Label>
          <Input
            placeholder="请输入该字段的值"
            value={valueValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 pt-1 sm:flex-row">
          <Button
            size="sm"
            onClick={onAdd}
            disabled={!labelValue.trim()}
            className="flex-1"
          >
            <Plus className="h-3 w-3 mr-1" />
            添加字段
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
