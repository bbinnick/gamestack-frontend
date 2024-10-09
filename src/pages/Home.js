import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div>
                <h1>Welcome to My Site</h1>
                <p>This is the home landing page.</p>
                <Button onClick={() => navigate('/sign-up')}>Register</Button>
                <Button onClick={() => navigate('/login')}>Log In</Button>
            </div>
        </div>
    );
};

export default Home;