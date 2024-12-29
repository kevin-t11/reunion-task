import { Router, Request, Response } from "express";
import Task from "../models/task.model";
import User from "../models/user.model"; 
import { createTaskSchema, updateTaskSchema } from "../schema/task";
import { authenticate } from "../middleware/auth";

const router = Router();

// Create a new task
router.post(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<any> => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const parsed = createTaskSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.errors,
      });
    }

    const { title, description, startTime, endTime, priority, status, tags } =
      parsed.data;

    const newTask = new Task({
      title,
      description,
      startTime,
      endTime,
      priority,
      status,
      tags,
      user: user.id,
    });

    try {
      const savedTask = await newTask.save();

      // update the user's task array
      await User.updateOne(
        { _id: user.id },
        { $push: { tasks: savedTask._id } } 
      );

      return res.status(201).json(savedTask);
    } catch (error) {
      return res.status(500).json({ error: "Failed to save task." });
    }
  }
);

// Update an existing task
router.put(
  "/:id",
  authenticate,
  async (req: Request, res: Response): Promise<any> => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { taskId } = req.params;
    const parsed = updateTaskSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.errors,
      });
    }

    const { title, description, startTime, endTime, priority, status, tags } =
      parsed.data;

    try {
      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, user: user.id },
        { title, description, startTime, endTime, priority, status, tags },
        { new: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      return res.status(200).json(updatedTask);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update task." });
    }
  }
);

// Get all tasks
router.get(
  "/",
  authenticate,
  async (req: Request, res: Response): Promise<any> => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    try {
      const tasks = await Task.find({ user: user.id });
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch tasks." });
    }
  }
);

// Delete a task by ID
router.delete(
  "/:id",
  authenticate,
  async (req: Request, res: Response): Promise<any> => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { id: taskId } = req.params;

    try {
      const deletedTask = await Task.findOneAndDelete({
        _id: taskId,
        user: user.id,
      });

      if (!deletedTask) {
        return res
          .status(404)
          .json({
            error: "Task not found in database",
          });
      }

      // remove the task from the user's task array
      await User.updateOne(
        { _id: user.id },
        { $pull: { tasks: taskId } } 
      );

      return res
        .status(200)
        .json({ message: `Task with ID ${taskId} has been deleted.` });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete task." });
    }
  }
);

// Get a single task by ID
router.get(
  "/:id",
  authenticate,
  async (req: Request, res: Response): Promise<any> => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { taskId } = req.params;

    try {
      const task = await Task.findOne({ _id: taskId, user: user.id });

      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch task." });
    }
  }
);

export const taskRouter: Router = router;
