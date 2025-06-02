
const API_GATEWAY_URL = 'http://localhost:8000/api'; // Replace with your actual API Gateway URL

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
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
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  // Patient Service endpoints
  async getPatientProfile(patientId: string) {
    return this.request(`/patients/${patientId}`);
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

  async getAllDoctors() {
    return this.request('/doctors');
  }

  // Appointment Service endpoints
  async getAppointments(userId: string, userType: 'patient' | 'doctor') {
    return this.request(`/appointments?${userType}_id=${userId}`);
  }

  async createAppointment(appointmentData: any) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointment(appointmentId: string, data: any) {
    return this.request(`/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelAppointment(appointmentId: string) {
    return this.request(`/appointments/${appointmentId}`, {
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
