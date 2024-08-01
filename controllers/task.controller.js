const Task = require("../models/task.model");
const asyncWrapper = require("../helpers/asyncWrapperFunc");

//^ ADDTASK API : TO ADD THE TASK TO DATABASE

let addTask = asyncWrapper(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let { title, description, priority, duedate } = req.body;

  //!  validating before send the data

  //* for empty fields
  if (!title || !description || !priority || !duedate) {
    return res.json({ error: false, message: "All fields are mandatory" });
  }

  //* for filled fields
  if (title && description && priority && duedate) {
    //^ checking for existing users
    let existingTask = await Task.findOne({
      $and: [{ title }, { duedate }, { user: req.user.userId }],
    });

    if (existingTask) {
      return res.json({
        error: false,
        message: "You have already added this task",
      });
    }

    //^ validation for new user
    let titleReg = /^[a-zA-Z\s]+$/g;
    let descReg = /^[a-zA-Z0-9\s.,!?'-]+$/;

    if (!titleReg.test(title)) {
      return res
        .status(400)
        .json({ message: "Title should contain only alphabets" });
    } else if (!descReg.test(description)) {
      return res
        .status(400)
        .json({ message: "Description should contain only alphabets" });
    }
    let task = await Task.create({
      title,
      description,
      priority,
      duedate,
      user: req.user.userId,
    });

    return res.status(201).json({
      error: false,
      message: "Task Added Succesfully",
      data: task,
    });
  } else {
    console.log("gyuyfgdghjkkhjg");
  }
});
//^ GET TASKS API = TO GET THE TASKS
let getTask = asyncWrapper(async (req, res, next) => {
  let task = await Task.find();
  return res.status(200).json({
    error: false,
    message: "Data fetched succesfully ",
    data: task,
  });
});
//^ GET SINGLE TASK API = TO GET THE TASK
let getOneTask = asyncWrapper(async (req, res, next) => {
  let { pid } = req.params;
  let task = await Task.findById(pid);
  if (!task) {
    return res.status(404).json({ error: true, message: "Task not found" });
  }
  res.json(task);
});
//^ GET SINGLE EXPENSE API = TO GET SINGLE EXPESNE DATA

let getFilteredSortedTask = asyncWrapper(async (req, res, next) => {
  let { status, priority, duedate, sort, fields } = req.query;

  let queryObject = {};

  if (status) {
    queryObject.status = status;
  }
  if (priority) {
    queryObject.priority = priority;
  }
  if (duedate) {
    queryObject.duedate = duedate;
  }
  if (fields) {
    let selectedFields = fields.split(",").join(" ") + "_id";
    fields = selectedFields;
  }
  let tasks = await Task.find(queryObject).select(fields);

  if (sort) {
    tasks = tasks.sort(sort);
  }
  tasks = await tasks;

  return res.status(200).json({
    error: false,
    message: "Data fetched succesfully ",
    data: tasks,
  });
});
module.exports = {
  addTask,
  getTask,
  getOneTask,
  getFilteredSortedTask,
};
