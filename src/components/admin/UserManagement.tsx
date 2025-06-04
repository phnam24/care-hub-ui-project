
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Search, UserPlus, Edit, Trash, Shield, Heart, UserCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  specialization?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      firstName: 'Văn A',
      lastName: 'Nguyễn',
      email: 'john.doe@example.com',
      role: 'patient',
      status: 'active',
      lastLogin: '2024-06-01',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      firstName: 'Thị B',
      lastName: 'Sarah',
      email: 'sarah.johnson@hospital.com',
      role: 'doctor',
      status: 'active',
      lastLogin: '2024-06-02',
      createdAt: '2024-02-10',
      specialization: 'Tim mạch'
    },
    {
      id: '3',
      firstName: 'Văn C',
      lastName: 'Michael',
      email: 'michael.chen@hospital.com',
      role: 'doctor',
      status: 'active',
      lastLogin: '2024-05-30',
      createdAt: '2024-03-05',
      specialization: 'Đa khoa'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor': return <Heart className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      default: return <UserCheck className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    toast({
      title: "Đã cập nhật trạng thái",
      description: `Trạng thái người dùng đã được thay đổi thành ${newStatus === 'active' ? 'hoạt động' : newStatus === 'inactive' ? 'không hoạt động' : 'tạm ngừng'}.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "Đã xóa người dùng",
      description: "Người dùng đã được xóa khỏi hệ thống.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm người dùng theo tên hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="patient">Bệnh nhân</option>
                <option value="doctor">Bác sĩ</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            <p className="text-sm text-gray-600">Tổng người dùng</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.role === 'patient').length}
            </p>
            <p className="text-sm text-gray-600">Bệnh nhân</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.role === 'doctor').length}
            </p>
            <p className="text-sm text-gray-600">Bác sĩ</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.status === 'active').length}
            </p>
            <p className="text-sm text-gray-600">Người dùng hoạt động</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Người dùng ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Đăng nhập lần cuối</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.specialization && (
                        <p className="text-xs text-gray-500">{user.specialization}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getRoleColor(user.role)} flex items-center space-x-1 w-fit`}>
                      {getRoleIcon(user.role)}
                      <span className="capitalize">
                        {user.role === 'patient' ? 'Bệnh nhân' : user.role === 'doctor' ? 'Bác sĩ' : 'Quản trị'}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status === 'active' ? 'Hoạt động' : user.status === 'inactive' ? 'Không hoạt động' : 'Tạm ngừng'}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value as User['status'])}
                        className="text-xs p-1 border rounded"
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                        <option value="suspended">Tạm ngừng</option>
                      </select>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
