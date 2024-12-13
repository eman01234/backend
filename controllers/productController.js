import Product from "../models/product.js";

// Create a new product
import path from "path";

import Merchant from "../models/merchant.js";
import { validationResult } from "express-validator";
import { console } from "inspector";

// Create Product Controller
export const createProduct = async (req, res) => {
  try {
    const userId = req.user;
    console.log("usr", userId);
    // Validate request input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure request body
    const { name, description, price } = req.body;

    const merchant = await Merchant.findOne({ userId });
    const category = "66b765b3eaeca0654c528a9c";

    // Check if the merchant exists
    const existingMerchant = await Merchant.findById(merchant);
    if (!existingMerchant) {
      return res.status(404).json({ msg: "Merchant not found" });
    }

    // Handle file upload
    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ msg: "Image file is required" });
    }

    // Set the image URL
    const imageUrl = path.join("uploads", imageFile.filename);

    // Create a new Product
    const product = new Product({
      merchant,
      name,
      description,
      category,
      price,

      imageUrl, // This now stores the single image URL
    });

    // Save the Product
    await product.save();

    // Update the Merchant's products array
    existingMerchant.products.push(product._id);
    await existingMerchant.save();

    // Respond with success
    res.status(201).json({ msg: "Product created successfully", product });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("merchant")
      .populate("category");
    res.status(200).json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Get a product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("merchant")
      .populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching product" });
  }
};

// Update Product Controller
export const updateProduct = async (req, res) => {
  const { name, description, category, price, quantity, imageUrl, isActive } =
    req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, category, price, quantity, imageUrl, isActive },
      { new: true, runValidators: true }
    )
      .populate("merchant")
      .populate("category");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error updating product" });
  }
};
// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error deleting product" });
  }
};
