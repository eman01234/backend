import express from "express";
import {
  createOrUpdateCart,
  getCartByCustomerId,
  updateCartItems,
  deleteCartByCustomerId,
} from "../controllers/cartController.js"; // Adjust the path as necessary
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorization.js";
import authorizeMultipleRoles from "../middleware/multiAutorize.js";

const router = express.Router();

// Create or update a cart for a customer (Customer or Admin/Manager)
router.post(
  "/",
  auth, // First authenticate the user
  authorizeMultipleRoles(["Admin", "Manager", "Customer"], "carts", "WRITE"),
  createOrUpdateCart
);

// Get cart by customer ID (Customer themselves, Admin, or Manager)
router.get(
  "/:customerId",
  auth, // First authenticate the user
  (req, res, next) => authorize(req.user.role, "carts", "READ")(req, res, next),
  getCartByCustomerId
);

// Update cart items (Customer themselves or Admin/Manager)
router.put(
  "/",
  auth, // First authenticate the user
  authorizeMultipleRoles(["Admin", "Manager", "Customer"], "carts", "WRITE"),
  updateCartItems
);

// Delete cart by customer ID (Customer themselves or Admin/Manager)
router.delete(
  "/:customerId",
  auth, // First authenticate the user
  (req, res, next) =>
    authorize(req.user.role, "carts", "DELETE")(req, res, next),
  deleteCartByCustomerId
);

export default router;
