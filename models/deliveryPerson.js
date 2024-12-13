// Merchant Schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;
const deliveryPersonSchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

const DeliveryPerson = mongoose.model("DeliveryPerson", deliveryPersonSchema);

export default DeliveryPerson;
