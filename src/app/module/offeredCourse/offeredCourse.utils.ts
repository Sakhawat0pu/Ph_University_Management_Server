import { TSchedule } from './offeredCourse.interface';

export const hasConflict = (
  reservedSchedules: TSchedule[],
  requestedSchedules: TSchedule,
) => {
  for (const schedule of reservedSchedules) {
    const reservedStart = new Date(`1970-01-01T${schedule.startTime}:00`);
    const reservedEnd = new Date(`1970-01-01T${schedule.endTime}:00`);
    const requestedStart = new Date(
      `1970-01-01T${requestedSchedules.startTime}:00`,
    );
    const requestedEnd = new Date(
      `1970-01-01T${requestedSchedules.endTime}:00`,
    );

    if (requestedStart < reservedEnd && requestedEnd > reservedStart) {
      return true;
    }
  }
  return false;
};
