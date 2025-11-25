import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { DocumentField } from '../../DocumentManager';

interface TextFieldProps {
  field: DocumentField;
  onUpdate: (value: string) => void;
}

export function TextField({
  field,
  onUpdate,
}: TextFieldProps) {
  const isEmpty = typeof field.value === 'string' && !field.value.trim();
  const inputClassName = `transition-all ${
    isEmpty && field.required 
      ? 'border-orange-300 focus-visible:ring-orange-200 bg-orange-50/30' 
      : 'focus-visible:ring-blue-200'
  }`;

  return (
    <div className="space-y-2">
      <Label htmlFor={field.key} className="flex items-center gap-2 text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500">*</span>}
        {isEmpty && field.required && (
          <span className="text-xs text-orange-600 font-normal">(待填写)</span>
        )}
      </Label>
      {field.type === 'textarea' ? (
        <Textarea
          id={field.key}
          value={(field.value as string) || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdate(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={inputClassName}
        />
      ) : (
        <Input
          id={field.key}
          type={field.type || 'text'}
          value={(field.value as string) || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate(e.target.value)}
          placeholder={field.placeholder}
          className={inputClassName}
        />
      )}
    </div>
  );
}
