import express from "express";
import {
  createAdminUser,
  getAllAdminUsers,
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser,
  loginUser,
} from "../controllers/adminUserController.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorization.js";
import authorizeMultipleRoles from "../middleware/multiAutorize.js";

const router = express.Router();

router.post("/login", loginUser);
// Create a new admin user (Admin only)
router.post(
  "/",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin"], "users", "WRITE"), // Only Admins can create admin users
  createAdminUser
);

// Get all admin users (Admin only)
router.get(
  "/",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin"], "users", "READ"), // Only Admins can view all admin users
  getAllAdminUsers
);

// Get an admin user by ID (Admin only)
router.get(
  "/:id",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin"], "users", "READ"), // Only Admins can view an admin user by ID
  getAdminUserById
);

// Update an admin user by ID (Admin only)
router.put(
  "/:id",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin"], "users", "WRITE"), // Only Admins can update admin users
  updateAdminUser
);

// Delete an admin user by ID (Admin only)
router.delete(
  "/:id",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin"], "users", "DELETE"), // Only Admins can delete admin users
  deleteAdminUser
);

export default router;
