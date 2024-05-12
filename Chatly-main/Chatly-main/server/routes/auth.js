import express from "express";
import { addRemoveFriend, alreadyUser, getAllUser, getUserDetails, getUserFriends, login, logout, register, update } from "../controllers/auth.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/update", verifyToken, update);
router.post("/logout", verifyToken, logout);
router.get("/already", verifyToken, alreadyUser);
router.get("/user", verifyToken, getUserDetails);
router.get("/users", verifyToken, getAllUser);
router.patch("/:friendId", verifyToken, addRemoveFriend);
router.get("/friends", verifyToken, getUserFriends);

export default router;