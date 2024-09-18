const userModel = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { role, password, ...others } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new userModel({
    ...others,
    password: hashedPassword,
    role: "Basic",
  });

  try {
    const savedUser = await newUser.save();

    res.json({ message: "Account Created Successfully", User: savedUser });
  } catch (error) {
    console.log(error.message);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const userInfo = await userModel.findOne({ email });
  if (!userInfo) {
    return res.json({ message: "User does not exist" });
  }

  try {
    const verify = bcrypt.compareSync(password, userInfo.password);
    if (!verify) {
      return res.json({ message: "Password is invalid" });
    }
    const aboutUser = { id: userInfo.id, role: userInfo.role };
    const token = jwt.sign(aboutUser, process.env.JWT_SECRETE);
    res.cookie("my_cookies", token);

    res.json({
      message: `Welcome ${userInfo.username}, you are now logged in`,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { register, loginUser };
