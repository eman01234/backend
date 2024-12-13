import mongoose from "mongoose";
const Schema = mongoose.Schema;

const shoppingCartSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [
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
        }, // Price of the product at the time it was added to the cart
      },
    ],
    total_amount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to calculate total_amount before saving the document
shoppingCartSchema.pre("save", function (next) {
  this.total_amount = this.items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  next();
});

const Cart = mongoose.model("Cart", shoppingCartSchema);

export default Cart;
