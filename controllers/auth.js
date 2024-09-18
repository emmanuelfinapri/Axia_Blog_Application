const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Function to register a new user
const register = async (req, res) => {
  const { password, role, ...others } = req.body; // Extract password and other user details
  const salt = bcrypt.genSaltSync(10); // Generate salt for hashing
  const hashedPassword = bcrypt.hashSync(password, salt); // Hash the password

  const newUser = new userModel({
    ...others,
    password: hashedPassword,
    role: "Basic",
  }); // Create a new user instance with hashed password
  try {
    // Save the new user to the database
    const savedUser = await newUser.save();
    // Send a success response with the saved user data
    res.json({
      message: "Account created successfully",
      user: savedUser,
    });
  } catch (error) {
    // Send an error response if there's an exception
    res.status(404).json({ message: error.message });
  }
};

// Function to log in a user
const loginUser = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body

  try {
    // Check if the user exists in the database
    const userInfo = await userModel.findOne({ email });
    if (!userInfo) {
      return res.json({ message: "User not found" });
    }

    // Verify the provided password with the stored hashed password
    const verify = bcrypt.compareSync(password, userInfo.password);
    if (!verify) {
      return res.json({ message: "Password does not match" });
    }
    const aboutUser = {
      id: userInfo.id,
      role: userInfo.role,
      username: userInfo.username,
      password: userInfo.password,
    };
    const token = jwt.sign(aboutUser, process.env.JWT_SECRETE);
    res.cookie("user_token", token);
    // console.log(token);
    res.json({
      message: `Welcome ${userInfo.username}, you are now logged in`,
    });

    // Send a success response with the user information
    // res.json({
    //   message: `Welcome ${userInfo.username}, you are now logged in`,
    //   user: userInfo,
    // });
  } catch (error) {
    // Send an error response if there's an exception
    res.json({ message: error.message });
  }
};

const logoutUser = (req, res) => {
  const { username } = req.user;
  res.clearCookie("user_token");
  res.json({ message: `Logged out ${username} successfully` });
};

module.exports = {
  register,
  loginUser,
  logoutUser,
};
