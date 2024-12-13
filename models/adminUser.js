import mongoose from "mongoose";
const Schema = mongoose.Schema;

// User Schema
const adminSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["admin", "manager"],
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const AdminUser = mongoose.model("AdminUser", adminSchema);

export default AdminUser;
