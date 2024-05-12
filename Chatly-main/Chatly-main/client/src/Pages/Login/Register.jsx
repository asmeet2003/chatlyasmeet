import React, { useEffect, useState } from 'react';
import "./Auth.css";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        profileImage: '',
        userName: '',
        email: '',
        country: '',
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
    }

    const register = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/auth/register", formData, {
                headers: {
                    "Content-type": "application/json",
                },
            });
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error('Email is already in use.');
            } else if (error.response && error.response.status === 500) {
                toast.error('userName is already in use.');
            } else {
                console.error('Registration failed:', error);
            }
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get('/auth/already', { withCredentials: true });
                navigate("/")
            } catch (error) {
                console.log("Please create account")
            }
        };
        checkAuth();
    }, []);

    return (
        <div className="auth">
            <ToastContainer />
            <h1>Create Profile</h1>
            <form onSubmit={register}>
                <div className="auth__container">
                    <div className="image__container" onClick={handleAddPhotoClick}>
                        {image ? (
                            <img src={image} alt="Selected" className='selectedImage' />
                        ) : (
                            <AddAPhotoIcon className='addimage' />
                        )}
                    </div>

                    <input type="file" id='imageInput' name="profileImage" accept='image/*' onChange={handleChange} style={{ display: 'none' }} required />

                    <input type="text" placeholder='UserName' name='userName' onChange={handleChange} required />
                    <input type="email" placeholder='Email' name='email' onChange={handleChange} required />
                    <input type="password" placeholder='Password' name='password' onChange={handleChange} required />

                    <button type="submit">Create</button>
                </div>
            </form>
            <p className="transfer">Already have Profile?
                <Link to="/login" style={{ textDecoration: "none" }}>
                    <span> Login </span>
                </Link>
            </p>
        </div>
    )
}

export default Register;