const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/to_do_list", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  task: String,
});

const Task = mongoose.model("Task", taskSchema);

app.post("/addTask", async (req, res) => {
  const { task } = req.body;

  try {
    const newTask = new Task({ task });
    await newTask.save();
    res.status(201).json({ message: "Task added successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while adding the task" });
  }
});

app.get("/getTasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching tasks" });
  }
});

app.delete("/deleteTask/:id", async (req, res) => {
  const taskId = req.params.id;

  try {
    await Task.findByIdAndRemove(taskId);
    res.json({ message: "Task removed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while removing the task" });
  }
});

app.put("/updateTask/:id", async (req, res) => {
  const taskId = req.params.id;
  const { task } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { task },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the task" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
