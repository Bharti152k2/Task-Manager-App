const RegisteredUser = require("../models/registerUser.model");
// const LoggedinUser = require("../models/loginUser.model");
const { default: mongoose } = require("mongoose");
const asyncWrapper = require("../helpers/asyncWrapperFunc");
const encryptPassword = require("../helpers/encryption");
const decryptPassword = require("../helpers/decryption");
const jwt = require("jsonwebtoken");

//^ SIGNUP API : TO SEND THE SIGNUP DATA TO BACKEND

let signUp = asyncWrapper(async (req, res, next) => {
  let {
    firstname,
    lastname,
    email,
    mobile,
    password,
    confirmPassword,
    gender,
  } = req.body;

  //!  validating before send the data

  //* for empty fields
  if (
    !firstname ||
    !email ||
    !mobile ||
    !password ||
    !confirmPassword ||
    !gender
  ) {
    return res.json({ error: false, message: "All fields are mandatory" });
  }

  //* for filled fields
  if (firstname && email && mobile && password && confirmPassword && gender) {
    //^ checking for existing users
    let existingUser = await RegisteredUser.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.json({ error: false, message: "User already exists" });
    }

    //^ validation for new user
    let nameReg = /[a-zA-Z]+([ \-']{0,1}[a-zA-Z]+)*/;
    let emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let mobReg = /^[6-9][0-9]{9}$/;

    if (!nameReg.test(firstname)) {
      return res
        .status(400)
        .json({ message: "Firstname should contain only alphabets" });
    } else if (lastname && !nameReg.test(lastname)) {
      return res
        .status(400)
        .json({ message: "Lastname should contain only alphabets" });
    } else if (!mobReg.test(mobile)) {
      return res.status(400).json({ message: "Enter a valid mobile number" });
    } else if (!emailReg.test(email)) {
      return res.status(400).json({ message: "Enter a valid email number" });
    } else if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "password and confirm password should match" });
    } else {
      let signupUser = await RegisteredUser.create({
        firstname,
        lastname,
        email,
        mobile,
        password: await encryptPassword(confirmPassword),
        gender,
      });
      // console.log(signupUser);
      return res.status(201).json({
        error: false,
        message: "Registered Succesfully",
        data: signupUser,
      });
    }
  }
});

//^ LOGIN API : TO CHECK THE LOGIN DATA FROM BACKEND
let generateToken = (userId) => {
  return jwt.sign({ userId }, "123", { expiresIn: "3m" });
};
let login = asyncWrapper(async (req, res, next) => {
  let { username, password } = req.body;
  //!  validating before send the data

  //* for empty fields
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: false, message: "All fields are mandatory" });
  }

  //* for filled fields
  if (username && password) {
    //^ for entered data

    //* validating for username is email or mobile
    let isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      username
    );
    let isMobile = /^[6-9][0-9]{9}$/.test(username);

    if (!isEmail && !isMobile) {
      return res.status(400).json({ error: true, message: "Invalid username" });
    }

    //* checking for existing users

    let existingUser;
    if (isEmail || isMobile) {
      existingUser = await RegisteredUser.findOne({
        $or: [{ mobile: username }, { email: username }],
      });
    }
    console.log(existingUser);

    //* validation for user login
    if (existingUser) {
      if (await decryptPassword(password, existingUser.password)) {
        let token = generateToken(existingUser._id);

        return res.status(201).json({
          error: false,
          message: "Logged in Successfully",
          token,
          userId: existingUser._id,
        });
      } else {
        return res
          .status(400)
          .json({ error: true, message: "Incorrect password" });
      }
    }
    return res.status(400).json({ error: true, message: "User not found" });
  }
});

//^ USERDATA API : TO GET THE USERDATA DATA FROM BACKEND
// let userData = asyncWrapper(async (req, res, next) => {
//   let users = await RegisteredUser.find();

//   res.status(200).json({
//     error: false,
//     message: "UserData fetched succesfully",
//     data: users,
//   });
// });

//^ LOGOUT API : TO DELETE THE LOGIN DATA FROM DATABASE

// let logout = asyncWrapper(async (req, res) => {
//   let { userId } = req.body;
//   if (!userId) {
//     return res.status(400).send("User ID is required");
//   }
//   let result = await LoggedinUser.deleteOne({ _id: userId });
//   if (result.deletedCount === 0) {
//     return res.status(404).send("User not found");
//   } else {
//     res.status(200).send("Logged out successfully");
//   }
// });

module.exports = {
  signUp,
  login,
  // userData,
  // logout,
};
