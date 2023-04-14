const User = require("../../models/User");

const getUserDetails = async (req, res) => {
  try {
    const user = req.user.userId.toString();
    const userDetails = await User.findById(user).populate("bookings");
    return res.json(userDetails);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Some Error" });
  }
};

module.exports = getUserDetails;
