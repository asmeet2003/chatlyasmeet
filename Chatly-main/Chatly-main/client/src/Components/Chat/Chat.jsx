import React, { useEffect, useState, useRef } from 'react';
import "./Chat.css";
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import io from "socket.io-client"
import { useAuth } from '../../authContext';

const socket = io();

function Chat({ selectedFriend }) {
    const [{ user }] = useAuth();
    const userId = user.user._id;
    // console.log("userId :", userId);
    const [messages, setMessages] = useState([]);
    const [messageData, setMessageData] = useState({
        message: '',
    });
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Emit setup event when component mounts
        socket.emit("setup", { _id: userId });

        // Join chat room for selected friend
        socket.emit("receiver user", selectedFriend._id);

    }, [selectedFriend]);

    useEffect(() => {
        fetchMessages();
    }, [selectedFriend]);

    const handleChange = (e) => {
        setMessageData({ ...messageData, [e.target.name]: e.target.value });
    };

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`/message/${selectedFriend._id}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const send = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/message/${selectedFriend._id}`, messageData, { withCredentials: true });
            console.log("message: ", response.data);
            socket.emit("new message", response.data);
            // setMessages([...messages, response.data])
            setMessageData({
                message: ''
            });
            // fetchMessages();
        } catch (error) {
            console.error('message sent failed:', error);
        }
    };

    useEffect(() => {
        socket.on("message received", (newMessage) => {
            // Check if the new message already exists in the messages state
            if (!messages.find(message => message._id === newMessage._id)) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                scrollToBottom(); // Scroll to bottom when a new message arrives
            }
        });

        return () => {
            socket.off("message received"); // Clean up when component unmounts
        };
    }, [messages]);

    return (
        <div className='chat'>
            <div className="chat__header">
                <img src={selectedFriend.profileImage} alt="pro-image" />
                <div className="user__info">
                    <h2>{selectedFriend.userName}</h2>
                    <p>Chatting...</p>
                </div>
            </div>

            <div className="chat__body">
                {messages.map((message, index) => (
                    <p key={message._id} ref={index === messages.length - 1 ? messagesEndRef : null} className={message.sender === selectedFriend._id ? "chat__receiver" : "chat__message"}>
                        {message.message}
                    </p>
                ))}
            </div>

            <form className="chat__footer" onSubmit={send}>
                <input
                    type="text"
                    placeholder='Type a message'
                    name='message'
                    onChange={handleChange}
                />
                <button type="submit">
                    <span>Send</span><SendIcon />
                </button>
            </form>
            <div ref={messagesEndRef} />
        </div>
    )
}

export default Chat;



// useEffect(() => {
//     const socket = io(); // Connect to the server's Socket.IO instance

//     // Listen for incoming messages
//     socket.on("message", (data) => {
//         // Append the received message to the messages state
//         setMessages(prevMessages => [...prevMessages, data]);
//         scrollToBottom(); // Scroll to the bottom to show the latest message
//     });

//     return () => {
//         socket.disconnect(); // Disconnect when component unmounts
//     };
// }, []);