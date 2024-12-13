import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    deliveryPerson: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming delivery person is a user with a specific "delivery" role
      required: true,
    },
    delivery_address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: false,
      },
      state: {
        type: String,
        required: false,
      },
      postal_code: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
    },
    orderDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    deliveryDate: {
      type: Date,
      required: false, // This will be set once the order is delivered
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
