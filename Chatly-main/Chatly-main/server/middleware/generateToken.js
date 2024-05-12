import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.cookie('chat_jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict',
            secure: true,
        });

    } catch (error) {
        console.error("Error generating or setting JWT:", error);
    }
};
