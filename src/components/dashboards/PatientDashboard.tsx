
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, Heart, Plus, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2024-06-10',
      time: '10:00 AM',
      type: 'Follow-up'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'General Practice',
      date: '2024-06-15',
      time: '2:30 PM',
      type: 'Annual Checkup'
    }
  ];

  const recentRecords = [
    {
      id: 1,
      type: 'Lab Results',
      date: '2024-06-01',
      doctor: 'Dr. Sarah Johnson',
      status: 'Normal'
    },
    {
      id: 2,
      type: 'Prescription',
      date: '2024-05-28',
      doctor: 'Dr. Michael Chen',
      status: 'Active'
    }
  ];

  const vitalStats = [
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal' },
    { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal' },
    { label: 'Weight', value: '70', unit: 'kg', status: 'normal' },
    { label: 'Temperature', value: '98.6', unit: '°F', status: 'normal' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-blue-100">
          Here's an overview of your health information and upcoming appointments.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="h-16 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700">
          <Plus className="w-5 h-5" />
          <span>Book Appointment</span>
        </Button>
        <Button variant="outline" className="h-16 flex items-center justify-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>View Records</span>
        </Button>
        <Button variant="outline" className="h-16 flex items-center justify-center space-x-2">
          <User className="w-5 h-5" />
          <span>Update Profile</span>
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Upcoming Appointments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.doctor}</h3>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      <p className="text-sm text-gray-500">{appointment.type}</p>
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
            <Button variant="outline" className="w-full mt-4">
              View All Appointments
            </Button>
          </CardContent>
        </Card>

        {/* Vital Signs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>Latest Vitals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vitalStats.map((vital, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{vital.label}</p>
                    <p className="text-xs text-gray-500">Latest reading</p>
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
            <span>Recent Medical Records</span>
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
                <p className="text-sm text-gray-600 mb-1">By {record.doctor}</p>
                <p className="text-sm text-gray-500">{record.date}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Records
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;
