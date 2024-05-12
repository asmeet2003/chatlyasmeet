import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { allMessages, sendMessages } from "../controllers/message.js";

const router = express.Router();

router.get("/:friendId", verifyToken, allMessages);
router.post("/:friendId", verifyToken, sendMessages);

export default router;