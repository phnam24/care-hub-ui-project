import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, Heart, Plus, User, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AppointmentManager from '../appointments/AppointmentManager';
import MedicalRecords from '../medical/MedicalRecords';
import ChatBot from '../chat/ChatBot';
import apiService from '@/services/apiService';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'appointments' | 'records' | 'chat'>('dashboard');

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await apiService.getMyAppointments(user.role);
        const rawAppointments = response.data;

        const formatted = await Promise.all(
          rawAppointments
            .filter((appt: any) => {
              const isConfirmed = appt.status === "confirmed";
              const isFuture = new Date(appt.scheduled_time) > new Date();
              return isConfirmed && isFuture;
            })
            .map(async (appt: any) => {
              return {
                id: appt.id,
                doctor: `BS. ${appt.doctor_name}`,
                reason: appt.reason || "Khám bệnh",
                type: appt.type || "Khám tổng quát",
                date: appt.scheduled_time.split("T")[0],
                time: appt.scheduled_time.split("T")[1].slice(0, 5),
                status: appt.status,
              };
            })
        );

        setUpcomingAppointments(formatted);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const recentRecords = [
    {
      id: 1,
      type: 'Kết quả xét nghiệm',
      date: '2024-06-01',
      doctor: 'BS. Sarah Johnson',
      status: 'Bình thường'
    },
    {
      id: 2,
      type: 'Đơn thuốc',
      date: '2024-05-28',
      doctor: 'BS. Michael Chen',
      status: 'Đang sử dụng'
    }
  ];

  const vitalStats = [
    { label: 'Huyết áp', value: '120/80', unit: 'mmHg', status: 'normal' },
    { label: 'Nhịp tim', value: '72', unit: 'bpm', status: 'normal' },
    { label: 'Cân nặng', value: '70', unit: 'kg', status: 'normal' },
    { label: 'Nhiệt độ', value: '37', unit: '°C', status: 'normal' }
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

  if (activeView === 'chat') {
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
        <ChatBot />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Chào mừng trở lại, {user?.last_name}!
        </h1>
        <p className="text-blue-100">
          Đây là tổng quan về thông tin sức khỏe và lịch hẹn sắp tới của bạn.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button 
          className="h-16 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700"
          onClick={() => setActiveView('appointments')}
        >
          <Plus className="w-5 h-5" />
          <span>Đặt lịch hẹn</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-16 flex items-center justify-center space-x-2"
          onClick={() => setActiveView('records')}
        >
          <FileText className="w-5 h-5" />
          <span>Xem hồ sơ</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-16 flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
          onClick={() => setActiveView('chat')}
        >
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <span className="text-blue-600">Tư vấn AI</span>
        </Button>
        <Button variant="outline" className="h-16 flex items-center justify-center space-x-2">
          <User className="w-5 h-5" />
          <span>Cập nhật hồ sơ</span>
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Lịch hẹn sắp tới</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.doctor}</h3>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                      <p className="text-blue-800">{appointment.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{appointment.date}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {appointment.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => setActiveView('appointments')}
            >
              Xem tất cả lịch hẹn
            </Button>
          </CardContent>
        </Card>

        {/* Vital Signs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>Chỉ số sức khỏe mới nhất</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vitalStats.map((vital, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{vital.label}</p>
                    <p className="text-xs text-gray-500">Đo gần nhất</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {vital.value} <span className="text-sm font-normal">{vital.unit}</span>
                    </p>
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Medical Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-green-600" />
            <span>Hồ sơ y tế gần đây</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentRecords.map((record) => (
              <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{record.type}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {record.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Bởi {record.doctor}</p>
                <p className="text-sm text-gray-500">{record.date}</p>
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => setActiveView('records')}
          >
            Xem tất cả hồ sơ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;
