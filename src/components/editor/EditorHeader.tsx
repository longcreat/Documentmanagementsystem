import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AlertCircle } from 'lucide-react';

interface EditorHeaderProps {
  title: string;
  setTitle: (value: string) => void;
  completeness: number;
  missingFields: string[];
  categoryLabel: string;
}

export function EditorHeader({
  title,
  setTitle,
  completeness,
  missingFields,
  categoryLabel,
}: EditorHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">文档完善度</span>
            <span className="text-lg font-semibold text-gray-900">{completeness}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                completeness >= 90 ? 'bg-green-500' :
                completeness >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
        {missingFields.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-200">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <span className="text-xs text-orange-700">
              {missingFields.length} 个必填项待完善
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          {categoryLabel}名称 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder={`请输入${categoryLabel}名称`}
          className="text-base font-medium"
        />
      </div>
    </>
  );
}
