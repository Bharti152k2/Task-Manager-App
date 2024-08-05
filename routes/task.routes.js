const express = require("express");
const {
  addTask,
  getTasks,
  getOneTask,
  getFilteredSortedTask,
} = require("../controllers/task.controller");
const {
  deleteTask,
  updateTask,
} = require("../controllers/manageTask.controller");
const auth = require("../middleware/auth");

let router = express.Router();
router.post("/addtask", addTask);
router.get("/gettasks", getTasks);
router.get("/getonetask/:pid", getOneTask);
router.get("/getfilteredsortedtask", getFilteredSortedTask);
router.delete("/deletetask/:pid", deleteTask);
router.put("/updatetask/:pid", updateTask);

module.exports = router;
