// // Importing required modules
// const userModel = require("../models/user");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // Function to update user information
// const updateUserInfo = async (req, res) => {
//   const { password, ...others } = req.body; // Extract user ID, password, and other fields to update
//   const { id } = req.user;
//   try {
//     // Update user information in the database
//     const updatedUser = await userModel.findByIdAndUpdate(id, others, {
//       new: true,
//     });

//     // Send a response with the updated user data
//     res.json(updatedUser);
//   } catch (error) {
//     // Send an error response if there's an exception
//     res.json({ message: error.message });
//   }
// };

// // Function to update a user's password
// const updatePassword = async (req, res) => {
//   const { oldPassword, newPassword } = req.body; // Extract old password, and new password from request body
//   const { id } = req.user;
//   const salt = bcrypt.genSaltSync(10); // Generate salt for hashing

//   try {
//     // Retrieve the user by ID
//     const getUser = await userModel.findById(id);
//     // Verify the old password matches the stored password
//     const verify = bcrypt.compareSync(oldPassword, getUser.password);
//     if (!verify) {
//       return res.json({ message: "Old password does not match" });
//     }

//     // Hash the new password
//     const hashedPassword = bcrypt.hashSync(newPassword, salt);
//     // Update the user's password in the database
//     await userModel.findByIdAndUpdate(
//       id,
//       { password: hashedPassword },
//       { new: true }
//     );

//     // Send a success response
//     res.json({ message: "Password updated successfully" });
//   } catch (error) {
//     // Send an error response if there's an exception
//     res.json({ message: error.message });
//   }
// };

// // Function to handle forgot password
// const forgotPassword = async (req, res) => {
//   const { newPassword } = req.body; // Extract new password from request body
//   const { id } = req.user;
//   const salt = bcrypt.genSaltSync(10); // Generate salt for hashing
//   const hashedPassword = bcrypt.hashSync(newPassword, salt); // Hash the new password

//   try {
//     // Retrieve the user by ID
//     const getUser = await userModel.findById(id);
//     if (!getUser) {
//       return res.json({ message: "Sorry, this user does not exist" });
//     }

//     // Update the user's password in the database
//     const updatedUser = await userModel.findByIdAndUpdate(
//       id,
//       { password: hashedPassword },
//       { new: true }
//     );

//     // Send a response with the updated user data
//     res.json(updatedUser);
//   } catch (error) {
//     // Send an error response if there's an exception
//     res.status(404).json({ message: error.message });
//   }
// };

// // Function to delete a user
// const deleteUser = async (req, res) => {
//   const { id } = req.user; // Extract user ID from request user

//   try {
//     // Retrieve the user by ID
//     const getUser = await userModel.findById(id);
//     if (!getUser) {
//       return res.json({ message: "Sorry, this user does not exist" });
//     }

//     // Delete the user from the database
//     await userModel.findByIdAndDelete(id);

//     // clearing token
//     res.clearCookie("user_token");

//     // Send a success response
//     res.json({ message: "User deleted successfully" });
//   } catch (error) {
//     // Send an error response if there's an exception
//     res.json({ message: error.message });
//   }
// };

// const updateRole = async (req, res) => {
//   const { id } = req.body;
//   const { role } = req.user;
//   if (role !== "SuperAdmin" && role !== "Admin") {
//     return res.json({ message: "You done have a permission to update roles" });
//   }
//   try {
//     await userModel.findByIdAndUpdate(id, { role: "Admin" }, { new: true });
//     res.json({
//       message: "You have now changed this User's role to be an Admin",
//     });
//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };

// // Exporting all functions for use in other parts of the application
// module.exports = {
//   updateUserInfo,
//   updatePassword,
//   deleteUser,
//   forgotPassword,
//   updateRole,
// };

const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Update UserInfo, Update PW, Delete User and Update Role

const updateUserInfo = async (req, res) => {
  const { password, ...others } = req.body;
  const { id, username } = req.user;

  try {
    const updatedUser = await userModel.findByIdAndUpdate(id, others, {
      new: true,
    });
    const message = `Hey ${username} you just updated your info`;
    res.json({ message, updatedUser });
  } catch (error) {
    res.json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { id, password, username } = req.user;

  try {
    const verify = bcrypt.compareSync(oldPassword, password);
    console.log(verify);
    if (!verify) {
      return res.json({ error: "The old password is invalid" });
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    // Fetch the updated user
    // const updatedUser = await userModel.findById(id);
    // req.user = updatedUser; // Update req.user with the new data
    // console.log(updatedUser);
    // console.log(req.user);
    res.json({ message: `Successfully Updated Your Password ${username}` });
  } catch (error) {
    res.json(error.message);
  }
};

module.exports = { updateUserInfo, updatePassword };
