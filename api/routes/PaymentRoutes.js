import express, { Router } from "express";
import midtransclient from "midtrans-client";

const router = express.Router();

router.post("/process-transaction", (req, res) => {
  try {
    const snap = new midtransclient.Snap({
      isProduction: false,
      serverKey: process.env.SERVER_KEY,
      clientKey: process.env.CLIENT_KEY,
    });
    const parameter = {
      item_details: {
        name: req.body.nama,
        price: req.body.total,
        quantity: 1,
      },
      transaction_details: {
        order_id: req.body.order_id,
        gross_amount: req.body.total,
      },
    };
    snap.createTransaction(parameter).then((transaction) => {
      const dataPayment = {
        response: JSON.stringify(transaction),
      };
      const token = transaction.token;
      res.status(200).json({ message: "Berhasil", dataPayment, token: token });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
