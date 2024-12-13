import mongoose from "mongoose";
const Schema = mongoose.Schema;
const customerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    orderHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
