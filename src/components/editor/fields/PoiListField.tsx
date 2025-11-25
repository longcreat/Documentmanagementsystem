import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Plus, X } from 'lucide-react';
import { DocumentField } from '../../DocumentManager';

interface PoiEntry {
  id: string;
  name: string;
  distance: string;
  tag?: string;
}

interface PoiListFieldProps {
  field: DocumentField;
  entries: PoiEntry[];
  onAddEntry: () => void;
  onRemoveEntry: (entryId: string) => void;
  onUpdateEntry: (entryId: string, updates: Partial<PoiEntry>) => void;
}

export function PoiListField({
  field,
  entries,
  onAddEntry,
  onRemoveEntry,
  onUpdateEntry,
}: PoiListFieldProps) {
  const sectionLabel = field.section || field.label || 'POI';
  const tagPlaceholder = field.section === '交通' ? '地铁/机场/火车站（可选）' : '标签/品类（可选）';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {sectionLabel} · 已添加 <span className="font-semibold text-gray-900">{entries.length}</span> 条
        </div>
        <Button size="sm" variant="outline" onClick={onAddEntry}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          新增POI
        </Button>
      </div>

      {entries.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
          暂无{sectionLabel}数据，点击"新增POI"开始录入
        </div>
      )}

      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{`${sectionLabel} - POI ${index + 1}`}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveEntry(entry.id)}
                className="h-8 text-xs text-red-500 hover:bg-red-50"
              >
                <X className="mr-1 h-3.5 w-3.5" />
                删除
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">
                  名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={entry.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onUpdateEntry(entry.id, { name: e.target.value })
                  }
                  placeholder="请输入POI名称"
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">
                  距离 <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={entry.distance}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onUpdateEntry(entry.id, { distance: e.target.value })
                  }
                  placeholder="例如：220米 / 3.5千米"
                  className="text-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-600">类型/标签（可选）</Label>
              <Input
                value={entry.tag || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onUpdateEntry(entry.id, { tag: e.target.value })
                }
                placeholder={tagPlaceholder}
                className="text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
