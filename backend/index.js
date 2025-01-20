import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./helpers/dbConnect.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { app, server } from "./socket/socket.js";
import path from 'path'


// middleware
app.use(express.json());
const corsOptions = {
  origin: process.env.URL,
  credentials: true,
  httpOnly: true,
};

const __dirname = path.resolve()

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// configuration
dotenv.config();

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  dbConnect();
});

// routes
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/message", messageRoutes);

app.use(express.static(path.join(__dirname, '/frontend/dist')))

app.get('*', (req, res)=>{
  res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
})

app.get("/", (req, res) => {
  res.send("Hello from backend");
});
