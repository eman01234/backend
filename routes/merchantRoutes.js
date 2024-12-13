import express from "express";
import {
  createMerchant,
  getAllMerchants,
  getMerchantById,
  updateMerchant,
  deleteMerchant,
} from "../controllers/merchantController.js"; // Adjust the path as necessary
import upload from "../config/multerconfig.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorization.js";
import authorizeMultipleRoles from "../middleware/multiAutorize.js"; // Import the authorization middleware

const router = express.Router();

// Create a new merchant (Admin and Manager only)
router.post(
  "/",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin", "Manager"], "merchants", "WRITE"), // Only Admins and Managers can create merchants
  upload.single("trade_permit"),
  createMerchant
);

// Get all merchants (Admin and Manager only)
router.get(
  "/",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin", "Manager"], "merchants", "READ"), // Only Admins and Managers can view all merchants
  getAllMerchants
);

// Get a merchant by ID (Admin, Manager, or the Merchant themselves)
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
  getMerchantById
);

// Update a merchant by ID (Admin, Manager, or the Merchant themselves)
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
  upload.single("trade_permit"),
  updateMerchant
);

// Delete a merchant by ID (Admin only)
router.delete(
  "/:id",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin"], "merchants", "DELETE"), // Only Admins can delete merchants
  deleteMerchant
);

export default router;
