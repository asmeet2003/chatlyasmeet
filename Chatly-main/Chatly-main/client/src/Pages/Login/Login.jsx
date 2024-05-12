import React, { useEffect, useState } from 'react';
import "./Auth.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const login = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/login', formData, { withCredentials: true });
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error('Check Credentials.');
            } else {
                console.error('Registration failed:', error);
            }
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get('/auth/already', { withCredentials: true });
                navigate("/")
            } catch (error) {
                console.log("Please Login")
            }
        };
        checkAuth();
    }, []);

    return (
        <div className="auth">
            <ToastContainer />
            <h1>Login</h1>
            <form onSubmit={login}>
                <div className="auth__container">
                    <input type="email" placeholder='Email' name='email' onChange={handleChange} required />
                    <input type="password" placeholder='Password' name='password' onChange={handleChange} required />

                    <button type="submit">Login</button>
                </div>
            </form>
            <p className="transfer">Don't have Profile?
                <Link to="/signup" style={{ textDecoration: "none" }}>
                    <span> Create</span>
                </Link>
            </p>
        </div>
    )
}

export default Login;