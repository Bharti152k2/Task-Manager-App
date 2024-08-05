const { Schema, model } = require("mongoose");

let signupSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "Firstname is mandatory"],
      minlength: [3, "Firstname Should Contain Minimum 3 Characters"],
      trim: true,
    },
    lastname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is mandatory"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile is mandatory"],
    },
    password: {
      type: String,
      required: [true, "Password is mandatory"],
      minlength: [8, "Password Should Contain Minimum 8 Characters"],
    },
    confirmPassword: {
      type: String,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
  },
  { timestamps: true }
);
module.exports = model("registereduser", signupSchema);
