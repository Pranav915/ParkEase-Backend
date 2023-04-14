const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const postLogin = async (req, res) => {
  if (req.body.googleAccessToken) {
    // gogole-auth
    const { googleAccessToken } = req.body;

    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      })
      .then(async (response) => {
        const email = response.data.email;

        const user = await User.findOne({ email });

        if (!user) return res.status(404).send("User don't exist!");

        const token = jwt.sign(
          {
            userId: user._id,
            email: user.email,
          },
          process.env.AUTH_TOKEN,
          {
            expiresIn: "72h",
          }
        );
        return res.status(200).json({
          userDetails: {
            email: user.email,
            token: token,
            _id: user._id,
          },
        });
      })
      .catch((error) => {
        console.log("error", error);
        res.status(400).send("Invalid access token!");
      });
  } else {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        // Send a new token
        const token = jwt.sign(
          {
            userId: user._id,
            email: user.email,
          },
          process.env.AUTH_TOKEN,
          {
            expiresIn: "72h",
          }
        );
        return res.status(200).json({
          userDetails: {
            email: user.email,
            token: token,
            _id: user._id,
          },
        });
      }

      return res.status(400).send("Invalid Credentials. Please try again");
    } catch (error) {
      console.log("error", error);
      return res.status(500).send("Something went wrong. Please try again");
    }
  }
};

module.exports = postLogin;
