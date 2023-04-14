const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const postRegister = async (req, res) => {
  if (req.body.googleAccessToken) {
    const { googleAccessToken } = req.body;

    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      })
      .then(async (response) => {
        const email = response.data.email;

        const userExists = await User.exists({ email });
        if (userExists) {
          return res.status(409).send("User is already registered");
        }

        const user = await User.create({
          email: email,
        });

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
        res.status(201).json({
          userDetails: {
            email: user.email,
            token: token,
            userId: user._id,
          },
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send("Error Occured. Please try again");
      });
  } else {
    try {
      const { email, password } = req.body;
      console.log("email", email);
      const userExists = await User.exists({ email });
      if (userExists) {
        return res.status(409).send("User is already registered");
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        email: email,
        password: encryptedPassword,
      });

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
      res.status(201).json({
        userDetails: {
          email: user.email,
          token: token,
          userId: user._id,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Error Occured. Please try again");
    }
  }
};

module.exports = postRegister;
