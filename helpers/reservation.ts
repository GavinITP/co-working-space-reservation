import { CoWorkingSpaceType } from "../types";
import { parse, isBefore, isAfter, isEqual } from "date-fns";

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
  }

  return conditionOne && conditionTwo;
};

export default validateReservationTime;
