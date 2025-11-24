export enum LabId {
  LAB_1 = "Lab 1 (Multimedia)",
  LAB_2 = "Lab 2 (Network/Code)"
}

export enum Status {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected"
}

export interface Rombel {
  id: string;
  name: string; // e.g., "X TKR 1"
  department: string; // e.g., "Teknik Kendaraan Ringan"
  grade: string; // e.g., "X"
  studentCount: number;
}

export interface Booking {
  id: string;
  teacherName: string;
  subject: string;
  rombelId: string;
  rombelName: string;
  labId: LabId;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: Status;
  notes?: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'teacher';
}

export interface UserState {
  isLoggedIn: boolean;
  role: 'guest' | 'teacher' | 'admin';
  name: string;
  username?: string;
}

export interface SchoolInfo {
  name: string;
  address: string;
  description: string;
  departments: string[];
}