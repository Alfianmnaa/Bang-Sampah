import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import PaymentRoutes from "./routes/PaymentRoutes.js";
const app = express();

// setup middleware
dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 4000;
// route
app.get("/", (req, res) => {
  res.send("hallo from " + req.path);
  console.log("request came from route " + req.path);
});

app.use("/api/payment", PaymentRoutes);

app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});
