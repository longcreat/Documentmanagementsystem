import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { CheckCircle, ArrowLeftRight, X } from 'lucide-react';
import { FeeSettingPanel } from '../../FeeSettingPanel';
import { DocumentField } from '../../DocumentManager';

interface BooleanWithOptionsFieldProps {
  field: DocumentField;
  onUpdateWithOptions: (updates: Partial<DocumentField>) => void;
  onConvertType?: () => void;
  onRemove?: () => void;
}

export function BooleanWithOptionsField({
  field,
  onUpdateWithOptions,
  onConvertType,
  onRemove,
}: BooleanWithOptionsFieldProps) {
  const isChecked = field.value as boolean;

  // 解析存储的收费类型（格式：per_use 或 per_use:备注内容）
  const storedType = field.additionalNote || '';
  const feeTypeOptions = ['free', 'per_use', 'per_hour', 'per_day', 'per_quantity', 'other'];
  const [feeTypeValue, ...noteParts] = storedType.split(':');
  const currentFeeType = feeTypeOptions.includes(feeTypeValue) ? feeTypeValue : 'per_use';
  const currentFeeNote = noteParts.join(':') || '';

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-all">
      <div className="flex items-center justify-between p-3 bg-white hover:bg-blue-50 transition-all group">
        <div className="flex items-center gap-2">
          <Label htmlFor={field.key} className="cursor-pointer text-sm font-medium">
            {field.label}
          </Label>
          {field.isCustom && (
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
              自定义
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isChecked && <CheckCircle className="h-4 w-4 text-green-600" />}
          <Switch
            id={field.key}
            checked={isChecked}
            onCheckedChange={(checked: boolean) => onUpdateWithOptions({ value: checked })}
          />
          {onConvertType && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onConvertType}
              className="h-8 w-8 p-0"
              title="转换为简单开关"
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

      {isChecked && (
        <div className="border-t border-gray-200 p-3">
          <FeeSettingPanel
            feeType={field.feeStatus === 'free' || !field.feeStatus ? 'free' : currentFeeType}
            setFeeType={(value) => onUpdateWithOptions({
              feeStatus: value === 'free' ? 'free' : 'charged',
              feeNote: value === 'free' ? '' : field.feeNote,
              additionalNote: value === 'free' ? '' : (currentFeeNote ? `${value}:${currentFeeNote}` : value)
            })}
            feeAmount={field.feeNote || ''}
            setFeeAmount={(value) => onUpdateWithOptions({ feeNote: value })}
            feeNote={currentFeeNote}
            setFeeNote={(value) => onUpdateWithOptions({ 
              additionalNote: value ? `${currentFeeType}:${value}` : currentFeeType 
            })}
          />
        </div>
      )}
    </div>
  );
}
