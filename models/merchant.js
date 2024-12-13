// Merchant Schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;
const merchantSchema = new Schema(
  {
    trade_permit: {
      type: String, // Store file path or URL
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Merchant = mongoose.model("Merchant", merchantSchema);

export default Merchant;
