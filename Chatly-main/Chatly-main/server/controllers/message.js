import Message from "../model/Message.js";

export const allMessages = async (req, res, next) => {
    try {
        const sender = req.user._id;
        const receiver = req.params.friendId;

        // Find all messages where sender is the current user and receiver is the friend
        const messagesSentBySender = await Message.find({ sender, receiver });

        // Find all messages where sender is the friend and receiver is the current user
        const messagesReceivedBySender = await Message.find({ sender: receiver, receiver: sender });

        // Concatenate the messages and sort them by timestamp
        const allMessages = messagesSentBySender.concat(messagesReceivedBySender).sort((a, b) => a.createdAt - b.createdAt);

        res.status(200).json(allMessages);
    } catch (error) {
        next(error);
    }
};

export const sendMessages = async (req, res, next) => {
    try {
        const sender = req.user._id;
        const receiver = req.params.friendId;
        const { message } = req.body;

        const newMessage = new Message({
            sender,
            receiver,
            message
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        next(error);
    }
};

