const express = require("express");
const router = express.Router();
const bookingControllers = require("../controllers/bookings/bookingControllers");
const auth = require("../middleware/auth");

router.post("/addBooking", auth, bookingControllers.controllers.addBooking);
router.post(
  "/updateBooking",
  auth,
  bookingControllers.controllers.updateBooking
);
router.post(
  "/deleteBooking",
  auth,
  bookingControllers.controllers.deleteBooking
);

module.exports = router;
