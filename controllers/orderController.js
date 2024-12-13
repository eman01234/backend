import Order from "../models/order.js";

// Create a new order

import Customer from "../models/customer.js";
import Product from "../models/product.js";
import DeliveryPerson from "../models/deliveryPerson.js";
import { validationResult } from "express-validator"; // For input validation

// Create Order Controller
export const createOrder = async (req, res) => {
  try {
    // Validate request input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure request body
    const {
      customer,
      products,
      totalAmount,
      status,
      deliveryPerson,
      delivery_address,
      orderDate,
      deliveryDate,
    } = req.body;

    // Check if customer exists
    const existingCustomer = await Customer.findById(customer);
    if (!existingCustomer) {
      return res.status(404).json({ msg: "Customer not found" });
    }

    // Validate products
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ msg: ` Product with ID ${item.product} not found` });
      }
    }

    // Check if delivery person exists
    const deliveryUser = await DeliveryPerson.findById(deliveryPerson);
    if (!deliveryUser) {
      return res.status(404).json({ msg: "Delivery person not found" });
    }

    // Create a new Order
    const order = new Order({
      customer,
      products,
      totalAmount,
      status,
      deliveryPerson,
      delivery_address,
      orderDate,
      deliveryDate,
    });

    // Save the Order
    await order.save();

    // Update the Merchant's products array
    existingCustomer.orderHistory.push(order._id);
    await existingCustomer.save();

    // Respond with success
    res.status(201).json({ msg: "Order created successfully", order });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer")
      .populate("products.product")
      .populate("deliveryPerson");
    res.status(200).json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Get an order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer")
      .populate("products.product")
      .populate("deliveryPerson");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching order" });
  }
};

// Update an order
export const updateOrder = async (req, res) => {
  const {
    customer,
    products,
    totalAmount,
    status,
    deliveryPerson,
    delivery_address,
    orderDate,
    deliveryDate,
  } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        customer,
        products,
        totalAmount,
        status,
        deliveryPerson,
        delivery_address,
        orderDate,
        deliveryDate,
      },
      { new: true, runValidators: true }
    )
      .populate("customer")
      .populate("products.product")
      .populate("deliveryPerson");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error updating order" });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error deleting order" });
  }
};
