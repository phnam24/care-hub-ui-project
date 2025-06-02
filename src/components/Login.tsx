
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Heart, Shield, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      toast({
        title: "Login Successful",
        description: "Welcome to CareHub!",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const demoAccounts = [
    { type: 'Patient', email: 'patient@example.com', icon: Users },
    { type: 'Doctor', email: 'doctor@example.com', icon: Heart },
    { type: 'Admin', email: 'admin@example.com', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">CareHub</h1>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Your Health,
            <span className="text-blue-600"> Connected</span>
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Access your medical records, schedule appointments, and connect with healthcare providers in one secure platform.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-6">
            {demoAccounts.map((account) => (
              <Card key={account.type} className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setEmail(account.email)}>
                <account.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-sm">{account.type}</p>
                <p className="text-xs text-gray-500">Demo</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 healthcare-gradient text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
              
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Demo: Use any password with the emails above
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
