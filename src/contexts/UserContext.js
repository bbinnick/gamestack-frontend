import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(authService.getUser());
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedUser = authService.getUser();
            setUser(decodedUser);
        }
    }, []);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            authService.removeToken();
            setUser(null);
            console.log(`${user.username} logged out`);
            navigate('/log-in');
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);