import React from 'react';
import { Input } from './ui/input';

// 收费方式选项
const FEE_TYPE_OPTIONS = [
  { value: 'free', label: '免费', example: '' },
  { value: 'per_use', label: '按次', example: '例如：10元 / 次' },
  { value: 'per_hour', label: '按时', example: '例如：20元 / 小时' },
  { value: 'per_day', label: '按天', example: '例如：100元 / 天' },
  { value: 'per_quantity', label: '按量', example: '例如：5元 / 件' },
  { value: 'other', label: '其他', example: '自由填写金额或说明' },
];

interface FeeSettingPanelProps {
  feeType: string;
  setFeeType: (value: string) => void;
  feeAmount: string;
  setFeeAmount: (value: string) => void;
  feeNote: string;
  setFeeNote: (value: string) => void;
}

/**
 * 收费设置面板组件
 * 用于配置收费方式、金额和备注
 */
export const FeeSettingPanel: React.FC<FeeSettingPanelProps> = ({
  feeType,
  setFeeType,
  feeAmount,
  setFeeAmount,
  feeNote,
  setFeeNote,
}) => {
  const selectedOption = FEE_TYPE_OPTIONS.find((option) => option.value === feeType);
  const isCharged = feeType !== 'free';

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="px-4 py-2 border-b border-gray-100">
        <span className="text-xs font-medium text-gray-700">收费设置</span>
      </div>
      <div className="p-4 space-y-4">
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
        {isCharged && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-medium text-gray-500 mb-1">金额</p>
              <Input
                placeholder={selectedOption?.example || '请输入收费金额'}
                value={feeAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeeAmount(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div>
              <p className="text-[11px] font-medium text-gray-500 mb-1">备注（可选）</p>
              <Input
                placeholder="例如：需押金 / 提前预约"
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

export default FeeSettingPanel;
