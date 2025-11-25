import { Button } from '../ui/button';
import { Save } from 'lucide-react';

interface EditorFooterProps {
  onSave: () => void;
  onCancel: () => void;
  isSaveDisabled: boolean;
  showConfirmText: boolean;
}

export function EditorFooter({
  onSave,
  onCancel,
  isSaveDisabled,
  showConfirmText,
}: EditorFooterProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onCancel} className="flex-1 sm:flex-none">
        取消
      </Button>
      <Button onClick={onSave} disabled={isSaveDisabled} className="flex-1 sm:flex-none">
        <Save className="mr-2 h-4 w-4" />
        保存{showConfirmText && '并确认'}
      </Button>
    </div>
  );
}
