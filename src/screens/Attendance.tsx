import { useEffect } from 'react';
import { NativeModules } from 'react-native';

export default function Attendance() {
  useEffect(() => {
    const module = NativeModules.AttendanceModule;
    if (module && typeof module.openAttendance === 'function') {
      module.openAttendance();
    } else {
      console.warn('AttendanceModule not available');
    }
  }, []);
  return null;
}
