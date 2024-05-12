import React, { useContext, useEffect, useState } from 'react';
import "./Friends.css";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from 'axios';
import { useAuth } from '../../authContext';

function Friends({ friend, onRemove, onSelect, isSelected }) {
  const [{ friends }, dispatch] = useAuth();

  const handleRemoveFriend = async () => {
    try {
      const response = await axios.patch(`/auth/${friend._id}`, {}, { withCredentials: true });
      dispatch({ type: "REMOVE_FRIEND", payload: { friendId: friend._id } });
      onRemove(friend._id);
      console.log("onremove", friends);
    } catch (error) {
      console.error('Error removing friends:', error);
    }
  };

  return (
    <div className='friends'>
      <div className={`info ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
        <img src={friend.profileImage} alt="pro-image" />
        <div className="friends__info">
          <h2>{friend.userName} </h2>
          <p>chat with {friend.userName}</p>
        </div>
      </div>
      <DeleteOutlineIcon className='delete' onClick={handleRemoveFriend} />
    </div>
  )
}

export default Friends;