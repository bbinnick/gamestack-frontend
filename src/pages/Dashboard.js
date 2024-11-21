import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider, CssBaseline, Container } from '@mui/material';
import AppAppBar from '../components/AppAppBar';
import MainContent from '../components/MainContent';
import Latest from '../components/Latest';
import Footer from '../components/Footer';
import TemplateFrame from '../components/TemplateFrame';
import getDashboardTheme from '../theme/getDashboardTheme';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../components/ThemeContext';
import authService from '../services/AuthService';

export default function Dashboard({ user, handleLogout }) {
    const { mode, toggleColorMode } = useThemeContext();
    const DashboardTheme = createTheme(getDashboardTheme(mode));
    const [games, setGames] = useState([]);
    const [popularGames, setPopularGames] = useState([]);
    const [newReleases, setNewReleases] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await authService.getAxiosInstance().get('/games/all');
                const gamesData = response.data.map(game => {
                    const imageUrl = game.imageUrl ? `http://localhost:8080/uploads/${game.imageUrl}` : null;
                    return { ...game, imageUrl };
                });
                setGames(gamesData);
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };

        const fetchPopularGames = async () => {
            try {
                const response = await authService.getAxiosInstance().get('/igdb/games/hyped', {
                    params: { limit: 10 }
                });
                setPopularGames(response.data);
            } catch (error) {
                console.error('Error fetching popular games:', error);
            }
        };

        const fetchNewReleases = async () => {
            try {
                const response = await authService.getAxiosInstance().get('/igdb/games/new-releases', {
                    params: { fields: 'id,name,cover.url', limit: 10 }
                });
                setNewReleases(response.data);
            } catch (error) {
                console.error('Error fetching new releases:', error);
            }
        };

        fetchGames();
        fetchPopularGames();
        fetchNewReleases();
    }, []);

    return (
        <TemplateFrame
            mode={mode}
            toggleColorMode={toggleColorMode}
            user={user}
        >
            <ThemeProvider theme={DashboardTheme}>
                <CssBaseline enableColorScheme />
                <AppAppBar user={user} handleLogout={() => handleLogout(navigate)} />
                <Container
                    maxWidth="lg"
                    component="main"
                    sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
                >
                    <MainContent games={games} />
                    <Latest title="Popular Games" games={popularGames} />
                    <Latest title="New Releases" games={newReleases} />
                </Container>
                <Footer />
            </ThemeProvider>
        </TemplateFrame>
    );
}