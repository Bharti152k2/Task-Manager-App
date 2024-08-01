const express = require("express");
const {
  addTask,
  getTask,
  getOneTask,
  getFilteredSortedTask,
} = require("../controllers/task.controller");
const {
  deleteTask,
  updateTask,
} = require("../controllers/manageTask.controller");
const auth = require("../middleware/auth.js");

let router = express.Router();
router.post("/addtask", auth, addTask);
router.get("/gettask", auth, getTask);
router.get("/getonetask/:pid", auth, getOneTask);
router.get("/getfilteredsortedtask", auth, getFilteredSortedTask);
router.delete("/deletetask/:pid", auth, deleteTask);
router.put("/updatetask/:pid", auth, updateTask);

module.exports = router;
