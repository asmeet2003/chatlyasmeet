import React from 'react'
import { Link } from 'react-router-dom';
import "./404.css";

function Error() {
    return (
        <div className='error'>
            <h1>404</h1>
            <p>please go back to
                <Link to="/">
                    <span> chat</span>
                </Link>
            </p>
        </div>
    )
}

export default Error;