import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus } from 'lucide-react';

// 收费方式选项
const FEE_TYPE_OPTIONS = [
  { value: 'per_use', label: '按次', example: '例如：10元 / 次' },
  { value: 'per_hour', label: '按时', example: '例如：20元 / 小时' },
  { value: 'per_day', label: '按天', example: '例如：100元 / 天' },
  { value: 'per_quantity', label: '按量', example: '例如：5元 / 件' },
  { value: 'other', label: '其他', example: '自由填写金额或说明' },
];

// 字段类型
type FieldType = 'boolean' | 'key-value';
// 收费状态
type FeeStatus = 'free' | 'charged';

interface FacilityFieldFormProps {
  // 字段名称
  fieldLabel: string;
  setFieldLabel: (value: string) => void;
  // 字段类型
  fieldType: FieldType;
  setFieldType: (value: FieldType) => void;
  // key-value 类型的值
  fieldValue: string;
  setFieldValue: (value: string) => void;
  // 收费状态
  feeStatus: FeeStatus;
  setFeeStatus: (value: FeeStatus) => void;
  // 收费方式
  feeType: string;
  setFeeType: (value: string) => void;
  // 收费金额
  feeAmount: string;
  setFeeAmount: (value: string) => void;
  // 收费备注
  feeNote: string;
  setFeeNote: (value: string) => void;
  // 操作
  onAdd: () => void;
  onCancel: () => void;
  // 唯一标识
  radioName: string;
  // 占位符
  placeholder?: string;
  valuePlaceholder?: string;
}

/**
 * 设施信息字段添加表单组件
 * 支持两种字段类型：
 * 1. boolean - 是否存在（如：有/无健身房）
 * 2. key-value - 键值对（如：停车场 - 100元/天）
 * 两种类型都支持收费配置
 */
export const FacilityFieldForm: React.FC<FacilityFieldFormProps> = ({
  fieldLabel,
  setFieldLabel,
  fieldType,
  setFieldType,
  fieldValue,
  setFieldValue,
  feeStatus,
  setFeeStatus,
  feeType,
  setFeeType,
  feeAmount,
  setFeeAmount,
  feeNote,
  setFeeNote,
  onAdd,
  onCancel,
  radioName,
  placeholder = '输入设施名称，如：健身房、游泳池',
  valuePlaceholder = '输入具体信息，如：24小时开放',
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
    <div className="mb-3 p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-4">
      {/* 字段名称输入 */}
      <Input
        placeholder={placeholder}
        value={fieldLabel}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldLabel(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-full h-9 text-sm"
      />

      {/* 字段类型选择 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name={`${radioName}_type`}
              checked={fieldType === 'boolean'}
              onChange={() => setFieldType('boolean')}
              className="w-3.5 h-3.5 text-blue-500"
            />
            <span className="text-xs text-gray-700">是否存在</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name={`${radioName}_type`}
              checked={fieldType === 'key-value'}
              onChange={() => setFieldType('key-value')}
              className="w-3.5 h-3.5 text-blue-500"
            />
            <span className="text-xs text-gray-700">带详情</span>
          </label>
        </div>
        
        {/* 操作按钮 */}
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

      {/* key-value 类型的值输入 */}
      {fieldType === 'key-value' && (
        <Input
          placeholder={valuePlaceholder}
          value={fieldValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue(e.target.value)}
          className="w-full h-9 text-sm"
        />
      )}

      {/* 收费设置 */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-gray-700">收费状态</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFeeStatus('free')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                feeStatus === 'free'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              免费
            </button>
            <button
              type="button"
              onClick={() => setFeeStatus('charged')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                feeStatus === 'charged'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              收费
            </button>
          </div>
        </div>

        {/* 收费详情 */}
        {feeStatus === 'charged' && (
          <div className="space-y-4 pt-4 mt-4 border-t border-gray-100">
            <div className="flex gap-1.5">
              {FEE_TYPE_OPTIONS.map((option) => (
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
                placeholder={FEE_TYPE_OPTIONS.find(o => o.value === feeType)?.example || '例如：10元 / 次'}
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

export default FacilityFieldForm;
