import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { CheckCircle, X } from 'lucide-react';
import { DocumentField } from '../../DocumentManager';

const AVAILABLE_LANGUAGES = [
  '中文', '英语', '日语', '韩语', '法语', '德语', '西班牙语', 
  '俄语', '阿拉伯语', '葡萄牙语', '意大利语', '泰语', '越南语'
];

interface BooleanWithLanguagesFieldProps {
  field: DocumentField;
  onUpdate: (updates: Partial<DocumentField>) => void;
}

export function BooleanWithLanguagesField({
  field,
  onUpdate,
}: BooleanWithLanguagesFieldProps) {
  const isChecked = field.value as boolean;
  const selectedLanguages = field.languages || [];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected && !selectedLanguages.includes(selected)) {
      onUpdate({ languages: [...selectedLanguages, selected] });
    }
    e.target.value = '';
  };

  const removeLanguage = (lang: string) => {
    onUpdate({ languages: selectedLanguages.filter(l => l !== lang) });
  };

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
            onCheckedChange={(checked: boolean) => onUpdate({ value: checked })}
          />
        </div>
      </div>
      {isChecked && (
        <div className="border-t border-gray-200 p-3 bg-gray-50 space-y-2">
          <select
            onChange={handleLanguageChange}
            className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
          >
            <option value="" disabled>选择语言...</option>
            {AVAILABLE_LANGUAGES.filter(lang => !selectedLanguages.includes(lang)).map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          {selectedLanguages.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedLanguages.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                >
                  {lang}
                  <button
                    type="button"
                    onClick={() => removeLanguage(lang)}
                    className="hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
