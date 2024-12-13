import Cart from "../models/cart.js";

// Create a new cart or update an existing one for a customer
export const createOrUpdateCart = async (req, res) => {
  const { customer, items } = req.body;

  try {
    // Find existing cart for the customer
    let cart = await Cart.findOne({ customer });

    if (cart) {
      // If cart exists, update the items
      items.forEach((item) => {
        const productIndex = cart.items.findIndex(
          (p) => p.product.toString() === item.product
        );

        if (productIndex >= 0) {
          // Update quantity if product already exists in cart
          cart.items[productIndex].quantity += item.quantity;
          cart.items[productIndex].price = item.price; // Update price if necessary
        } else {
          // Add new product to cart
          cart.items.push(item);
        }
      });
    } else {
      // If no cart exists, create a new one
      cart = new Cart({
        customer,
        items,
      });
    }

    // Save the cart (this will trigger the pre-save middleware to update total_amount)
    const savedCart = await cart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error creating or updating cart" });
  }
};

// Get cart by customer ID
export const getCartByCustomerId = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      customer: req.params.customerId,
    }).populate("items.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

// Update cart items (e.g., change quantity or remove items)
export const updateCartItems = async (req, res) => {
  const { customer, items } = req.body;

  try {
    let cart = await Cart.findOne({ customer });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Update the items in the cart
    items.forEach((item) => {
      const productIndex = cart.items.findIndex(
        (p) => p.product.toString() === item.product
      );

      if (productIndex >= 0) {
        if (item.quantity > 0) {
          // Update quantity if product already exists in cart and quantity > 0
          cart.items[productIndex].quantity = item.quantity;
          cart.items[productIndex].price = item.price;
        } else {
          // Remove the item if quantity is set to 0
          cart.items.splice(productIndex, 1);
        }
      } else {
        // Add new product to cart if it doesn't exist
        cart.items.push(item);
      }
    });

    // Save the cart (this will trigger the pre-save middleware to update total_amount)
    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error updating cart" });
  }
};

// Delete a cart by customer ID
export const deleteCartByCustomerId = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({
      customer: req.params.customerId,
    });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error deleting cart" });
  }
};
