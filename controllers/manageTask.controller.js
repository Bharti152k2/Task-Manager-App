const Task = require("../models/task.model");
const asyncWrapper = require("../helpers/asyncWrapperFunc");
const { default: mongoose } = require("mongoose");

//^ DELETE EXISTING EXPENSE API
let deleteTask = async (req, res, next) => {
  try {
    let { pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid ID format" });
    }

    let task = Task.findById(pid);

    if (!task) {
      return res.status(404).json({ error: true, message: "Task not found" });
    }
    let deletedTask = await Task.deleteOne({ _id: pid });

    return res.status(200).json({
      error: false,
      message: "Task deleted",
      data: deleteTask,
    });
  } catch (error) {
    next(error);
  }
};
//^ GET UPDATE EXPENSE API = TO GET UPDATED EXPESNE DATA

let updateTask = async (req, res, next) => {
  try {
    let { pid } = req.params;
    let { title, description, priority, duedate, status } = req.body;

    let task = await Task.findById(pid);
    if (!task) {
      return res.status(401).json({
        error: true,
        message: "No Task found with given id",
      });
    }

    //* for filled fields
    if (title && description && priority && duedate && status) {
      //^ checking for existing expense
      let existingTask = await Task.findOne({
        $and: [
          { title },
          { description },
          { priority },
          { duedate },
          { status },
        ],
      });

      if (existingTask) {
        res.json({ error: false, message: "You have already added this Task" });
      }

      //^ validation for new user
      if (!existingTask) {
        let titleReg = /^[a-zA-Z]+$/g;
        let descReg = /^[a-zA-Z0-9\s.,!?'-]+$/;

        if (titleReg.test(title) && descReg.test(description)) {
          let updatedTask = await Task.findByIdAndUpdate(
            pid,
            { $set: { title, description, priority, duedate, status } },
            { new: true, runValidators: true }
          );

          res.status(201).json({
            error: false,
            message: "Task Updated Successfully",
            data: updatedTask,
          });
        } else {
          return res.status(201).json({ message: "Enter correct details" });
        }
      }
    } else {
      return res.status(400).json({ message: "Please fill the fields" });
    }
  } catch (error) {
    next(error);
  }
};
module.exports = {
  deleteTask,
  updateTask,
};
