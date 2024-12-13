import Customer from "../models/customer.js";

// Create a new customer
import User from "../models/user.js";

import bcrypt from "bcryptjs"; // For hashing passwords
import { validationResult } from "express-validator"; // For input validation

// Register Controller
export const createCustomer = async (req, res) => {
  try {
    // Validate request input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure request body
    const { role, firstName, lastName, email, password, phoneNumber, address } =
      req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new User
    user = new User({
      role,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    });

    // Save the User
    await user.save();

    // Create a new Merchant
    const customer = new Customer({
      user: user._id,
    });

    // Save the Merchant
    await customer.save();

    // Respond with success
    res.status(201).json({ msg: "customer registered successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate("user")
      .populate("orderHistory");
    res.status(200).json(customers);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching customers" });
  }
};

// Get a customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate("user")
      .populate("orderHistory");
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching customer" });
  }
};

// Update a customer
export const updateCustomer = async (req, res) => {
  const { isBlocked, orderHistory } = req.body;

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { isBlocked, orderHistory },
      { new: true, runValidators: true }
    )
      .populate("user")
      .populate("orderHistory");

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error updating customer" });
  }
};

// Delete a customer
export const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error deleting customer" });
  }
};
