const mongoose = require("mongoose");

const TaskModel = new mongoose.Schema({
  // taskname: {
  //   type: String,
  //   required: [true, "please Enter product name"],
  //   trim: true,
  // },
  description: {
    type: String,
    required: [true, "Please Enter product Description"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", TaskModel);
