import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { CheckCircle, ArrowLeftRight, X } from 'lucide-react';
import { DocumentField } from '../../DocumentManager';

interface BooleanFieldProps {
  field: DocumentField;
  showConvertButton?: boolean;
  onCheckedChange: (checked: boolean) => void;
  onConvertType?: () => void;
  onRemove?: () => void;
}

export function BooleanField({
  field,
  showConvertButton = false,
  onCheckedChange,
  onConvertType,
  onRemove,
}: BooleanFieldProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group">
      <div className="flex items-center gap-2">
        <Label htmlFor={field.key} className="cursor-pointer text-sm">
          {field.label}
        </Label>
        {field.isCustom && (
          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
            自定义
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        {field.value && <CheckCircle className="h-4 w-4 text-green-600" />}
        <Switch
          id={field.key}
          checked={field.value as boolean}
          onCheckedChange={onCheckedChange}
        />
        {showConvertButton && onConvertType && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onConvertType}
            className="h-8 w-8 p-0"
            title="转换为带收费选项"
          >
            <ArrowLeftRight className="h-4 w-4 text-blue-500" />
          </Button>
        )}
        {field.isCustom && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            title="删除自定义字段"
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </div>
    </div>
  );
}
