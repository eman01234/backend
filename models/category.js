import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Category Schema
const categorySchema = new Schema(
  {
    name: {
      type: String,
      enum: ["Vegetables", "Fruits", "Spices"],
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
