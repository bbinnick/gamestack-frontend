import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider, CssBaseline, Container } from '@mui/material';
import MainContent from '../components/MainContent';
import Latest from '../components/Latest';
import Footer from '../components/Footer';
import TemplateFrame from '../components/TemplateFrame';
import getDashboardTheme from '../theme/getDashboardTheme';
import { useThemeContext } from '../contexts/ThemeContext';
import authService from '../services/AuthService';

export default function Dashboard() {
    const { mode } = useThemeContext();
    const DashboardTheme = createTheme(getDashboardTheme(mode));
    const [games, setGames] = useState([]);
    const [popularGames, setPopularGames] = useState([]);
    const [newReleases, setNewReleases] = useState([]);

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
                const response = await authService.getAxiosInstance().get('/igdb/games/popular', {
                    params: { limit: 10 }
                });
                const popularGamesData = response.data.map(igdbGame => {
                    const imageUrl = igdbGame.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${igdbGame.cover.image_id}.jpg` : null;
                    return { ...igdbGame, cover: { ...igdbGame.cover, url: imageUrl } };
                });
                setPopularGames(popularGamesData);
            } catch (error) {
                console.error('Error fetching popular games:', error);
            }
        };

        const fetchNewReleases = async () => {
            try {
                const response = await authService.getAxiosInstance().get('/igdb/games/new-releases', {
                    params: { limit: 10 }
                });
                const newReleasesData = response.data.map(igdbGame => {
                    const imageUrl = igdbGame.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${igdbGame.cover.image_id}.jpg` : null;
                    return { ...igdbGame, cover: { ...igdbGame.cover, url: imageUrl } };
                });
                setNewReleases(newReleasesData);
            } catch (error) {
                console.error('Error fetching new releases:', error);
            }
        };

        fetchGames();
        fetchPopularGames();
        fetchNewReleases();
    }, []);

    return (
        <TemplateFrame>
            <ThemeProvider theme={DashboardTheme}>
                <CssBaseline enableColorScheme />
                <Container maxWidth='xl' component="main" sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}>
                    <MainContent games={games} />
                    <Latest title="Popular Games" games={popularGames} />
                    <Latest title="New Releases" games={newReleases} />
                </Container>
                <Footer />
            </ThemeProvider>
        </TemplateFrame>
    );
}