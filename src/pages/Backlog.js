import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Tooltip,
    Switch,
    Grid2,
} from '@mui/material';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import TemplateFrame from '../components/TemplateFrame';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BacklogPage = () => {
    const [mode, setMode] = useState('light');
    const [games, setGames] = useState([]);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser ? decodedUser : null);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('token');
            }
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            axios.get('http://localhost:8080/games/backlog', config)
                .then(response => {
                    setGames(response.data);
                })
                .catch(error => {
                    console.error('Error fetching backlog:', error);
                });
        }
    }, []);

    // Columns for DataGrid
    const columns = [
        {
            field: 'image',
            headerName: 'Game Image',
            width: 130,
            renderCell: (params) => (
                params.row.image ? (
                    <img
                        src={params.row.image}
                        alt={params.row.title}
                        style={{ width: '100px', height: 'auto', borderRadius: '5px' }}
                    />
                ) : (
                    <Tooltip title="No image available">
                        <ImageNotSupportedIcon color="disabled" />
                    </Tooltip>
                )
            ),
        },
        { field: 'title', headerName: 'Title', width: 200 },
        { field: 'genre', headerName: 'Genre', width: 150 },
        { field: 'platform', headerName: 'Platform', width: 150 },
        { field: 'status', headerName: 'Status', width: 130 },
        { field: 'addedOn', headerName: 'Added On', width: 150 },
    ];

    // Toggle between table and card views
    const toggleViewMode = () => {
        setViewMode(viewMode === 'table' ? 'cards' : 'table');
    };

    const toggleColorMode = () => {
        const newMode = mode === 'dark' ? 'light' : 'dark';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
    };

    return (
        <TemplateFrame
            mode={mode}
            toggleColorMode={toggleColorMode}
            user={user}
        >
            <Container maxWidth="lg">
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 5 }}>
                    <Typography variant="h4" component="h1">
                        My Game Backlog
                    </Typography>
                    <Tooltip title="Switch between Table and Card views">
                        <Switch checked={viewMode === 'cards'} onChange={toggleViewMode} />
                    </Tooltip>
                </Box>

                {viewMode === 'table' ? (
                    <Box sx={{ height: 500, width: '100%', mt: 4 }}>
                        <DataGrid
                            rows={games}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5, 10]}
                            getRowId={(row) => row.id}
                        />
                    </Box>
                ) : (
                    <Grid2 container spacing={4} sx={{ mt: 4 }}>
                        {games.map((game) => (
                            <Grid2 item key={game.id} xs={12} sm={6} md={4}>
                                <Card sx={{ maxWidth: 345 }}>
                                    {game.image ? (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={game.image}
                                            alt={game.title}
                                        />
                                    ) : (
                                        <Box sx={{ height: 140, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f0f0f0' }}>
                                            <ImageNotSupportedIcon color="disabled" />
                                        </Box>
                                    )}
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {game.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Genre: {game.genre}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Platform: {game.platform}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Added On: {new Date(game.addedOn).toLocaleDateString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                )}
            </Container>
        </TemplateFrame>
    );
};

export default BacklogPage;
