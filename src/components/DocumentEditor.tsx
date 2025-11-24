import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Document, DocumentField } from './DocumentManager';
import { Badge } from './ui/badge';
import { CheckCircle, Save, AlertCircle, ChevronDown, ChevronRight, Plus, X } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Switch } from './ui/switch';

interface DocumentEditorProps {
  document: Document;
  onSave: (doc: Document) => void;
  onCancel: () => void;
}

export function DocumentEditor({ document, onSave, onCancel }: DocumentEditorProps) {
  const [title, setTitle] = useState(document.title);
  const [fields, setFields] = useState<DocumentField[]>(document.fields);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [addingFieldToSection, setAddingFieldToSection] = useState<string | null>(null);
  const [newFieldName, setNewFieldName] = useState('');

  const updateField = (key: string, value: string | boolean) => {
    setFields(fields.map(field => 
      field.key === key ? { ...field, value } : field
    ));
  };

  const addCustomField = (section: string, subsection?: string) => {
    if (!newFieldName.trim()) return;

    const newField: DocumentField = {
      key: `custom_${Date.now()}`,
      label: newFieldName,
      value: false,
      required: false,
      type: 'boolean',
      section,
      subsection,
      isCustom: true
    };

    setFields([...fields, newField]);
    setNewFieldName('');
    setAddingFieldToSection(null);
  };

  const removeCustomField = (key: string) => {
    setFields(fields.filter(field => field.key !== key));
  };

  const calculateCompleteness = (fields: DocumentField[]): number => {
    const requiredFields = fields.filter(f => f.required);
    const filledRequiredFields = requiredFields.filter(f => {
      if (typeof f.value === 'boolean') return true; // boolean字段总是有值
      return f.value.toString().trim();
    });
    
    // 房型信息中，布尔字段很多，只要必填字段完成就算100%
    if (requiredFields.length === 0) return 100;
    
    return Math.round((filledRequiredFields.length / requiredFields.length) * 100);
  };

  const getMissingFields = () => {
    return fields.filter(field => {
      if (!field.required) return false;
      if (typeof field.value === 'boolean') return false;
      return !field.value.toString().trim();
    });
  };

  // 按模块和子模块分组字段
  const groupFieldsBySection = () => {
    const sections = new Map<string, Map<string, DocumentField[]>>();
    
    fields.forEach(field => {
      const section = field.section || '其他';
      const subsection = field.subsection || '';
      
      if (!sections.has(section)) {
        sections.set(section, new Map());
      }
      
      const sectionMap = sections.get(section)!;
      if (!sectionMap.has(subsection)) {
        sectionMap.set(subsection, []);
      }
      
      sectionMap.get(subsection)?.push(field);
    });
    
    return sections;
  };

  const toggleSection = (section: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(section)) {
      newOpenSections.delete(section);
    } else {
      newOpenSections.add(section);
    }
    setOpenSections(newOpenSections);
  };

  const getSectionStats = (sectionMap: Map<string, DocumentField[]>) => {
    let totalFields = 0;
    let filledFields = 0;
    let requiredTotal = 0;
    let requiredFilled = 0;

    sectionMap.forEach(fields => {
      fields.forEach(field => {
        totalFields++;
        if (field.required) requiredTotal++;
        
        if (typeof field.value === 'boolean') {
          if (field.value) filledFields++;
          if (field.required && field.value) requiredFilled++;
        } else if (field.value.toString().trim()) {
          filledFields++;
          if (field.required) requiredFilled++;
        }
      });
    });

    return { totalFields, filledFields, requiredTotal, requiredFilled };
  };

  const missingFields = getMissingFields();
  const completeness = calculateCompleteness(fields);
  const sections = groupFieldsBySection();

  const handleSave = () => {
    if (!title.trim()) {
      alert('请输入文档标题');
      return;
    }

    if (missingFields.length > 0) {
      const confirm = window.confirm(
        `还有 ${missingFields.length} 个必填字段未填写，确定要保存吗？\n未填写字段：${missingFields.map(f => f.label).join('、')}`
      );
      if (!confirm) return;
    }

    const updatedDoc: Document = {
      ...document,
      title,
      fields,
      completeness,
      status: missingFields.length === 0 ? 'confirmed' : document.status,
      lastModified: new Date()
    };
    onSave(updatedDoc);
  };

  const renderField = (field: DocumentField) => {
    if (field.type === 'boolean') {
      return (
        <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group">
          <div className="flex items-center gap-2">
            <Label htmlFor={field.key} className="cursor-pointer text-sm">
              {field.label}
            </Label>
            {field.isCustom && (
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">自定义</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {field.value && <CheckCircle className="h-4 w-4 text-green-600" />}
            <Switch
              id={field.key}
              checked={field.value as boolean}
              onCheckedChange={(checked) => updateField(field.key, checked)}
            />
            {field.isCustom && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCustomField(field.key)}
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

    return (
      <div className="space-y-2">
        <Label htmlFor={field.key} className="flex items-center gap-2 text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-500">*</span>}
          {!field.value.toString().trim() && field.required && (
            <span className="text-xs text-orange-600 font-normal">(待填写)</span>
          )}
        </Label>
        {field.type === 'textarea' ? (
          <Textarea
            id={field.key}
            value={field.value as string}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={`transition-all ${!field.value.toString().trim() && field.required ? 'border-orange-300 focus-visible:ring-orange-200 bg-orange-50/30' : 'focus-visible:ring-blue-200'}`}
          />
        ) : (
          <Input
            id={field.key}
            type={field.type || 'text'}
            value={field.value as string}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={`transition-all ${!field.value.toString().trim() && field.required ? 'border-orange-300 focus-visible:ring-orange-200 bg-orange-50/30' : 'focus-visible:ring-blue-200'}`}
          />
        )}
      </div>
    );
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>编辑{document.category === '房型信息' ? '房型' : document.category === '设施信息' ? '设施' : document.category === '政策信息' ? '政策' : '文档'}</DialogTitle>
          <DialogDescription>
            填写各个字段，完善{document.category === '房型信息' ? '房型' : '文档'}内容
          </DialogDescription>
        </DialogHeader>

        {/* 完善度提示 */}
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
          {completeness === 100 && (
            <Badge className="bg-green-500 shadow-sm">
              <CheckCircle className="mr-1 h-3 w-3" />
              已完善
            </Badge>
          )}
        </div>

        {/* 缺失字段提示 */}
        {missingFields.length > 0 && (
          <Alert className="bg-orange-50 border-orange-200">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-900">
              还有 <span className="font-semibold">{missingFields.length}</span> 个必填字段未填写
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea className="flex-1 -mx-6 px-6 overflow-y-auto">
          <div className="space-y-4 pr-4 pb-4">
            {/* 标题 */}
            <div className="space-y-2 bg-white sticky top-0 pb-4 z-10">
              <Label htmlFor="doc-title" className="flex items-center gap-2 text-base">
                {document.category === '房型信息' ? '房型名称' : '文档标题'}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="doc-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={document.category === '房型信息' ? '例如：豪华海景大床房' : '请输入文档标题'}
                className="text-base"
              />
            </div>

            {/* 按模块分组显示字段 */}
            {Array.from(sections.entries()).map(([sectionName, subsectionsMap]) => {
              const stats = getSectionStats(subsectionsMap);
              const isOpen = openSections.has(sectionName);
              const missingInSection = missingFields.filter(f => f.section === sectionName).length;

              return (
                <div key={sectionName} className="border rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow">
                  <Collapsible open={isOpen} onOpenChange={() => toggleSection(sectionName)}>
                    <CollapsibleTrigger asChild>
                      <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all">
                        <div className="flex items-center gap-3">
                          {isOpen ? <ChevronDown className="h-5 w-5 text-gray-600" /> : <ChevronRight className="h-5 w-5 text-gray-600" />}
                          <h4 className="font-medium text-gray-900">{sectionName}</h4>
                          {stats.requiredTotal > 0 && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              必填
                            </Badge>
                          )}
                          {missingInSection > 0 && (
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              {missingInSection} 个未填
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="font-medium">{stats.filledFields}/{stats.totalFields}</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${stats.totalFields > 0 ? (stats.filledFields / stats.totalFields) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-4 space-y-4 bg-white">
                        {Array.from(subsectionsMap.entries()).map(([subsectionName, subsectionFields]) => (
                          <div key={subsectionName || 'main'}>
                            {subsectionName && (
                              <div className="flex items-center justify-between mb-3 pb-2 border-b">
                                <h5 className="text-sm font-medium text-gray-700">{subsectionName}</h5>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setAddingFieldToSection(`${sectionName}::${subsectionName}`)}
                                  className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  添加字段
                                </Button>
                              </div>
                            )}
                            
                            {/* 添加自定义字段输入框 */}
                            {addingFieldToSection === `${sectionName}::${subsectionName}` && (
                              <div className="flex gap-2 mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                <Input
                                  placeholder="输入字段名称"
                                  value={newFieldName}
                                  onChange={(e) => setNewFieldName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') addCustomField(sectionName, subsectionName);
                                    if (e.key === 'Escape') setAddingFieldToSection(null);
                                  }}
                                  autoFocus
                                  className="flex-1"
                                />
                                <Button size="sm" onClick={() => addCustomField(sectionName, subsectionName)} disabled={!newFieldName.trim()}>
                                  添加
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setAddingFieldToSection(null)}>
                                  取消
                                </Button>
                              </div>
                            )}

                            {!subsectionName && !addingFieldToSection && subsectionFields.every(f => f.type !== 'boolean') && (
                              <div className="mb-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setAddingFieldToSection(`${sectionName}::`)}
                                  className="w-full border-dashed hover:bg-blue-50"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  添加自定义字段
                                </Button>
                              </div>
                            )}

                            {addingFieldToSection === `${sectionName}::` && !subsectionName && (
                              <div className="flex gap-2 mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                <Input
                                  placeholder="输入字段名称"
                                  value={newFieldName}
                                  onChange={(e) => setNewFieldName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') addCustomField(sectionName);
                                    if (e.key === 'Escape') setAddingFieldToSection(null);
                                  }}
                                  autoFocus
                                  className="flex-1"
                                />
                                <Button size="sm" onClick={() => addCustomField(sectionName)} disabled={!newFieldName.trim()}>
                                  添加
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setAddingFieldToSection(null)}>
                                  取消
                                </Button>
                              </div>
                            )}

                            <div className="space-y-2">
                              {subsectionFields.map(field => (
                                <div key={field.key}>
                                  {renderField(field)}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              );
            })}

            {/* 元信息 */}
            <div className="p-4 bg-gray-50 rounded-lg text-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-600">分类：</span>
                  <span className="text-gray-900 font-medium">{document.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">最后修改：</span>
                  <span className="text-gray-900">{document.lastModified.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4 gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1 sm:flex-none">
            取消
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()} className="flex-1 sm:flex-none">
            <Save className="mr-2 h-4 w-4" />
            保存{missingFields.length === 0 && '并确认'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}