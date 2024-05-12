import bcrypt from "bcryptjs";
import User from "../model/User.js";
import { generateToken } from "../middleware/generateToken.js";
import { ObjectId } from "mongodb";

// REGISTER
export const register = async (req, res, next) => {
    try {
        const { profileImage, userName, email, password } = req.body;

        const emailExists = await User.findOne({ email });
        const nameExists = await User.findOne({ userName });
        if (emailExists) {
            res.status(400);
            throw new Error('Email already exists');
        }

        if (nameExists) {
            res.status(500);
            throw new Error('userName already exists');
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            userName,
            email,
            password: passwordHash,
            profileImage,
        });
        res.status(201).json({ newUser });
    } catch (error) {
        next(error);
    }
};

// LOGIN
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ msg: "User does not exist." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ msg: "Invalid password." });
        }
        generateToken(res, user._id);
        delete user.password;
        res.status(200).json({ user })
    } catch (error) {
        next(error);
    }
};

// UPDATE
export const update = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const { profileImage, userName, email, password } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        // Update user information
        user.userName = userName || user.userName;
        user.email = email || user.email;
        user.profileImage = profileImage || user.profileImage;

        // If a new password is provided, update the password
        if (password) {
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);
            user.password = passwordHash;
        }

        await user.save();

        res.status(200).json({ msg: 'Profile updated successfully', user });
    } catch (error) {
        next(error);
    }
};


// PROFILE
export const logout = async (req, res, next) => {
    try {
        res.cookie('chat_jwt', '', {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

// isLoggedIn
export const alreadyUser = async (req, res, next) => {
    try {
        const user = req.user;

        if (user) {
            return res.json({
                email: user.email,
            });
        }
    } catch (error) {
        next(error);
    }
};



//get User detail
export const getUserDetails = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};


//get all the User
export const getAllUser = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const currentUser = await User.findById(userId);

        // Get user IDs of friends
        const friendIds = currentUser.friends.map(friend => friend._id.toString());

        // Query users excluding current user and friends
        const users = await User.find({
            _id: { $nin: [userId, ...friendIds] } // Excluding current user and friends
        }, { password: 0 });

        res.status(200).json({ users });
    } catch (error) {
        next(error);
    }
};

// add-remove friend
export const addRemoveFriend = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const friendId = req.params.friendId;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "User or friend not found" });
        }

        // Convert friendId to ObjectId if it's not already
        const friendObjectId = ObjectId.isValid(friendId) ? new ObjectId(friendId) : friendId;

        if (user.friends.includes(friendObjectId.toString())) {
            user.friends = user.friends.filter(id => id.toString() !== friendObjectId.toString());
            friend.friends = friend.friends.filter(id => id.toString() !== userId.toString());
        } else {
            user.friends.push(friendObjectId);
            friend.friends.push(userId);
        }

        await user.save();
        await friend.save();

        const friendDetails = {
            _id: friend._id,
            userName: friend.userName,
            profileImage: friend.profileImage
        };

        res.status(200).json({ friendDetails });
    } catch (error) {
        next(error);
    }
};


// const friends = await Promise.all(
//     user.friends.map((id) => User.findById(id))
// );

// const friendList = friends.map(
//     ({ _id, userName, profileImage }) => {
//         return { _id, userName, profileImage };
//     }
// );






// export const addRemoveFriend = async (req, res, next) => {
//     try {
//         const userId = req.user._id;
//         const friendId = req.params.friendId;

//         const user = await User.findById(userId);
//         const friend = await User.findById(friendId);

//         if (!user || !friend) {
//             return res.status(404).json({ message: "User or friend not found" });
//         }

//         // Convert friendId to ObjectId if it's not already
//         const friendObjectId = ObjectId.isValid(friendId) ? new ObjectId(friendId) : friendId;

//         if (user.friends.includes(friendObjectId.toString())) {
//             user.friends = user.friends.filter(id => id.toString() !== friendObjectId.toString());
//             friend.friends = friend.friends.filter(id => id.toString() !== userId.toString());
//         } else {
//             user.friends.push(friendObjectId);
//             friend.friends.push(userId);
//         }

//         await user.save();
//         await friend.save();

//         // Retrieve updated friends list for the current user
//         const updatedUser = await User.findById(userId)
//             .populate('_id userName profileImage');
//             // .populate('friends', '_id userName profileImage');

//         // Retrieve updated friends list for the friend
//         const updatedFriend = await User.findById(friendId)
//             .populate('friends', '_id userName profileImage');

//         res.status(200).json({
//             userFriends: updatedUser,
//             friendFriends: updatedFriend.friends
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// get all friends
export const getUserFriends = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({ _id, userName, profileImage }) => {
                return { _id, userName, profileImage };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (error) {
        next(error);
    }
};