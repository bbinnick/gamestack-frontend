import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppAppBar from '../components/AppAppBar';
import MainContent from '../components/MainContent';
import Latest from '../components/Latest';
import Footer from '../components/Footer';
import TemplateFrame from '../components/TemplateFrame';
import { useState, useEffect } from 'react';

import getBlogTheme from '../theme/getBlogTheme';

export default function Blog() {
    const [mode, setMode] = React.useState('light');
    const blogTheme = createTheme(getBlogTheme(mode));
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

    React.useEffect(() => {
        // Check if there is a preferred mode in localStorage
        const savedMode = localStorage.getItem('themeMode');
        if (savedMode) {
            setMode(savedMode);
        } else {
            // If no preference is found, it uses system preference
            const systemPrefersDark = window.matchMedia(
                '(prefers-color-scheme: dark)',
            ).matches;
            setMode(systemPrefersDark ? 'dark' : 'light');
        }
    }, []);

    const toggleColorMode = () => {
        const newMode = mode === 'dark' ? 'light' : 'dark';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
    };

    return (
        <TemplateFrame
            mode={mode}
            toggleColorMode={toggleColorMode}
        >
            <ThemeProvider theme={blogTheme}>
                <CssBaseline enableColorScheme />
                <AppAppBar />
                <Container
                    maxWidth="lg"
                    component="main"
                    sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
                >
                    {user ? (
                        <p>Logged in as: {user.username}</p>
                    ) : (
                        <p>No user logged in</p>
                    )}
                    <MainContent />
                    <Latest />
                </Container>
                <Footer />
            </ThemeProvider>
        </TemplateFrame>
    );
}