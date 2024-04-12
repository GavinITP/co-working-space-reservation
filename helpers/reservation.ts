import { CoWorkingSpaceType } from "../types";
import {
  parse,
  isBefore,
  isAfter,
  isEqual,
  getMinutes,
  getSeconds,
} from "date-fns";

const isStartTimeValid = (
  coWorkingSpace: CoWorkingSpaceType,
  startTime: string
): boolean => {
  if (!startTime) return false;

  const reservationStartDateTime = parse(startTime, "HH:mm:ss", new Date());
  const openingTime = parse(coWorkingSpace.openingTime, "HH:mm:ss", new Date());

  const conditionOne =
    isAfter(reservationStartDateTime, openingTime) ||
    isEqual(reservationStartDateTime, openingTime);

  return (
    conditionOne &&
    getMinutes(reservationStartDateTime) % 30 === 0 &&
    getSeconds(reservationStartDateTime) === 0
  );
};

const isEndTimeValid = (
  coWorkingSpace: CoWorkingSpaceType,
  endTime: string
): boolean => {
  if (!endTime) return false;

  const reservationEndDateTime = parse(endTime, "HH:mm:ss", new Date());
  const closingTime = parse(coWorkingSpace.closingTime, "HH:mm:ss", new Date());

  const conditionTwo =
    isBefore(reservationEndDateTime, closingTime) ||
    isEqual(reservationEndDateTime, closingTime);

  return (
    conditionTwo &&
    getMinutes(reservationEndDateTime) % 30 === 0 &&
    getSeconds(reservationEndDateTime) === 0
  );
};

const isStartTimeBeforeEndTime = (
  startTime: string,
  endTime: string
): boolean => {
  if (!startTime || !endTime) return false;

  const reservationStartDateTime = parse(startTime, "HH:mm:ss", new Date());
  const reservationEndDateTime = parse(endTime, "HH:mm:ss", new Date());

  return isBefore(reservationStartDateTime, reservationEndDateTime);
};

const validateReservationTime = (
  coWorkingSpace: CoWorkingSpaceType,
  startTime: string,
  endTime: string
): boolean => {
  return (
    isStartTimeValid(coWorkingSpace, startTime) &&
    isEndTimeValid(coWorkingSpace, endTime) &&
    isStartTimeBeforeEndTime(startTime, endTime)
  );
};

export default validateReservationTime;
