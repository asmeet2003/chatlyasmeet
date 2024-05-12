import React, { useEffect, useState } from 'react';
import "./Home.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Chat from '../../Components/Chat/Chat';
import Welcome from '../../Components/Welcome/Welcome';

function Home() {
    const navigate = useNavigate();
    const [selectedFriend, setSelectedFriend] = useState(null);

    const handleFriendSelect = (friend) => {
        setSelectedFriend(friend);
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get('/auth/already', { withCredentials: true });
                console.log('already have token');
            } catch (error) {
                navigate('/login');
            }
        };
        checkAuth();
    }, []);

    return (
        <div className="home">
            <div className="home__body">
                <Sidebar onFriendSelect={handleFriendSelect} />
                {selectedFriend ? (
                    <Chat selectedFriend={selectedFriend} />
                ) : (
                    <Welcome />
                )}
            </div>
        </div>
    )
}

export default Home;