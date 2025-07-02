import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/userRoutes.js";
import postRoute from "./routes/postRoutes.js";
import commentRoute from "./routes/commentRoutes.js";
import messageRoute from "./routes/messageRouter.js";
import { app, server } from "./socket/socket.js";

//const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Back-end",
    success: true,
  });
});

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);
app.use("/api/message", messageRoute);

server.listen(PORT, () => {
  connectDB();
  console.log(`Server listen at port ${PORT}`);
});
