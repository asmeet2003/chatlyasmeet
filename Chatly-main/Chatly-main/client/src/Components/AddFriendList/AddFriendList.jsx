import React, { useContext, useEffect, useState } from 'react';
import "./AddFriendList.css";
import axios from "axios";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../authContext';

function AddFriendList({ onClose }) {
    const [users, setUsers] = useState([]);
    const [{ friends }, dispatch] = useAuth();

    const handleAddFriend = async (friendId) => {
        try {
            const response = await axios.patch(`/auth/${friendId}`, {}, { withCredentials: true });
            dispatch({ type: "ADD_FRIEND", payload: { friend: response.data.friendDetails } }); // Change 'friends' to 'friend'
            fetchUsers();
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    }

    const fetchUsers = async () => {
        try {
            await axios.get('/auth/users', { withCredentials: true })
                .then(response => {
                    setUsers(response.data.users);
                })
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const closeAndRefresh = () => {
        onClose();
    };

    // console.log("Friends: ", friends);
    return (
        <div className='addFriendList'>
            <div className="popup">
                <div className="head">
                    <p>add friend</p>
                    <CloseIcon className='close' onClick={closeAndRefresh} />
                </div>
                {users.length > 0 ? (
                    users.map(user => (
                        <div key={user._id} className="add__friend">
                            <div className="user__info">
                                <img src={user.profileImage} alt="pro-image" />
                                <h2>{user.userName}</h2>
                            </div>
                            <AddCircleOutlineIcon className='add' style={{ borderBottom: 'none' }} onClick={() => handleAddFriend(user._id)} />
                        </div>
                    ))
                ) : (
                    <p>No user for adding</p>
                )}
            </div>
        </div>
    )
}

export default AddFriendList;