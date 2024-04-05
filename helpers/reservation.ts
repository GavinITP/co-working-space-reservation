import { CoWorkingSpaceType } from "../types";

const parseDateTime = (date: string, time: string): Date => {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
};

const validateReservationTime = (
  coWorkingSpace: CoWorkingSpaceType,
  date: string,
  startTime: string,
  endTime: string
): boolean => {
  const openingTime = parseDateTime(date, coWorkingSpace.openingTime);
  const closingTime = parseDateTime(date, coWorkingSpace.closingTime);
  const reservationStartDateTime = parseDateTime(date, startTime);
  const reservationEndDateTime = parseDateTime(date, endTime);

  const isWithinTimeRange =
    reservationStartDateTime >= openingTime &&
    reservationEndDateTime <= closingTime;

  return isWithinTimeRange;
};

export default validateReservationTime;
