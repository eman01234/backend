import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

// Connect Database
connectDB();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Init Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    credentials: true,
  })
);

// Define Routes
import authRoutes from "./routes/auth.js";
import merchantRoutes from "./routes/merchantRoutes.js";
import productReviewRoutes from "./routes/productReviewRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import deliveryPersonRoutes from "./routes/deliveryPersonRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import adminUserRoutes from "./routes/adminUserRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import managerRoutes from "./routes/managerRoutes.js";

app.use("/api/adminusers", adminUserRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/chats", chatRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/cart", cartRoutes);
app.use("/api/deliverypersons", deliveryPersonRoutes);
app.use("/api/merchants", merchantRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/product/review", productReviewRoutes);
app.use("/api/customers", customerRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
