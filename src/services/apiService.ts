
const API_GATEWAY_URL = 'http://localhost'; // Replace with your actual API Gateway URL

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'patient' | 'doctor' | 'admin';
  phone_number: string | null;
}

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  role: 'patient' | 'doctor' | 'admin';
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'patient' | 'doctor' | 'admin';
  phone_number: string | null;
}

interface LoginResponse {
  access: string;
  refresh: string;
}

interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  doctor_name: string;
  scheduled_time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_GATEWAY_URL) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('healthcareToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth Service endpoints
  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/api/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async register(payload: RegisterPayload): Promise<ApiResponse<User>> {
  return this.request<User>('/auth/api/register/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/api/me/', {
      method: 'GET',
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  // Patient Service endpoints
  async getPatientProfile(patientId: string) {
    return this.request(`/patients/api/${patientId}`);
  }

  async updatePatientProfile(patientId: string, data: any) {
    return this.request(`/patients/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getPatientMedicalRecords(patientId: string) {
    return this.request(`/patients/${patientId}/medical-records`);
  }

  // Doctor Service endpoints
  async getDoctorProfile(doctorId: string) {
    return this.request(`/doctors/${doctorId}`);
  }

  async getDoctorSchedule(doctorId: string, date?: string) {
    const queryParam = date ? `?date=${date}` : '';
    return this.request(`/doctors/${doctorId}/schedule${queryParam}`);
  }

  async getAllDoctors(): Promise<ApiResponse<Doctor[]>> {
    return this.request('/auth/api/users/doctors/');
  }

  // Appointment Service endpoints
  async getMyAppointments(role: string): Promise<ApiResponse<Appointment[]>> {
    if (role === 'patient') {
      return this.request<Appointment[]>('/patients/api/appointments/');
    }
    return this.request(`/appointments/api/appointments/doctor/`);
  }

  async createAppointment(appointmentData: any) {
    return this.request('/patients/api/book-appointment/', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointment(appointmentId: string, data: any) {
    return this.request(`/appointments/api/appointments/${appointmentId}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelAppointment(appointmentId: string) {
    return this.request(`/appointments/${appointmentId}/`, {
      method: 'DELETE',
    });
  }

  // Admin Service endpoints
  async getSystemStats() {
    return this.request('/admin/stats');
  }

  async getAllUsers() {
    return this.request('/admin/users');
  }

  async updateUserStatus(userId: string, status: string) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
