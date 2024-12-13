import express from "express";
import {
  createDeliveryPerson,
  getAllDeliveryPersons,
  getDeliveryPersonById,
  updateDeliveryPerson,
  deleteDeliveryPerson,
} from "../controllers/deliveryPersonController.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorization.js";
import authorizeMultipleRoles from "../middleware/multiAutorize.js"; // Import the authorization middleware

const router = express.Router();

// Create a new delivery person (Admin and Manager only)
router.post(
  "/",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin", "Manager"], "deliverypeople", "WRITE"), // Authorize based on the user's role
  createDeliveryPerson
);

// Get all delivery persons (Admin and Manager only)
router.get(
  "/",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin", "Manager"], "deliverypeople", "READ"), // Authorize based on the user's role
  getAllDeliveryPersons
);

// Get a delivery person by ID (Admin, Manager, or the DeliveryPerson themselves)
router.get(
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
  getDeliveryPersonById
);

// Update a delivery person by ID (Admin, Manager, or the DeliveryPerson themselves)
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
  updateDeliveryPerson
);

// Delete a delivery person by ID (Admin only)
router.delete(
  "/:id",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin"], "deliverypeople", "DELETE"), // Only Admins can delete delivery persons
  deleteDeliveryPerson
);

export default router;
