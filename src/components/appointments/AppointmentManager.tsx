import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, User, Plus, Edit, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import apiService from "@/services/apiService";
import { scheduler } from "timers/promises";

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  patientId?: number;
  doctorId?: string;
  date: string;
  time: string;
  type: string;
  status: "pending" | "confirmed" | "canceled";
  notes?: string;
}

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
}

const formatAppointment = (raw: any, user: any): Appointment => {
  const [date, timeWithTZ] = raw.scheduled_time.split("T");
  const time = timeWithTZ.slice(0, 5);
  return {
    id: raw.id,
    doctorId: raw.doctor_id,
    patientId: raw.patient_id,
    patientName:
      raw.patient_name || `${user.first_name} ${user.last_name}` || "Bệnh nhân",
    doctorName: raw.doctor_name ? `BS. ${raw.doctor_name}` : "",
    date,
    time,
    type: raw.type,
    status: raw.status,
    notes: raw.reason,
  };
};

const AppointmentManager: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiService.getMyAppointments(user.role);
        setAppointments(
          res.data.map((raw: any) => formatAppointment(raw, user))
        );
      } catch {
        toast({ title: "Lỗi", description: "Không thể tải lịch hẹn." });
      }
    })();
  }, [user]);

  // Fetch doctors once on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await apiService.getAllDoctors(); // ← your doctors endpoint
        setDoctors(res.data);
      } catch {
        toast({ title: "Lỗi", description: "Không thể tải danh sách bác sĩ." });
      }
    })();
  }, []); // empty deps → runs once

  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    doctorId: "",
    patientId: user.id,
    date: "",
    time: "",
    type: "",
    notes: "",
  });

  const appointmentTypes = [
    "Tư vấn",
    "Tái khám",
    "Khám tổng quát",
    "Cấp cứu",
    "Phẫu thuật",
    "Điều trị",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

      const newAppointment: Appointment = {
      id: editingAppointment?.id || Date.now().toString(),
      patientName: formData.patientName,
      doctorName: formData.doctorName,
      doctorId: formData.doctorId,
      patientId: user.id,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      status: "pending",
      notes: formData.notes,
    };

      const newAppointment2 = {
      doctorName: formData.doctorName,
      doctorId: formData.doctorId,
      patientId: user.id,
      scheduled_time: `${formData.date}T${formData.time}:00`,
      type: formData.type,
      status: "pending",
    };

    const payload = {
      doctor_id: formData.doctorId,
      scheduled_time: `${formData.date}T${formData.time}:00`,
      reason: formData.notes || "",
      type: formData.type,
    }

    try {
      let saved: Appointment;

      if (editingAppointment) {
        // update existing appointment
        const res = await apiService.updateAppointment(
          editingAppointment.id,
          payload
        );
        console.log("payload", payload);
        console.log("API response:", res.data);
        saved = formatAppointment(res.data, user);
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === saved.id ? saved : apt))
        );
        toast({
          title: "Đã cập nhật lịch hẹn",
          description: "Lịch hẹn đã được cập nhật thành công.",
        });
      } else {
        // create new one
        const res = await apiService.createAppointment(payload);
        console.log("payload", payload);
        console.log("API response:", res.data);
        saved = formatAppointment(res.data, user);
        setAppointments((prev) => [...prev, newAppointment]);
        toast({
          title: "Đã tạo lịch hẹn",
          description: "Lịch hẹn mới đã được đặt thành công.",
        });
      }

      resetForm();
    } catch (err) {
      console.error("API error:", err);
      toast({
        title: "Lỗi",
        description: editingAppointment
          ? "Không thể cập nhật lịch hẹn."
          : "Không thể tạo lịch hẹn mới.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      patientName: "",
      doctorName: "",
      doctorId: undefined,
      patientId: user.id,
      date: "",
      time: "",
      type: "",
      notes: "",
    });
    setShowForm(false);
    setEditingAppointment(null);
  };

  const handleEdit = (appointment: Appointment) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFormData({
      patientName: appointment.patientName,
      doctorName: appointment.doctorName,
      doctorId: appointment.doctorId,
      patientId: user.id,
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      notes: appointment.notes || "",
    });
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const updateStatus = async (
    appointmentId: string,
    status: Appointment["status"]
  ) => {
    const appointment = appointments.find((apt) => apt.id === appointmentId);
    const payload = {
      doctor_id: appointment.doctorId,
      scheduled_time: `${appointment.date}T${appointment.time}:00`,
      status,
      reason: appointment.notes || "",
      type: appointment.type,
    }

    const statusText =
    status === "confirmed"
      ? "đã duyệt"
      : status === "canceled"
      ? "đã hủy"
      : "đang xử lý";

    try {
    // 1) Call the API
    const res = await apiService.updateAppointment(appointmentId, payload);
    console.log("payload", payload);
    console.log("API response:", res.data);
    // 2) Normalize with your formatter (so you keep date formatting etc)
    const updatedApt = formatAppointment(res.data, user);


    // 3) Update local state
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? updatedApt : apt))
    );

    // 4) Success toast
    toast({
      title: "Đã cập nhật trạng thái",
      description: `Lịch hẹn được đánh dấu là ${statusText}.`,
    });
  } catch (err) {
    console.error("Failed to update status", err);
    toast({
      title: "Lỗi",
      description: `Không thể cập nhật trạng thái lịch hẹn thành ${statusText}.`,
      variant: "destructive",
    });
  }
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Lịch hẹn</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Lịch hẹn mới
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingAppointment ? "Chỉnh sửa Lịch hẹn" : "Đặt Lịch hẹn Mới"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Tên bệnh nhân</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        patientName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctorId">Tên bác sĩ</Label>
                  <Select
                    value={formData.doctorId?.toString() || ""}
                    onValueChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        doctorId: val,
                      }))
                    }
                    required
                  >
                    <SelectTrigger className="w-full" id="doctorId">
                      <SelectValue placeholder="Chọn bác sĩ" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id.toString()}>
                          {`${doc.id} – ${doc.first_name} ${doc.last_name}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Ngày</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Giờ</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, time: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Loại</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú (Tùy chọn)</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Ghi chú bổ sung về lịch hẹn"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {editingAppointment ? "Cập nhật" : "Đặt lịch"} hẹn
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {appointment.patientName} → {appointment.doctorName}
                    </h3>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {appointment.date}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {appointment.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      appointment.status === "pending"
                        ? "bg-blue-100 text-blue-800"
                        : appointment.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {appointment.status === "pending"
                      ? "Đang xử lý"
                      : appointment.status === "confirmed"
                      ? "Đã duyệt"
                      : "Đã hủy"}
                  </span>

                  {appointment.status === "pending" &&
                    user.role === "patient" && (
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(appointment)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                </div>
              </div>

              {appointment.status === "pending" && user.role === "doctor" && (
                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() => updateStatus(appointment.id, "confirmed")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Duyệt
                  </Button>
                </div>
              )}

              {appointment.status === "pending" && (
                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(appointment.id, "canceled")}
                  >
                    Hủy
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppointmentManager;
