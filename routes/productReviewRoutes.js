import express from "express";
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js"; // Adjust the path as necessary
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorization.js";
import authorizeMultipleRoles from "../middleware/multiAutorize.js";

const router = express.Router();

// Create a new review (Customer only)
router.post(
  "/",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Customer"], "productreviews", "WRITE"), // Only Customers can create reviews
  createReview
);

// Get all reviews (Admin, Manager, and Merchant)
router.get(
  "/",
  auth, // Authenticate the user
  authorizeMultipleRoles(
    ["Admin", "Manager", "Merchant"],
    "productreviews",
    "READ"
  ), // Only Admins, Managers, and Merchants can view all reviews
  getAllReviews
);

// Get a review by ID (Admin, Manager, Merchant, or the Customer who wrote the review)
router.get(
  "/:id",
  auth, // Authenticate the user
  (req, res, next) => {
    if (
      ["Admin", "Manager", "Merchant"].includes(req.user.role) ||
      req.user.id === req.params.customerId // Assuming `customerId` is part of the review record and matches the user ID
    ) {
      next();
    } else {
      res.status(403).json({ message: "Permission denied" });
    }
  },
  getReviewById
);

// Update a review by ID (Admin, Manager, or the Customer who wrote the review)
router.put(
  "/:id",
  auth, // Authenticate the user
  (req, res, next) => {
    if (
      ["Admin", "Manager"].includes(req.user.role) ||
      req.user.id === req.params.customerId // Assuming `customerId` is part of the review record and matches the user ID
    ) {
      next();
    } else {
      res.status(403).json({ message: "Permission denied" });
    }
  },
  updateReview
);

// Delete a review by ID (Admin, Manager, or the Customer who wrote the review)
router.delete(
  "/:id",
  auth, // Authenticate the user
  (req, res, next) => {
    if (
      ["Admin", "Manager"].includes(req.user.role) ||
      req.user.id === req.params.customerId // Assuming `customerId` is part of the review record and matches the user ID
    ) {
      next();
    } else {
      res.status(403).json({ message: "Permission denied" });
    }
  },
  deleteReview
);

export default router;
