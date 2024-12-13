import ProductReview from "../models/productReview.js";

// Create a new review
export const createReview = async (req, res) => {
  const { product, customer, rating, comment } = req.body;

  try {
    const newReview = new ProductReview({
      product,
      customer,
      rating,
      comment,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error creating review" });
  }
};

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await ProductReview.find()
      .populate("product")
      .populate("customer");
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

// Get a review by ID
export const getReviewById = async (req, res) => {
  try {
    const review = await ProductReview.findById(req.params.id)
      .populate("product")
      .populate("customer");
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching review" });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const updatedReview = await ProductReview.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true, runValidators: true }
    )
      .populate("product")
      .populate("customer");

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error updating review" });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const deletedReview = await ProductReview.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error deleting review" });
  }
};
