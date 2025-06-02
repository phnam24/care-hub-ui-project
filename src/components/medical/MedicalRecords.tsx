
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
      patientName: 'John Doe',
      doctorName: 'Dr. Sarah Johnson',
      date: '2024-06-01',
      type: 'diagnosis',
      title: 'Hypertension Assessment',
      description: 'Patient diagnosed with mild hypertension. Blood pressure readings consistently above 140/90.',
      medications: ['Lisinopril 10mg daily', 'Hydrochlorothiazide 25mg daily']
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      doctorName: 'Dr. Michael Chen',
      date: '2024-05-28',
      type: 'lab_result',
      title: 'Blood Work Results',
      description: 'Complete blood count and metabolic panel results within normal ranges.',
      attachments: ['lab_results_052824.pdf']
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
    { value: 'diagnosis', label: 'Diagnosis' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'lab_result', label: 'Lab Result' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'notes', label: 'Clinical Notes' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRecord: MedicalRecord = {
      id: Date.now().toString(),
      patientName: formData.patientName,
      doctorName: user?.firstName + ' ' + user?.lastName || 'Unknown Doctor',
      date: new Date().toISOString().split('T')[0],
      type: formData.type,
      title: formData.title,
      description: formData.description,
      medications: formData.medications ? formData.medications.split(',').map(m => m.trim()) : undefined
    };

    setRecords(prev => [newRecord, ...prev]);
    toast({
      title: "Record Added",
      description: "Medical record has been successfully added.",
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
        <h2 className="text-2xl font-bold text-gray-900">Medical Records</h2>
        {user?.role === 'doctor' && (
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Medical Record</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Record Type</Label>
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
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
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
                  <Label htmlFor="medications">Medications (comma-separated)</Label>
                  <Input
                    id="medications"
                    value={formData.medications}
                    onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value }))}
                    placeholder="e.g., Lisinopril 10mg daily, Aspirin 81mg daily"
                  />
                </div>
              )}

              <div className="flex space-x-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Add Record
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
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
                  <h4 className="font-medium text-gray-900 mb-2">Medications:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {record.medications.map((medication, index) => (
                      <li key={index}>{medication}</li>
                    ))}
                  </ul>
                </div>
              )}

              {record.attachments && record.attachments.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Attachments:</h4>
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
