const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cid: {
      type: String,
      unique: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Booking", bookingSchema);
