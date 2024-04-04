const CoWorkingSpace = require("../models/coWorkingSpace");

// Check if reservation time falls within co-working space opening hours.
const validateReservationTime = (coWorkingSpace, date, startTime, endTime) => {
  const openingTime = new Date(
    `${date.split("-").reverse().join("-")}T${coWorkingSpace.openingTime}`
  );
  const closingTime = new Date(
    `${date.split("-").reverse().join("-")}T${coWorkingSpace.closingTime}`
  );
  const reservationStartDateTime = new Date(
    `${date.split("-").reverse().join("-")}T${startTime}`
  );
  const reservationEndDateTime = new Date(
    `${date.split("-").reverse().join("-")}T${endTime}`
  );

  return (
    reservationStartDateTime >= openingTime &&
    reservationEndDateTime <= closingTime
  );
};

// Find the co-working space using id
const findCoWorkingSpace = async (coWorkingSpaceId) => {
  const coWorkingSpace = await CoworkingSpace.findById(coWorkingSpaceId);
  if (!coWorkingSpace) {
    return res
      .status(404)
      .json({ success: false, error: "Co-working space not found" });
  }
  return coWorkingSpace;
};

module.exports = { validateReservationTime, findCoWorkingSpace };
