import express from "express";
import {
  loginUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/authController.js"; // Adjust the path as necessary
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorization.js";
import authorizeMultipleRoles from "../middleware/multiAutorize.js";

const router = express.Router();

// Login user (No authentication or authorization needed)
router.post("/login", loginUser);

// Get all users (Admin only)
router.get(
  "/",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Admin", "Manager"], "users", "READ"),
  getAllUsers
);

// Get a user by ID (Admin or the user themselves)
router.get(
  "/:id",
  auth, // Authenticate the user
  getUserById
);

// Update a user by ID (Admin or the user themselves)
router.put(
  "/:id",
  auth, // Authenticate the user
  (req, res, next) =>
    authorize(req.user.role, "users", "WRITE")(req, res, next),
  updateUser
);

// Delete a user by ID (Admin only)
router.delete(
  "/:id",
  auth, // Authenticate the user

  deleteUser
);

export default router;
