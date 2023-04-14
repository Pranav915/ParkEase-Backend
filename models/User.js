const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bookings: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
  },
});

module.exports = model("User", userSchema);
