import React from 'react';
import "./Welcome.css";
import chat from "./chat.png";

function Welcome() {
    return (
        <div className='welcome'>
            <img src={chat} alt="Chat-Logo" />
            <h1>Welcome to <span style={{color:'greenyellow'}}>Chatly.</span></h1>
            <p>Please select/add a friend to start chatting.</p>
        </div>
    )
}

export default Welcome;