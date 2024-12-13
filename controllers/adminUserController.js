import AdminUser from "../models/adminUser.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import generateToken from "../utils/generateToken.js";

// Create Admin User
export const createAdminUser = async (req, res) => {
  try {
    // Validate request input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role, firstName, lastName, email, password, phoneNumber, address } =
      req.body;

    // Check if the user already exists
    let user = await AdminUser.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new AdminUser
    user = new AdminUser({
      role,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    });

    // Save the AdminUser
    await user.save();

    res.status(201).json({ msg: "AdminUser created successfully", user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Get all Admin Users
export const getAllAdminUsers = async (req, res) => {
  try {
    const users = await AdminUser.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Get Admin User by ID
export const getAdminUserById = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "AdminUser not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching user" });
  }
};

// Update Admin User
export const updateAdminUser = async (req, res) => {
  const { firstName, lastName, phoneNumber, address } = req.body;

  try {
    const updatedUser = await AdminUser.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, phoneNumber, address },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "AdminUser not found" });
    }

    res
      .status(200)
      .json({ msg: "AdminUser updated successfully", updatedUser });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error updating user" });
  }
};

// Delete Admin User
export const deleteAdminUser = async (req, res) => {
  try {
    const deletedUser = await AdminUser.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "AdminUser not found" });
    }
    res.status(200).json({ message: "AdminUser deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error deleting user" });
  }
};

export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if admin user exists
    let user = await AdminUser.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Compare provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Generate and send JWT token with user info as an HTTP-only cookie
    generateToken(res, user);

    // Respond with user data (excluding password)
    res.status(200).json({
      id: user.id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
