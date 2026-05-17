const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_test_Sea2dek97Di1Kr",
  key_secret: "CTl9LipsZeTZfk7HTOQ5kfcQ",
});

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // paise ma
      currency: "INR",
      receipt: "order_rcptid_11",
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};