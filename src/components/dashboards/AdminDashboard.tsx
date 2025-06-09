import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Activity, TrendingUp, Shield, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserManagement from '../admin/UserManagement';
import AppointmentManager from '../appointments/AppointmentManager';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'appointments'>('dashboard');

  const systemStats = [
    { label: 'Tổng bệnh nhân', value: '2,847', change: '+12%', icon: Users },
    { label: 'Bác sĩ đang hoạt động', value: '156', change: '+3%', icon: Activity },
    { label: 'Lịch hẹn hôm nay', value: '324', change: '+8%', icon: Calendar },
    { label: 'Thời gian hoạt động hệ thống', value: '99.9%', change: '+0.1%', icon: TrendingUp }
  ];

  const recentActivities = [
    { id: 1, action: 'Bác sĩ mới đăng ký', user: 'BS. Sarah Wilson', time: '10 phút trước' },
    { id: 2, action: 'Hồ sơ bệnh nhân được cập nhật', user: 'Nguyễn Văn A', time: '25 phút trước' },
    { id: 3, action: 'Sao lưu hệ thống hoàn tất', user: 'Hệ thống', time: '1 giờ trước' },
    { id: 4, action: 'Lịch hẹn mới được đặt', user: 'Trần Thị B', time: '2 giờ trước' },
  ];

  const pendingApprovals = [
    { id: 1, type: 'Đăng ký Bác sĩ', name: 'BS. Michael Brown', specialty: 'Tim mạch' },
    { id: 2, type: 'Truy cập Cơ sở', name: 'Trung tâm Y tế Khu vực', location: 'Trung tâm thành phố' },
    { id: 3, type: 'Yêu cầu Xuất dữ liệu', name: 'Phòng Nghiên cứu', purpose: 'Nghiên cứu Lâm sàng' },
  ];

  if (activeView === 'users') {
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
        <UserManagement />
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Tổng quan Hệ thống
        </h1>
        <p className="text-purple-100">
          Chào mừng trở lại, {user?.first_name}. Đây là tình hình của hệ thống chăm sóc sức khỏe hôm nay.
        </p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {systemStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Hoạt động Hệ thống Gần đây</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.user}</p>
                  </div>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Xem Nhật ký Hoạt động
            </Button>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-orange-500" />
              <span>Chờ Phê duyệt</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{approval.name}</h3>
                      <p className="text-sm text-gray-600">{approval.type}</p>
                      <p className="text-sm text-gray-500">
                        {'specialty' in approval ? approval.specialty : 'location' in approval ? approval.location : approval.purpose}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Phê duyệt
                    </Button>
                    <Button size="sm" variant="outline">
                      Xem xét
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Xem Tất cả Phê duyệt
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          className="h-16 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700"
          onClick={() => setActiveView('users')}
        >
          <Users className="w-5 h-5" />
          <span>Quản lý Người dùng</span>
        </Button>
        <Button variant="outline" className="h-16 flex items-center justify-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Cài đặt Hệ thống</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-16 flex items-center justify-center space-x-2"
          onClick={() => setActiveView('appointments')}
        >
          <Activity className="w-5 h-5" />
          <span>Báo cáo & Phân tích</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
