const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/user.js");

const userInDatabase = await User.findOne({ username: req.body.username });
if (userInDatabase) {
  return res.send("Username already taken.");
}
if (req.body.password !== req.body.confirmPassword) {
  return res.send("Password and Confirm Password must match");
}

// password encryption - bcrypt
const hashedPassword = bcrypt.hashSync(req.body.password, 10);
req.body.password = hashedPassword;

// validation logic
const user = await User.create(req.body);
res.send(`Thanks for signing up ${user.username}`);

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
  res.send("Form submission accepted!");
});

module.exports = router;