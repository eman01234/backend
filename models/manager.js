import mongoose from "mongoose";
const Schema = mongoose.Schema;
const managerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
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

const Customer = mongoose.model("Manager", managerSchema);

export default Customer;
