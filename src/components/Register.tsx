
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'doctor';
  specialization?: string;
  phone: string;
}

interface RegisterProps {
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'patient',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Mật khẩu không khớp",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock registration - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Đăng ký thành công",
        description: "Vui lòng kiểm tra email để xác minh tài khoản",
      });
      
      onSwitchToLogin();
    } catch (error) {
      toast({
        title: "Đăng ký thất bại",
        description: "Vui lòng thử lại sau",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">CareHub</span>
          </div>
          <CardTitle className="text-2xl font-bold">Tạo tài khoản</CardTitle>
          <CardDescription>
            Tham gia nền tảng chăm sóc sức khỏe của chúng tôi
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Tên</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Họ</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Vai trò</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Bệnh nhân</SelectItem>
                  <SelectItem value="doctor">Bác sĩ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === 'doctor' && (
              <div className="space-y-2">
                <Label htmlFor="specialization">Chuyên khoa</Label>
                <Input
                  id="specialization"
                  value={formData.specialization || ''}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  placeholder="ví dụ: Tim mạch, Nhi khoa"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 healthcare-gradient text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </Button>
            
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Đăng nhập
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
