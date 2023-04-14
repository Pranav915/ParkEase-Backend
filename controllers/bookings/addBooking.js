const Booking = require("../../models/Booking");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../../models/User");

const addBooking = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ cid: 1 });
    const userId = req.user.userId.toString();
    let i = 0;
    let slot = 1;
    while (bookings[i]) {
      console.log(bookings[i].cid);
      console.log(slot);
      if (bookings[i].cid - "0" != slot) {
        break;
      }
      i++;
      slot++;
    }
    var cid = slot;
    if (!cid) cid = "0";
    if (cid == "8") {
      return res.json({ msg: "Parking Full" });
    }
    const booking = await Booking.create({
      user: userId,
      cid: (cid - "0").toString(),
      state: "booked",
    });
    await User.findByIdAndUpdate(userId, { $set: { bookings: booking._id } });
    const users = await User.find();
    const bookings2 = await Booking.find();
    console.log("users", users);
    console.log("bookings", bookings2);
    res.status(201).json({
      userDetails: {
        user: userId,
        booking: booking,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Some Error" });
  }
};

module.exports = addBooking;
