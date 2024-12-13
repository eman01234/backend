import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js"; // Adjust the path as necessary
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorization.js";
import authorizeMultipleRoles from "../middleware/multiAutorize.js"; // Import the authorization middleware

const router = express.Router();

// Create a new customer (Publicly accessible)
router.post("/", createCustomer);

// Get all customers (Admin and Manager only)
router.get(
  "/",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin", "Manager"], "customers", "READ"), // Authorize based on the user's role
  getAllCustomers
);

// Get a customer by ID (Admin, Manager, Merchant, DeliveryPerson, or the Customer themselves)
router.get(
  "/:id",
  auth, // Authenticate the user
  (req, res, next) => {
    if (
      ["Admin", "Manager", "Merchant", "DeliveryPerson"].includes(
        req.user.role
      ) ||
      req.user.id === req.params.id
    ) {
      next();
    } else {
      res.status(403).json({ message: "Permission denied" });
    }
  },
  getCustomerById
);

// Update a customer by ID (Admin, Manager, or the Customer themselves)
router.put(
  "/:id",
  auth, // Authenticate the user
  (req, res, next) => {
    if (
      ["Admin", "Manager"].includes(req.user.role) ||
      req.user.id === req.params.id
    ) {
      next();
    } else {
      res.status(403).json({ message: "Permission denied" });
    }
  },
  updateCustomer
);

// Delete a customer by ID (Admin and Manager only)
router.delete(
  "/:id",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin", "Manager"], "customers", "DELETE"), // Admin and Manager can delete customers
  deleteCustomer
);

export default router;
