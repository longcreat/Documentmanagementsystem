import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Edit, Trash2, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Document, PoiEntry } from './DocumentManager';
import { DocumentEditor } from './DocumentEditor';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface DocumentListProps {
  documents: Document[];
  onUpdate: (doc: Document) => void;
  onDelete: (docId: string) => void;
}

export function DocumentList({ documents, onUpdate, onDelete }: DocumentListProps) {
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  const asPoiEntries = (field: Document['fields'][number]): PoiEntry[] =>
    Array.isArray(field.value) ? (field.value as PoiEntry[]) : [];

  const isPoiFieldFilled = (field: Document['fields'][number]) => {
    if (field.type !== 'poi-list') return false;
    const entries = asPoiEntries(field);
    if (entries.length === 0) return false;
    return entries.every(entry => entry.name?.toString().trim() && entry.distance?.toString().trim());
  };

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">待确认</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">已确认</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">草稿</Badge>;
    }
  };

  const getCompletenessColor = (completeness: number) => {
    if (completeness >= 90) return 'bg-green-500';
    if (completeness >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMissingFields = (doc: Document) => {
    return doc.fields.filter(field => {
      if (!field.required) return false;
      if (typeof field.value === 'boolean') return false;
      if (field.type === 'poi-list') {
        const entries = asPoiEntries(field);
        if (entries.length === 0) return true;
        return !entries.every(entry => entry.name?.toString().trim() && entry.distance?.toString().trim());
      }
      return !field.value.toString().trim();
    });
  };

  const getFilledBooleanFields = (doc: Document) => {
    return doc.fields.filter(field => field.type === 'boolean' && field.value === true);
  };

  const handleQuickConfirm = (doc: Document) => {
    const missingFields = getMissingFields(doc);
    if (missingFields.length === 0) {
      onUpdate({ ...doc, status: 'confirmed' });
    } else {
      setEditingDoc(doc);
    }
  };

  const handleDelete = () => {
    if (deletingDocId) {
      onDelete(deletingDocId);
      setDeletingDocId(null);
    }
  };

  if (documents.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500">此分类下暂无文档</p>
        <p className="text-gray-400 text-sm mt-2">点击右上角按钮创建</p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {documents.map(doc => {
          const missingFields = getMissingFields(doc);
          const filledFields = doc.fields.filter(field => {
            if (field.type === 'poi-list') return isPoiFieldFilled(field);
            if (typeof field.value === 'boolean') return field.value === true;
            return typeof field.value === 'string' ? field.value.trim().length > 0 : false;
          });
          const textFields = doc.fields.filter(f => typeof f.value === 'string' && f.value.trim().length > 0);
          const booleanFields = getFilledBooleanFields(doc);
          const poiFields = doc.fields.filter(field => isPoiFieldFilled(field));
          const showFieldPreview = doc.category !== '酒店基础信息';
          const showImmediateFix = doc.status === 'pending' && missingFields.length > 0;
          const showEditButton = !showImmediateFix;

          return (
            <Card key={doc.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h3 className="text-gray-900 truncate">{doc.title}</h3>
                    {getStatusBadge(doc.status)}
                  </div>

                  {showFieldPreview && (
                    <div className="space-y-2 mb-4">
                      {textFields.slice(0, 3).map(field => {
                        const value = typeof field.value === 'string' ? field.value : '';
                        return (
                          <div key={field.key} className="flex gap-2 text-sm">
                            <span className="text-gray-600 min-w-24 shrink-0">{field.label}:</span>
                            <span className="text-gray-900 line-clamp-1">{value}</span>
                          </div>
                        );
                      })}
                      {booleanFields.length > 0 && (
                        <div className="flex gap-2 text-sm">
                          <span className="text-gray-600 min-w-24 shrink-0">已配置设施:</span>
                          <div className="flex flex-wrap gap-1">
                            {booleanFields.slice(0, 8).map(field => (
                              <Badge key={field.key} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                {field.label}
                              </Badge>
                            ))}
                            {booleanFields.length > 8 && (
                              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                                +{booleanFields.length - 8}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      {poiFields.length > 0 && (
                        <div className="flex gap-2 text-sm">
                          <span className="text-gray-600 min-w-24 shrink-0">周边POI:</span>
                          <div className="flex flex-wrap gap-1">
                            {poiFields.map(field => (
                              <Badge key={field.key} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                {(field.section || field.label || 'POI')} · {asPoiEntries(field).length}条
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${getCompletenessColor(doc.completeness)} transition-all duration-300`}
                        style={{ width: `${doc.completeness}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      {filledFields.length}/{doc.fields.length}
                    </span>
                    <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{doc.completeness}%</span>
                  </div>

                  {missingFields.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-orange-900 mb-1">还有 {missingFields.length} 个必填字段未填写</p>
                          <div className="flex flex-wrap gap-1">
                            {missingFields.slice(0, 5).map((field) => (
                              <Badge key={field.key} variant="outline" className="text-xs bg-orange-100 text-orange-700 border-orange-300">
                                {field.label}
                              </Badge>
                            ))}
                            {missingFields.length > 5 && (
                              <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700">
                                +{missingFields.length - 5}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>最后修改: {doc.lastModified.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {doc.status === 'pending' && missingFields.length === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickConfirm(doc)}
                      className="text-green-600 border-green-200 hover:bg-green-50 w-full"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      快速确认
                    </Button>
                  )}
                  
                  {showImmediateFix && (
                    <Button
                      size="sm"
                      onClick={() => setEditingDoc(doc)}
                      className="bg-blue-600 hover:bg-blue-700 w-full"
                    >
                      立即完善
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}

                  {showEditButton && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingDoc(doc)}
                      className="w-full"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      编辑
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingDocId(doc.id)}
                    className="w-full text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    删除
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {editingDoc && (
        <DocumentEditor
          document={editingDoc}
          onSave={(updatedDoc) => {
            onUpdate(updatedDoc);
            setEditingDoc(null);
          }}
          onCancel={() => setEditingDoc(null)}
        />
      )}

      <AlertDialog open={!!deletingDocId} onOpenChange={() => setDeletingDocId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这个文档吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
