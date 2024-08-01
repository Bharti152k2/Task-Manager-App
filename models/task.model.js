const { Schema, model } = require("mongoose");
const User = require("../models/loginUser.model");

let taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: [3, "Task Should Contain Minimum 3 Characters"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  priority: {
    type: String,
    required: true,
    enum: ["low", "medium", "high"],
  },
  duedate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    // enum: ["to-do", "in-progress", "completed"],
    default: "to-do",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
});
module.exports = model("task", taskSchema);
