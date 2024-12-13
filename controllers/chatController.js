import Chat from "../models/chat.js";
import Message from "../models/message.js";

// Start a new chat
export const startChat = async (req, res) => {
  const { customer, manager, text } = req.body;

  try {
    // Create a new chat
    const chat = new Chat({
      customer,
      manager,
    });

    // Create the initial message
    const message = new Message({
      chat: chat._id,
      sender: "customer", // Assuming the first message is from the customer
      text,
    });

    // Save the message
    await message.save();

    // Add the message to the chat
    chat.messages.push(message._id);

    // Save the chat
    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    console.error("Error starting chat:", error.message);
    res.status(500).json({ message: "Error starting chat" });
  }
};

// Send a message in a chat
export const sendMessage = async (req, res) => {
  const { chatId, sender, text } = req.body;

  try {
    // Find the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Create a new message
    const message = new Message({
      chat: chat._id,
      sender,
      text,
    });

    // Save the message
    await message.save();

    // Add the message to the chat
    chat.messages.push(message._id);
    chat.lastUpdated = Date.now();

    // Save the chat
    await chat.save();

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Error sending message" });
  }
};

// Get all messages in a chat
export const getChatMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate("messages")
      .populate("customer")
      .populate("manager");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat.messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// Get all chats for a customer
export const getCustomerChats = async (req, res) => {
  try {
    const chats = await Chat.find({ customer: req.params.customerId })
      .populate("messages")
      .populate("manager");

    if (!chats || chats.length === 0) {
      return res
        .status(404)
        .json({ message: "No chats found for this customer" });
    }

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching customer chats:", error.message);
    res.status(500).json({ message: "Error fetching customer chats" });
  }
};

// Get all chats for a manager
export const getManagerChats = async (req, res) => {
  try {
    const chats = await Chat.find({ manager: req.params.managerId })
      .populate("messages")
      .populate("customer");

    if (!chats || chats.length === 0) {
      return res
        .status(404)
        .json({ message: "No chats found for this manager" });
    }

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching manager chats:", error.message);
    res.status(500).json({ message: "Error fetching manager chats" });
  }
};

// Close a chat
export const closeChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(
      req.params.chatId,
      { status: "closed" },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({ message: "Chat closed successfully", chat });
  } catch (error) {
    console.error("Error closing chat:", error.message);
    res.status(500).json({ message: "Error closing chat" });
  }
};
