import Manager from "../models/manager.js";
import AdminUser from "../models/adminUser.js";
import { validationResult } from "express-validator";

// Create Manager
export const createManager = async (req, res) => {
  try {
    // Validate request input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user } = req.body;

    // Check if the user exists
    const adminUser = await AdminUser.findById(user);
    if (!adminUser) {
      return res.status(404).json({ msg: "AdminUser not found" });
    }

    // Check if the manager already exists
    let manager = await Manager.findOne({ user });
    if (manager) {
      return res.status(400).json({ msg: "Manager already exists" });
    }

    // Create a new Manager
    manager = new Manager({
      user: adminUser._id,
    });

    // Save the Manager
    await manager.save();

    res.status(201).json({ msg: "Manager created successfully", manager });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Get all Managers
export const getAllManagers = async (req, res) => {
  try {
    const managers = await Manager.find().populate("user");
    res.status(200).json(managers);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching managers" });
  }
};

// Get Manager by ID
export const getManagerById = async (req, res) => {
  try {
    const manager = await Manager.findById(req.params.id).populate("user");
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }
    res.status(200).json(manager);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching manager" });
  }
};

// Update Manager
export const updateManager = async (req, res) => {
  const { isBlocked } = req.body;

  try {
    const updatedManager = await Manager.findByIdAndUpdate(
      req.params.id,
      { isBlocked },
      { new: true, runValidators: true }
    ).populate("user");

    if (!updatedManager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    res
      .status(200)
      .json({ msg: "Manager updated successfully", updatedManager });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error updating manager" });
  }
};

// Delete Manager
export const deleteManager = async (req, res) => {
  try {
    const deletedManager = await Manager.findByIdAndDelete(req.params.id);
    if (!deletedManager) {
      return res.status(404).json({ message: "Manager not found" });
    }
    res.status(200).json({ message: "Manager deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error deleting manager" });
  }
};
