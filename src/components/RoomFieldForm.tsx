import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus } from 'lucide-react';

interface RoomFieldFormProps {
  fieldLabel: string;
  setFieldLabel: (value: string) => void;
  fieldType: 'boolean' | 'boolean-with-options';
  setFieldType: (value: 'boolean' | 'boolean-with-options') => void;
  feeNote: string;
  setFeeNote: (value: string) => void;
  feeType?: string;
  setFeeType?: (value: string) => void;
  feeAmount?: string;
  setFeeAmount?: (value: string) => void;
  onAdd: () => void;
  onCancel: () => void;
  radioName: string;
  placeholder?: string;
}

/**
 * 房型信息字段添加表单组件
 * 用于添加免费提供或收费的字段
 */
export const RoomFieldForm: React.FC<RoomFieldFormProps> = ({
  fieldLabel,
  setFieldLabel,
  fieldType,
  setFieldType,
  feeNote,
  setFeeNote,
  feeType = 'per_use',
  setFeeType,
  feeAmount = '',
  setFeeAmount,
  onAdd,
  onCancel,
  radioName,
  placeholder = '输入字段名称，如：牙刷、牙膏、沐浴露',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && fieldLabel.trim()) {
      onAdd();
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="mb-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
      <div className="flex flex-col gap-3">
        <Input
          placeholder={placeholder}
          value={fieldLabel}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full h-9 text-sm"
        />
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name={radioName}
                checked={fieldType === 'boolean'}
                onChange={() => setFieldType('boolean')}
                className="w-3.5 h-3.5 text-blue-500"
              />
              <span className="text-xs text-gray-700">免费提供</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name={radioName}
                checked={fieldType === 'boolean-with-options'}
                onChange={() => setFieldType('boolean-with-options')}
                className="w-3.5 h-3.5 text-orange-500"
              />
              <span className="text-xs text-gray-700">收费</span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onAdd}
              disabled={!fieldLabel.trim()}
              className="h-8 px-3 text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              添加
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 px-3 text-xs text-gray-500"
            >
              取消
            </Button>
          </div>
        </div>
        
        {/* 收费详情：选择收费时显示金额和备注输入 */}
        {fieldType === 'boolean-with-options' && setFeeType && setFeeAmount && (
          <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
            <div className="flex gap-1.5">
              {[
                { value: 'per_use', label: '按次', example: '例如：10元 / 次' },
                { value: 'per_hour', label: '按时', example: '例如：20元 / 小时' },
                { value: 'per_day', label: '按天', example: '例如：100元 / 天' },
                { value: 'per_quantity', label: '按量', example: '例如：5元 / 件' },
                { value: 'other', label: '其他', example: '自由填写金额或说明' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFeeType(option.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    feeType === option.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder={
                  [
                    { value: 'per_use', example: '例如：10元 / 次' },
                    { value: 'per_hour', example: '例如：20元 / 小时' },
                    { value: 'per_day', example: '例如：100元 / 天' },
                    { value: 'per_quantity', example: '例如：5元 / 件' },
                    { value: 'other', example: '自由填写金额或说明' },
                  ].find(o => o.value === feeType)?.example || '例如：10元 / 次'
                }
                value={feeAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeeAmount(e.target.value)}
                className="h-9 text-sm"
              />
              <Input
                placeholder="备注（可选）"
                value={feeNote}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeeNote(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomFieldForm;
