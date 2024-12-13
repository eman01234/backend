import express from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController.js"; // Adjust the path as necessary
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorization.js";
import authorizeMultipleRoles from "../middleware/multiAutorize.js";

const router = express.Router();

// Create a new payment (Customer only)
router.post(
  "/",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Customer"], "payments", "WRITE"), // Only Customers can create payments
  createPayment
);

// Get all payments (Admin and Manager only)
router.get(
  "/",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin", "Manager"], "payments", "READ"), // Only Admins and Managers can view all payments
  getAllPayments
);

// Get a payment by ID (Admin, Manager, or the Customer who made the payment)
router.get(
  "/:id",
  auth, // Authenticate the user
  (req, res, next) => {
    if (
      ["Admin", "Manager"].includes(req.user.role) ||
      req.user.id === req.params.customerId // Assuming `customerId` is part of the payment record and matches the user ID
    ) {
      next();
    } else {
      res.status(403).json({ message: "Permission denied" });
    }
  },
  getPaymentById
);

// Update a payment by ID (Admin and Manager only)
router.put(
  "/:id",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin", "Manager"], "payments", "WRITE"), // Only Admins and Managers can update payments
  updatePayment
);

// Delete a payment by ID (Admin only)
router.delete(
  "/:id",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin"], "payments", "DELETE"), // Only Admins can delete payments
  deletePayment
);

export default router;
