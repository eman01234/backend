import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import auth from "../middleware/auth.js";
import authorizeMultipleRoles from "../middleware/authorization.js";

const router = express.Router();

// Create a new category (Admin or Manager only)
router.post(
  "/",
  auth, // First authenticate the user
  (req, res, next) =>
    authorizeMultipleRoles(["Admin", "Manager"], "categories", "WRITE")(
      req,
      res,
      next
    ), // Authorize based on the user's role
  createCategory
);

// Get all categories (Anyone can access, including unauthenticated users)
router.get("/", getAllCategories);

// Get a category by ID (Anyone can access, including unauthenticated users)
router.get("/:id", getCategoryById);

// Update a category by ID (Admin or Manager only)
router.put(
  "/:id",
  auth, // First authenticate the user
  (req, res, next) =>
    authorizeMultipleRoles(["Admin", "Manager"], "categories", "WRITE")(
      req,
      res,
      next
    ), // Authorize based on the user's role
  updateCategory
);

// Delete a category by ID (Admin or Manager only)
router.delete(
  "/:id",
  auth, // First authenticate the user
  (req, res, next) =>
    authorizeMultipleRoles(["Admin", "Manager"], "categories", "DELETE")(
      req,
      res,
      next
    ), // Authorize based on the user's role
  deleteCategory
);

export default router;
