import DeliveryPerson from "../models/deliveryPerson.js";
import bcrypt from "bcryptjs"; // For hashing passwords
import { validationResult } from "express-validator";
import User from "../models/user.js";
// Create a new delivery person
export const createDeliveryPerson = async (req, res) => {
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
    const deliveryPerson = new DeliveryPerson({
      user: user._id,
    });

    // Save the Merchant
    await deliveryPerson.save();

    // Respond with success
    res.status(201).json({ msg: "Delivery person registered successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Get all delivery persons
export const getAllDeliveryPersons = async (req, res) => {
  try {
    const deliveryPersons = await DeliveryPerson.find().populate("user");
    res.status(200).json(deliveryPersons);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching delivery persons" });
  }
};

// Get a delivery person by ID
export const getDeliveryPersonById = async (req, res) => {
  try {
    const deliveryPerson = await DeliveryPerson.findById(
      req.params.id
    ).populate("user");
    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery person not found" });
    }
    res.status(200).json(deliveryPerson);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching delivery person" });
  }
};

// Update a delivery person
export const updateDeliveryPerson = async (req, res) => {
  const { isBlocked } = req.body;

  try {
    const updatedDeliveryPerson = await DeliveryPerson.findByIdAndUpdate(
      req.params.id,
      { isBlocked },
      { new: true, runValidators: true }
    ).populate("user");

    if (!updatedDeliveryPerson) {
      return res.status(404).json({ message: "Delivery person not found" });
    }

    res.status(200).json(updatedDeliveryPerson);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error updating delivery person" });
  }
};

// Delete a delivery person
export const deleteDeliveryPerson = async (req, res) => {
  try {
    const deletedDeliveryPerson = await DeliveryPerson.findByIdAndDelete(
      req.params.id
    );
    if (!deletedDeliveryPerson) {
      return res.status(404).json({ message: "Delivery person not found" });
    }
    res.status(200).json({ message: "Delivery person deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error deleting delivery person" });
  }
};
