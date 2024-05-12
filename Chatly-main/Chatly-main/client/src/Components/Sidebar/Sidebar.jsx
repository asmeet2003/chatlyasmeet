import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Friends from '../Friends/Friends';
import AddFriendList from '../AddFriendList/AddFriendList';
import Profile from '../../Pages/Profile/Profile';
import axios from 'axios';
import { useAuth } from '../../authContext';

function Sidebar({ onFriendSelect }) {
    const navigate = useNavigate();
    const [{ user, friends }, dispatch] = useAuth();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const handleFriendSelect = (friend) => {
        setSelectedFriend(friend);
        if (onFriendSelect) {
            onFriendSelect(friend);
        }
    };

    // pop-up

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };



    const openProfile = () => {
        setIsProfileOpen(true);
    };

    const closeProfile = () => {
        setIsProfileOpen(false);
    };

    // pop-up finished //


    const fetchFriends = async () => {
        try {
            const response = await axios.get('/auth/friends', { withCredentials: true });
            dispatch({ type: "SET_FRIENDS", payload: { friends: response.data } });
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    }


    const fetchUserDetails = async () => {
        try {
            const response = await axios.get('/auth/user', { withCredentials: true });
            dispatch({ type: "SET_USER", payload: { user: response.data } });
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    };

    useEffect(() => {
        fetchFriends();
        fetchUserDetails();
    }, []);

    const logout = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/logout', { withCredentials: true });
            dispatch({ type: "SET_LOGOUT" });
            navigate("/login");
        } catch (error) {
            console.error('Error during LOGOUT:', error);
        }
    };

    return (
        <div className="sidebar">
            <h2 className="title">Chatly.</h2>
            <div className="add">
                <AddCircleOutlineIcon className='addicon' onClick={openPopup} />
                {isPopupOpen && <AddFriendList onClose={closePopup} />}
            </div>

            <div className="friends__list">
                {friends && friends.map((friend) => (
                    <Friends
                        key={friend._id}
                        friend={friend}
                        onSelect={() => handleFriendSelect(friend)}
                        isSelected={selectedFriend && selectedFriend._id === friend._id}
                    />
                ))}
            </div>

            <div className="footer">
                {user &&
                    <div className='profile__details'>
                        <img src={user.user.profileImage} alt="pro-image" />
                        <h2 className="user" onClick={openProfile}>{user.user.userName}</h2>
                    </div>
                }
                {isProfileOpen && <Profile profileClose={closeProfile} />}

                <div className="log__out" onClick={logout}>
                    <PowerSettingsNewIcon className='power' />
                    <h4>Log out</h4>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;