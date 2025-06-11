export type ClassEntry = {
  course: string;
  faculty: string;
  start: string;
  end: string;
  room: string;
};

export type WeeklySchedule = {
  [day: string]: ClassEntry[];
};

export const WEEKLY_SCHEDULE: WeeklySchedule = {
  Monday: [
    { course: 'CSE1001', faculty: 'Prof. Rao', start: '08:00', end: '08:50', room: '101' },
    { course: 'MAT1002', faculty: 'Dr. Singh', start: '09:00', end: '09:50', room: '201' },
    { course: 'PHY1003', faculty: 'Dr. Patel', start: '10:00', end: '10:50', room: 'Lab 1' },
    { course: 'ENG1004', faculty: 'Ms. James', start: '11:00', end: '11:50', room: '305' },
  ],
  Tuesday: [
    { course: 'CHE1005', faculty: 'Dr. Verma', start: '08:00', end: '08:50', room: '202' },
    { course: 'CSE1001', faculty: 'Prof. Rao', start: '09:00', end: '09:50', room: '101' },
    { course: 'MAT1002', faculty: 'Dr. Singh', start: '10:00', end: '10:50', room: '201' },
    { course: 'PHY1003', faculty: 'Dr. Patel', start: '11:00', end: '11:50', room: 'Lab 1' },
  ],
  Wednesday: [
    { course: 'ENG1004', faculty: 'Ms. James', start: '08:00', end: '08:50', room: '305' },
    { course: 'CSE1001', faculty: 'Prof. Rao', start: '09:00', end: '09:50', room: '101' },
    { course: 'CHE1005', faculty: 'Dr. Verma', start: '10:00', end: '10:50', room: '202' },
    { course: 'MAT1002', faculty: 'Dr. Singh', start: '11:00', end: '11:50', room: '201' },
  ],
  Thursday: [
    { course: 'PHY1003', faculty: 'Dr. Patel', start: '08:00', end: '08:50', room: 'Lab 1' },
    { course: 'ENG1004', faculty: 'Ms. James', start: '09:00', end: '09:50', room: '305' },
    { course: 'CSE1001', faculty: 'Prof. Rao', start: '10:00', end: '10:50', room: '101' },
    { course: 'CHE1005', faculty: 'Dr. Verma', start: '11:00', end: '11:50', room: '202' },
  ],
  Friday: [
    { course: 'MAT1002', faculty: 'Dr. Singh', start: '08:00', end: '08:50', room: '201' },
    { course: 'PHY1003', faculty: 'Dr. Patel', start: '09:00', end: '09:50', room: 'Lab 1' },
    { course: 'ENG1004', faculty: 'Ms. James', start: '10:00', end: '10:50', room: '305' },
    { course: 'CHE1005', faculty: 'Dr. Verma', start: '11:00', end: '11:50', room: '202' },
  ],
  Saturday: [
    { course: 'CSE1001', faculty: 'Prof. Rao', start: '09:00', end: '10:30', room: '101' },
    { course: 'LAB Project', faculty: 'Staff', start: '10:45', end: '12:15', room: 'Innovation Lab' },
  ],
};

export default WEEKLY_SCHEDULE;
