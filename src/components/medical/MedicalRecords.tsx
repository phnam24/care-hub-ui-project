
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Download, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface MedicalRecord {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  type: 'diagnosis' | 'prescription' | 'lab_result' | 'imaging' | 'notes';
  title: string;
  description: string;
  medications?: string[];
  attachments?: string[];
}

const MedicalRecords: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([
    {
      id: '1',
      patientName: 'Nguyễn Văn A',
      doctorName: 'BS. Sarah Johnson',
      date: '2024-06-01',
      type: 'diagnosis',
      title: 'Đánh giá Tăng huyết áp',
      description: 'Bệnh nhân được chẩn đoán tăng huyết áp nhẹ. Các chỉ số huyết áp liên tục trên 140/90.',
      medications: ['Lisinopril 10mg hàng ngày', 'Hydrochlorothiazide 25mg hàng ngày']
    },
    {
      id: '2',
      patientName: 'Trần Thị B',
      doctorName: 'BS. Michael Chen',
      date: '2024-05-28',
      type: 'lab_result',
      title: 'Kết quả Xét nghiệm Máu',
      description: 'Kết quả xét nghiệm máu toàn diện và bảng chuyển hóa trong phạm vi bình thường.',
      attachments: ['ket_qua_xet_nghiem_052824.pdf']
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    type: 'diagnosis' as MedicalRecord['type'],
    title: '',
    description: '',
    medications: ''
  });

  const recordTypes = [
    { value: 'diagnosis', label: 'Chẩn đoán' },
    { value: 'prescription', label: 'Đơn thuốc' },
    { value: 'lab_result', label: 'Kết quả xét nghiệm' },
    { value: 'imaging', label: 'Chẩn đoán hình ảnh' },
    { value: 'notes', label: 'Ghi chú lâm sàng' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRecord: MedicalRecord = {
      id: Date.now().toString(),
      patientName: formData.patientName,
      doctorName: user?.firstName + ' ' + user?.lastName || 'Bác sĩ không xác định',
      date: new Date().toISOString().split('T')[0],
      type: formData.type,
      title: formData.title,
      description: formData.description,
      medications: formData.medications ? formData.medications.split(',').map(m => m.trim()) : undefined
    };

    setRecords(prev => [newRecord, ...prev]);
    toast({
      title: "Đã thêm hồ sơ",
      description: "Hồ sơ y tế đã được thêm thành công.",
    });

    setFormData({
      patientName: '',
      type: 'diagnosis',
      title: '',
      description: '',
      medications: ''
    });
    setShowForm(false);
  };

  const getTypeColor = (type: MedicalRecord['type']) => {
    switch (type) {
      case 'diagnosis': return 'bg-red-100 text-red-800';
      case 'prescription': return 'bg-blue-100 text-blue-800';
      case 'lab_result': return 'bg-green-100 text-green-800';
      case 'imaging': return 'bg-purple-100 text-purple-800';
      case 'notes': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: MedicalRecord['type']) => {
    return recordTypes.find(t => t.value === type)?.label || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Hồ sơ Y tế</h2>
        {user?.role === 'doctor' && (
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm hồ sơ
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Thêm Hồ sơ Y tế</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Tên bệnh nhân</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Loại hồ sơ</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as MedicalRecord['type'] }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    {recordTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              {(formData.type === 'prescription' || formData.type === 'diagnosis') && (
                <div className="space-y-2">
                  <Label htmlFor="medications">Thuốc (phân cách bằng dấu phẩy)</Label>
                  <Input
                    id="medications"
                    value={formData.medications}
                    onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value }))}
                    placeholder="ví dụ: Lisinopril 10mg hàng ngày, Aspirin 81mg hàng ngày"
                  />
                </div>
              )}

              <div className="flex space-x-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Thêm hồ sơ
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {records.map((record) => (
          <Card key={record.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{record.title}</h3>
                    <p className="text-sm text-gray-600">
                      {record.patientName} • {record.doctorName}
                    </p>
                    <p className="text-xs text-gray-500">{record.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getTypeColor(record.type)}>
                    {getTypeLabel(record.type)}
                  </Badge>
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{record.description}</p>

              {record.medications && record.medications.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Thuốc:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {record.medications.map((medication, index) => (
                      <li key={index}>{medication}</li>
                    ))}
                  </ul>
                </div>
              )}

              {record.attachments && record.attachments.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tệp đính kèm:</h4>
                  <div className="flex space-x-2">
                    {record.attachments.map((attachment, index) => (
                      <Button key={index} size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-1" />
                        {attachment}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MedicalRecords;
