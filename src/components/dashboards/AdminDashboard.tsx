
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Activity, TrendingUp, Shield, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const systemStats = [
    { label: 'Total Patients', value: '2,847', change: '+12%', icon: Users },
    { label: 'Active Doctors', value: '156', change: '+3%', icon: Activity },
    { label: 'Today\'s Appointments', value: '324', change: '+8%', icon: Calendar },
    { label: 'System Uptime', value: '99.9%', change: '+0.1%', icon: TrendingUp }
  ];

  const recentActivities = [
    { id: 1, action: 'New doctor registered', user: 'Dr. Sarah Wilson', time: '10 minutes ago' },
    { id: 2, action: 'Patient record updated', user: 'John Doe', time: '25 minutes ago' },
    { id: 3, action: 'System backup completed', user: 'System', time: '1 hour ago' },
    { id: 4, action: 'New appointment scheduled', user: 'Jane Smith', time: '2 hours ago' },
  ];

  const pendingApprovals = [
    { id: 1, type: 'Doctor Registration', name: 'Dr. Michael Brown', specialty: 'Cardiology' },
    { id: 2, type: 'Facility Access', name: 'Regional Medical Center', location: 'Downtown' },
    { id: 3, type: 'Data Export Request', name: 'Research Department', purpose: 'Clinical Study' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          System Overview
        </h1>
        <p className="text-purple-100">
          Welcome back, {user?.firstName}. Here's what's happening in your healthcare system today.
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
              <span>Recent System Activities</span>
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
              View Activity Log
            </Button>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-orange-500" />
              <span>Pending Approvals</span>
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
                      Approve
                    </Button>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Approvals
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="h-16 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700">
          <Users className="w-5 h-5" />
          <span>User Management</span>
        </Button>
        <Button variant="outline" className="h-16 flex items-center justify-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>System Settings</span>
        </Button>
        <Button variant="outline" className="h-16 flex items-center justify-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Reports & Analytics</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
