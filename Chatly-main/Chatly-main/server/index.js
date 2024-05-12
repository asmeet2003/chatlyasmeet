import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import connectDB from "./db/Connection.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import Message from "./model/Message.js";

// CONFIGURATION
dotenv.config();
connectDB();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use(errorHandler);

/* auth */
app.use("/auth", authRoutes);

/* message */
app.use("/message", messageRoutes);


// --------------- Deployment ---------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/client/build")));
} else {
    console.log("API is Running Successfully");
}
// --------------- Deployment ---------------

// LISTEN 
const PORT = process.env.PORT || 5846;

httpServer.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
});


io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (user) => {
        socket.join(user._id);
        socket.emit("connected")
        // console.log("connected: +", user._id);
    });

    socket.on("receiver user", (room) => {
        socket.join(room);
        // console.log("RECEIVER USER: " + room);
    });


    socket.on("new message", async (newMessageReceived) => {
        try {
            const sender = newMessageReceived.sender;
            const receiver = newMessageReceived.receiver;
            const messageContent = newMessageReceived.message;

            // Emit the new message to both sender and receiver rooms
            io.to(sender).emit("message received", newMessageReceived);
            io.to(receiver).emit("message received", newMessageReceived);

            // console.log("New message sent:", newMessageReceived);
        } catch (error) {
            console.error("Error sending new message:", error);
        }
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(user._id);
    })
});