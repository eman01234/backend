import Merchant from "../models/merchant.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs"; // For hashing passwords
import { validationResult } from "express-validator"; // For input validation
import path from "path"; // For handling file paths

// Register a new Merchant
export const createMerchant = async (req, res) => {
  try {
    // Validate request input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Handle file upload
    const trade_permit = req.file;
    if (!trade_permit) {
      return res.status(400).json({ msg: "Trade permit file is required" });
    }

    // Set the image URL
    const tradePermitPath = path.join("uploads", trade_permit.filename);

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
    const merchant = new Merchant({
      trade_permit: tradePermitPath,
      user: user._id,
    });

    // Save the Merchant
    await merchant.save();

    // Respond with success
    res.status(201).json({ msg: "Merchant registered successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Get all merchants
export const getAllMerchants = async (req, res) => {
  try {
    const merchants = await Merchant.find()
      .populate("user")
      .populate("products");
    res.status(200).json(merchants);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching merchants" });
  }
};

// Get a merchant by ID
export const getMerchantById = async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id)
      .populate("user")
      .populate("products");
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }
    res.status(200).json(merchant);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching merchant" });
  }
};

// Update a merchant
export const updateMerchant = async (req, res) => {
  try {
    const { isVerified, isBlocked, products } = req.body;

    // Handle file upload for trade_permit update
    let trade_permit = req.body.trade_permit;
    if (req.file) {
      trade_permit = path.join("uploads", req.file.filename);
    }

    const updatedMerchant = await Merchant.findByIdAndUpdate(
      req.params.id,
      { trade_permit, isVerified, isBlocked, products },
      { new: true, runValidators: true }
    )
      .populate("user")
      .populate("products");

    if (!updatedMerchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    res.status(200).json(updatedMerchant);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error updating merchant" });
  }
};

// Delete a merchant
export const deleteMerchant = async (req, res) => {
  try {
    const deletedMerchant = await Merchant.findByIdAndDelete(req.params.id);
    if (!deletedMerchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }
    res.status(200).json({ message: "Merchant deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error deleting merchant" });
  }
};
