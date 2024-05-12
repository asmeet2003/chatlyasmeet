import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.chat_jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (err) {
            console.error(err.message);
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ error: 'Not authorized, no token' })
    }
};