import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider, CssBaseline, Container } from '@mui/material';
import AppAppBar from '../components/AppAppBar';
import MainContent from '../components/MainContent';
import Latest from '../components/Latest';
import Footer from '../components/Footer';
import TemplateFrame from '../components/TemplateFrame';
import getDashboardTheme from '../theme/getDashboardTheme';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useThemeContext } from '../components/ThemeContext';
import axios from 'axios';

export default function Dashboard() {
    const { mode, toggleColorMode } = useThemeContext();
    const DashboardTheme = createTheme(getDashboardTheme(mode));
    const [user, setUser] = useState(null);
    const [games, setGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                console.log('Decoded token:', decodedUser);
                setUser(decodedUser ? decodedUser : null);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('token');
            }
        }
        
        const fetchGames = async () => {
            try {
                const response = await axios.get('http://localhost:8080/games/all', {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                const gamesData = response.data.map(game => {
                    const imageUrl = game.imageUrl
                        ? `http://localhost:8080/uploads/${game.imageUrl}`
                        : null;
                    return { ...game, imageUrl };
                });
                setGames(gamesData);
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };

        fetchGames();
    }, []);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            console.log(`${user.username} logged out`);
            localStorage.removeItem('token');
            setUser(null);
            navigate('/log-in');
        }
    };

    return (
        <TemplateFrame
            mode={mode}
            toggleColorMode={toggleColorMode}
            user={user}
        >
            <ThemeProvider theme={DashboardTheme}>
                <CssBaseline enableColorScheme />
                <AppAppBar user={user} handleLogout={handleLogout} />
                <Container
                    maxWidth="lg"
                    component="main"
                    sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
                >
                    <MainContent games={games} />
                    <Latest />
                </Container>
                <Footer />
            </ThemeProvider>
        </TemplateFrame>
    );
}