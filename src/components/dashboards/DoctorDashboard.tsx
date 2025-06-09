import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, FileText, Activity, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AppointmentManager from '../appointments/AppointmentManager';
import MedicalRecords from '../medical/MedicalRecords';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'appointments' | 'records'>('dashboard');

  const todaysAppointments = [
    {
      id: 1,
      patient: 'Nguyễn Văn A',
      time: '9:00',
      type: 'Tái khám',
      status: 'confirmed'
    },
    {
      id: 2,
      patient: 'Trần Thị B',
      time: '10:30',
      type: 'Tư vấn',
      status: 'confirmed'
    },
    {
      id: 3,
      patient: 'Lê Văn C',
      time: '14:00',
      type: 'Khám tổng quát',
      status: 'pending'
    },
    {
      id: 4,
      patient: 'Phạm Thị D',
      time: '15:30',
      type: 'Tái khám',
      status: 'confirmed'
    }
  ];

  const pendingTasks = [
    { id: 1, task: 'Xem kết quả xét nghiệm của Nguyễn Văn A', priority: 'high' },
    { id: 2, task: 'Hoàn thành tóm tắt xuất viện cho Trần Thị B', priority: 'medium' },
    { id: 3, task: 'Cập nhật đơn thuốc cho Lê Văn C', priority: 'low' },
  ];

  const stats = [
    { label: 'Bệnh nhân hôm nay', value: '12', change: '+2' },
    { label: 'Chờ xem xét', value: '8', change: '-1' },
    { label: 'Tuần này', value: '67', change: '+5' },
    { label: 'Đánh giá bệnh nhân', value: '4.9', change: '+0.1' }
  ];

  if (activeView === 'appointments') {
    return (
      <div>
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setActiveView('dashboard')}
            className="mb-4"
          >
            ← Quay lại Trang chính
          </Button>
        </div>
        <AppointmentManager />
      </div>
    );
  }

  if (activeView === 'records') {
    return (
      <div>
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setActiveView('dashboard')}
            className="mb-4"
          >
            ← Quay lại Trang chính
          </Button>
        </div>
        <MedicalRecords />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Chào buổi sáng, BS. {user?.first_name}!
        </h1>
        <p className="text-green-100">
          Bạn có 12 bệnh nhân đã đặt lịch hôm nay. Cuộc hẹn tiếp theo là lúc 9:00 sáng.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="text-sm text-green-600 font-medium">
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Lịch hôm nay</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.patient}</h3>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-medium text-gray-900 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {appointment.time}
                      </p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => setActiveView('appointments')}
            >
              Xem lịch đầy đủ
            </Button>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <span>Công việc chờ xử lý</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <p className="text-sm text-gray-900 mb-2">{task.task}</p>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === 'high' 
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.priority === 'high' ? 'Ưu tiên cao' : task.priority === 'medium' ? 'Ưu tiên trung bình' : 'Ưu tiên thấp'}
                    </span>
                    <Button size="sm" variant="ghost">
                      Hoàn thành
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Xem tất cả công việc
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          className="h-16 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700"
          onClick={() => setActiveView('records')}
        >
          <FileText className="w-5 h-5" />
          <span>Hồ sơ bệnh nhân</span>
        </Button>
        <Button variant="outline" className="h-16 flex items-center justify-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Kết quả xét nghiệm</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-16 flex items-center justify-center space-x-2"
          onClick={() => setActiveView('appointments')}
        >
          <Calendar className="w-5 h-5" />
          <span>Quản lý lịch hẹn</span>
        </Button>
      </div>
    </div>
  );
};

export default DoctorDashboard;
