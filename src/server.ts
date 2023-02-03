import express from "express";
import bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";

import connectDB from "../config/database";
import auth from "./routes/api/auth";
import user from "./routes/api/user";
import profile from "./routes/api/profile";
import contact from "./routes/api/contact";

const app = express();

// Connect to MongoDB
connectDB();

// CORS
const whitelistOrigins = ["http://localhost", "https://vercel.app"];
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (whitelistOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));

// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// @route   GET /
// @desc    Test Base API
// @access  Public
app.get("/", (_req, res) => {
  res.send("OK");
});

app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/profile", profile);
app.use("/api/contact", contact);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;
