import { useEffect } from 'react';
import { NativeModules } from 'react-native';

export default function Attendance() {
  useEffect(() => {
    NativeModules.AttendanceModule.openAttendance();
  }, []);
  return null;
}
