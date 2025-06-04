
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Plus, Edit, Trash } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

const AppointmentManager: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      patientName: 'Nguyễn Văn A',
      doctorName: 'BS. Sarah Johnson',
      date: '2024-06-10',
      time: '10:00',
      type: 'Tư vấn',
      status: 'scheduled'
    },
    {
      id: '2',
      patientName: 'Trần Thị B',
      doctorName: 'BS. Michael Chen',
      date: '2024-06-15',
      time: '14:30',
      type: 'Tái khám',
      status: 'scheduled'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    date: '',
    time: '',
    type: '',
    notes: ''
  });

  const appointmentTypes = [
    'Tư vấn',
    'Tái khám',
    'Khám tổng quát',
    'Cấp cứu',
    'Phẫu thuật',
    'Điều trị'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAppointment: Appointment = {
      id: editingAppointment?.id || Date.now().toString(),
      patientName: formData.patientName,
      doctorName: formData.doctorName,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      status: 'scheduled',
      notes: formData.notes
    };

    if (editingAppointment) {
      setAppointments(prev => prev.map(apt => 
        apt.id === editingAppointment.id ? newAppointment : apt
      ));
      toast({
        title: "Đã cập nhật lịch hẹn",
        description: "Lịch hẹn đã được cập nhật thành công.",
      });
    } else {
      setAppointments(prev => [...prev, newAppointment]);
      toast({
        title: "Đã tạo lịch hẹn",
        description: "Lịch hẹn mới đã được đặt thành công.",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      doctorName: '',
      date: '',
      time: '',
      type: '',
      notes: ''
    });
    setShowForm(false);
    setEditingAppointment(null);
  };

  const handleEdit = (appointment: Appointment) => {
    setFormData({
      patientName: appointment.patientName,
      doctorName: appointment.doctorName,
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      notes: appointment.notes || ''
    });
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleDelete = (appointmentId: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    toast({
      title: "Đã hủy lịch hẹn",
      description: "Lịch hẹn đã được hủy.",
      variant: "destructive",
    });
  };

  const updateStatus = (appointmentId: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status } : apt
    ));
    const statusText = status === 'completed' ? 'hoàn thành' : status === 'cancelled' ? 'đã hủy' : 'đã lên lịch';
    toast({
      title: "Đã cập nhật trạng thái",
      description: `Lịch hẹn được đánh dấu là ${statusText}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Lịch hẹn</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Lịch hẹn mới
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingAppointment ? 'Chỉnh sửa Lịch hẹn' : 'Đặt Lịch hẹn Mới'}
            </CardTitle>
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
                  <Label htmlFor="doctorName">Tên bác sĩ</Label>
                  <Input
                    id="doctorName"
                    value={formData.doctorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Ngày</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Giờ</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Loại</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú (Tùy chọn)</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Ghi chú bổ sung về lịch hẹn"
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingAppointment ? 'Cập nhật' : 'Đặt lịch'} hẹn
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {appointment.patientName} → {appointment.doctorName}
                    </h3>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {appointment.date}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {appointment.time}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    appointment.status === 'scheduled' 
                      ? 'bg-blue-100 text-blue-800'
                      : appointment.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status === 'scheduled' ? 'Đã lên lịch' : 
                     appointment.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                  </span>
                  
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(appointment)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(appointment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {appointment.status === 'scheduled' && (
                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() => updateStatus(appointment.id, 'completed')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Đánh dấu Hoàn thành
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(appointment.id, 'cancelled')}
                  >
                    Hủy
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppointmentManager;
