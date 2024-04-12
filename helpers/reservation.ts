import { CoWorkingSpaceType } from "../types";
import {
  parse,
  isBefore,
  isAfter,
  isEqual,
  getMinutes,
  getSeconds,
} from "date-fns";

const validateReservationTime = (
  coWorkingSpace: CoWorkingSpaceType,
  startTime: string,
  endTime: string
): boolean => {
  let conditionOne = true;
  let conditionTwo = true;

  if (startTime) {
    const reservationStartDateTime = parse(startTime, "HH:mm:ss", new Date());
    const openingTime = parse(
      coWorkingSpace.openingTime,
      "HH:mm:ss",
      new Date()
    );

    conditionOne =
      isAfter(reservationStartDateTime, openingTime) ||
      isEqual(reservationStartDateTime, openingTime);

    // Check if reservation start time minutes are only 00 or 30 and seconds are 00
    conditionOne =
      conditionOne &&
      getMinutes(reservationStartDateTime) % 30 === 0 &&
      getSeconds(reservationStartDateTime) === 0;
  }

  if (endTime) {
    const reservationEndDateTime = parse(endTime, "HH:mm:ss", new Date());
    const closingTime = parse(
      coWorkingSpace.closingTime,
      "HH:mm:ss",
      new Date()
    );

    conditionTwo =
      isBefore(reservationEndDateTime, closingTime) ||
      isEqual(reservationEndDateTime, closingTime);

    // Check if reservation end time minutes are only 00 or 30 and seconds are 00
    conditionTwo =
      conditionTwo &&
      getMinutes(reservationEndDateTime) % 30 === 0 &&
      getSeconds(reservationEndDateTime) === 0;
  }

  return conditionOne && conditionTwo;
};

export default validateReservationTime;
