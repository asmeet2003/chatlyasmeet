import React, { useState } from 'react';
import "./Profile.css";
import { useAuth } from '../../authContext';
import axios from 'axios';

function Profile({ profileClose }) {
    const [{ user }, dispatch] = useAuth();
    const { profileImage, userName, email } = user.user;
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        profileImage: profileImage,
        userName: userName,
        email: email,
        password: '',
    });

    const handleAddPhotoClick = () => {
        document.getElementById('imageInput').click();
    };

    const handleChange = async (e) => {
        if (e.target.name === 'profileImage') {
            const file = e.target.files[0];
            if (file) {
                try {
                    setImage(URL.createObjectURL(file));
                    const data = new FormData();
                    data.append('file', file);
                    data.append("upload_preset", "yuvraj");
                    data.append("cloud_name", "dkh984g6c");

                    const response = await fetch("https://api.cloudinary.com/v1_1/dkh984g6c/image/upload", {
                        method: "POST",
                        body: data,
                    });
                    const result = await response.json();
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        profileImage: result.url,
                    }));
                } catch (error) {
                    console.error('Image upload failed:', error);
                }
            }
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [e.target.name]: e.target.value,
            }));
        }
    };

    const update = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch("/auth/update", formData, { withCredentials: true });
            dispatch({ type: "SET_USER", payload: { user: response.data } });
            profileClose();
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    return (
        <div className="profile">
            <form className="profile__container" onSubmit={update}>
                <div className="image__container" onClick={handleAddPhotoClick}>
                    {image ? (
                        <img src={image} alt="Selected" className='selectedImage' />
                    ) : (
                        <img src={formData.profileImage} alt="profileImg" />
                    )}
                </div>

                <input type="file" name="profileImage" id="imageInput" accept='image/*' onChange={handleChange} style={{ display: 'none' }} />

                <div className="info">
                    <input type="text" name='userName' value={formData.userName} onChange={handleChange} />
                    <input type="email" name='email' value={formData.email} onChange={handleChange} />
                    <input type="password" placeholder='Password' name='password' onChange={handleChange} />
                    <button type="submit">Ok / Save</button>
                </div>
            </form>
        </div>
    )
}

export default Profile;