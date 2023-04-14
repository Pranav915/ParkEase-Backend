const Booking = require("../../models/Booking");
const User = require("../../models/User");

const deleteBooking = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate("bookings");
    console.log("user", user);
    await Booking.findByIdAndRemove(user.bookings._id);
    await User.findByIdAndUpdate(user, { $unset: { bookings: "" } });
    const user2 = await User.findById(userId).populate("bookings");
    res.json({ success: "true", data: user2 });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Some Error" });
  }
};

module.exports = deleteBooking;
