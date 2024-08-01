const { Schema, model } = require("mongoose");

let loginSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is mandatory"],
      trim: true,
      validate: {
        validator: function (value) {
          return (
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ||
            /^[6-9]\d{9}$/.test(value)
          );
        },
        message: "Username must be a valid email or mobile number",
      },
    },

    password: {
      type: String,
      required: [true, "Password is mandatory"],
    },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

module.exports = model("loggedinuser", loginSchema);
