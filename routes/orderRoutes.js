import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js"; // Adjust the path as necessary
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorization.js";
import authorizeMultipleRoles from "../middleware/multiAutorize.js";

const router = express.Router();

// Create a new order (Customer only)
router.post(
  "/",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Customer"], "orders", "WRITE"), // Only Customers can create orders
  createOrder
);

// Get all orders (Admin, Manager, and DeliveryPerson only)
router.get(
  "/",
  auth, // Authenticate the user
  authorizeMultipleRoles(
    ["Admin", "Manager", "DeliveryPerson"],
    "orders",
    "READ"
  ), // Only Admins, Managers, and DeliveryPersons can view all orders
  getAllOrders
);

// Get an order by ID (Admin, Manager, DeliveryPerson, or the Customer who placed the order)
router.get(
  "/:id",
  auth, // Authenticate the user
  (req, res, next) => {
    if (
      ["Admin", "Manager", "DeliveryPerson"].includes(req.user.role) ||
      req.user.id === req.params.customerId // Assuming `customerId` is available in the order to match with the user ID
    ) {
      next();
    } else {
      res.status(403).json({ message: "Permission denied" });
    }
  },
  getOrderById
);

// Update an order by ID (Admin, Manager, or DeliveryPerson)
router.put(
  "/:id",
  auth, // Authenticate the user
  authorizeMultipleRoles(
    ["Admin", "Manager", "DeliveryPerson"],
    "orders",
    "WRITE"
  ), // Only Admins, Managers, and DeliveryPersons can update orders
  updateOrder
);

// Delete an order by ID (Admin only)
router.delete(
  "/:id",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin"], "orders", "DELETE"), // Only Admins can delete orders
  deleteOrder
);

export default router;
