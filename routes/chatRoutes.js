import express from "express";
import {
  startChat,
  sendMessage,
  getChatMessages,
  getCustomerChats,
  getManagerChats,
  closeChat,
} from "../controllers/chatController.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorization.js";
import authorizeMultipleRoles from "../middleware/multiAutorize.js";
const router = express.Router();

// Start a new chat (Customer or Manager)
router.post(
  "/start",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Customer", "Manager"], "chats", "WRITE"), // Authorize Customer and Manager roles
  startChat
);

// Send a message in a chat (Customer or Manager)
router.post(
  "/send",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Customer", "Manager"], "chats", "WRITE"), // Authorize Customer and Manager roles
  sendMessage
);

// Get all messages in a chat (Customer or Manager involved in the chat)
router.get(
  "/:chatId/messages",
  auth, // Authenticate the user
  (req, res, next) => {
    // Check if the user is involved in the chat
    // Assume a middleware or helper function `isUserInChat` that checks if the user is part of the chat
    if (
      req.user.role === "Admin" ||
      isUserInChat(req.user.id, req.params.chatId)
    ) {
      next();
    } else {
      res.status(403).json({ message: "Permission denied" });
    }
  },
  getChatMessages
);

// Get all chats for a customer (Customer themselves)
router.get(
  "/customer/:customerId",
  auth, // Authenticate the user
  (req, res, next) => {
    if (req.user.role === "Customer" && req.user.id === req.params.customerId) {
      next();
    } else {
      res.status(403).json({ message: "Permission denied" });
    }
  },
  getCustomerChats
);

// Get all chats for a manager (Manager themselves)
router.get(
  "/manager/:managerId",
  auth, // Authenticate the user
  (req, res, next) => {
    if (req.user.role === "Manager" && req.user.id === req.params.managerId) {
      next();
    } else {
      res.status(403).json({ message: "Permission denied" });
    }
  },
  getManagerChats
);

// Close a chat (Manager or Admin only)
router.put(
  "/:chatId/close",
  auth, // Authenticate the user
  authorizeMultipleRoles(["Manager", "Admin"], "chats", "WRITE"), // Authorize Manager and Admin roles
  closeChat
);

export default router;
