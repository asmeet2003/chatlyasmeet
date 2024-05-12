import React, { createContext, useContext, useReducer } from 'react';

export const initialState = {
    user: null,
    friends: [],
}

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ reducer, initialState, children }) => (
    <AuthContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </AuthContext.Provider>
);


// Reducer
export const authReducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.payload.user,
            };
        case "SET_FRIENDS":
            return {
                ...state,
                friends: action.payload.friends,
            };
        case "ADD_FRIEND":
            const updatedFriends = [...state.friends, action.payload.friend];
            return {
                ...state,
                friends: updatedFriends,
            };
        case "REMOVE_FRIEND":
            return {
                ...state,
                friends: state.friends.filter(friend => friend._id !== action.payload.friendId),
            }
        case "SET_LOGOUT":
            return {
                ...state,
                user: null,
                friends: [],
            };
        default:
            return state;
    }
};