import { SchoolInfo, Rombel, Booking, LabId, Status, User } from './types';

export const SCHOOL_INFO: SchoolInfo = {
  name: "SMK Bina Nusantara",
  address: "Jl Gardusayang No.09, Kecamatan Cisalak, Subang, 41283",
  description: "Sekolah Menengah Kejuruan yang mengedepankan teknologi dan keterampilan praktis.",
  departments: [
    "Teknik Kendaraan Ringan (TKR)",
    "Teknik Jaringan Komputer dan Telekomunikasi (TJKT)",
    "Busana",
    "Perhotelan"
  ]
};

// Generate Rombels based on the prompt
const generateRombels = (): Rombel[] => {
  const rombels: Rombel[] = [];
  const grades = ["X", "XI", "XII"];
  
  // TKR & TJKT (3 classes each grade)
  ["Teknik Kendaraan Ringan", "Teknik Jaringan Komputer"].forEach(dept => {
    const abbr = dept === "Teknik Kendaraan Ringan" ? "TKR" : "TJKT";
    grades.forEach(grade => {
      for (let i = 1; i <= 3; i++) {
        rombels.push({
          id: `${grade}-${abbr}-${i}`,
          name: `${grade} ${abbr} ${i}`,
          department: dept,
          grade,
          studentCount: 32
        });
      }
    });
  });

  // Busana & Perhotelan (1 class each grade)
  ["Busana", "Perhotelan"].forEach(dept => {
    grades.forEach(grade => {
       rombels.push({
          id: `${grade}-${dept}-1`,
          name: `${grade} ${dept}`,
          department: dept,
          grade,
          studentCount: 30
        });
    });
  });

  return rombels;
};

export const ROMBELS = generateRombels();

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "b1",
    teacherName: "Pak Budi",
    subject: "Dasar Kejuruan TJKT",
    rombelId: "X-TJKT-1",
    rombelName: "X TJKT 1",
    labId: LabId.LAB_1,
    date: new Date().toISOString().split('T')[0], // Today
    startTime: "08:00",
    endTime: "10:00",
    status: Status.APPROVED,
    notes: "Instalasi OS"
  },
  {
    id: "b2",
    teacherName: "Bu Siti",
    subject: "Desain Digital",
    rombelId: "XI-Busana-1",
    rombelName: "XI Busana",
    labId: LabId.LAB_2,
    date: new Date().toISOString().split('T')[0], // Today
    startTime: "08:00",
    endTime: "09:30",
    status: Status.APPROVED,
    notes: "Pola Digital"
  },
  {
    id: "b3",
    teacherName: "Pak Asep",
    subject: "Simulasi Digital",
    rombelId: "X-TKR-2",
    rombelName: "X TKR 2",
    labId: LabId.LAB_1,
    date: new Date().toISOString().split('T')[0], // Today
    startTime: "10:30",
    endTime: "12:00",
    status: Status.PENDING,
    notes: "Ujian Praktik"
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'admin',
    username: 'admin',
    password: 'admin',
    name: 'Administrator Lab',
    role: 'admin'
  },
  {
    id: 'u1',
    username: 'Salsa',
    password: 'guru',
    name: 'Ibu Salsa',
    role: 'teacher'
  },
  {
    id: 'u2',
    username: 'guru2',
    password: '123',
    name: 'Bu Siti',
    role: 'teacher'
  }
];