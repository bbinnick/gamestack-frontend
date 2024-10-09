import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user:', error);
            }
        }
    }, []);

    return (
        <div>
            <div>
                <h1>Welcome to My Site</h1>
                <p>This is the home landing page.</p>
                {user ? (
                    <p>Logged in as: {user.username}</p>
                ) : (
                    <p>No user logged in</p>
                )}
                <Button onClick={() => navigate('/sign-up')}>Register</Button>
                <Button onClick={() => navigate('/log-in')}>Log In</Button>
            </div>
        </div>
    );
};

export default Home;