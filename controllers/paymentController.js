import Payment from "../models/payment.js";

// Create a new payment
export const createPayment = async (req, res) => {
  const {
    order,
    customer,
    amount,
    paymentMethod,
    paymentStatus,
    transactionId,
    paymentDate,
    assignedOrder,
  } = req.body;

  try {
    const newPayment = new Payment({
      order,
      customer,
      amount,
      paymentMethod,
      paymentStatus,
      transactionId,
      paymentDate,
      assignedOrder,
    });

    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error creating payment" });
  }
};

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("order")
      .populate("customer")
      .populate("assignedOrder");
    res.status(200).json(payments);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching payments" });
  }
};

// Get a payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("order")
      .populate("customer")
      .populate("assignedOrder");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching payment" });
  }
};

// Update a payment
export const updatePayment = async (req, res) => {
  const {
    order,
    customer,
    amount,
    paymentMethod,
    paymentStatus,
    transactionId,
    paymentDate,
    assignedOrder,
  } = req.body;

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        order,
        customer,
        amount,
        paymentMethod,
        paymentStatus,
        transactionId,
        paymentDate,
        assignedOrder,
      },
      { new: true, runValidators: true }
    )
      .populate("order")
      .populate("customer")
      .populate("assignedOrder");

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Error updating payment" });
  }
};

// Delete a payment
export const deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error deleting payment" });
  }
};
