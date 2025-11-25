import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { Input } from '../../ui/input';
import { CheckCircle } from 'lucide-react';
import { DocumentField } from '../../DocumentManager';

interface BooleanWithTextFieldProps {
  field: DocumentField;
  onUpdate: (updates: Partial<DocumentField>) => void;
}

export function BooleanWithTextField({
  field,
  onUpdate,
}: BooleanWithTextFieldProps) {
  const isChecked = typeof field.value === 'boolean' ? field.value : !!field.additionalNote;
  const textValue = field.additionalNote || '';

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-all">
      <div className="flex items-center justify-between p-3 bg-white hover:bg-blue-50 transition-all group">
        <div className="flex items-center gap-2">
          <Label htmlFor={field.key} className="cursor-pointer text-sm font-medium">
            {field.label}
          </Label>
        </div>
        <div className="flex items-center gap-2">
          {isChecked && <CheckCircle className="h-4 w-4 text-green-600" />}
          <Switch
            id={field.key}
            checked={isChecked}
            onCheckedChange={(checked: boolean) => onUpdate({
              value: checked,
              additionalNote: checked ? field.additionalNote : ''
            })}
          />
        </div>
      </div>
      {isChecked && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <Input
            placeholder={field.placeholder || '请输入具体信息'}
            value={textValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({
              additionalNote: e.target.value
            })}
            className="h-9 text-sm"
          />
        </div>
      )}
    </div>
  );
}
