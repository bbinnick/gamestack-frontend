import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack, Container, Typography, Box, Grid2, Card, CardContent, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import TemplateFrame from '../components/TemplateFrame';
import { useThemeContext } from '../components/ThemeContext';

const AdminGameManagement = () => {
    const { mode, toggleColorMode } = useThemeContext();
    const [game, setGame] = useState({
        title: '',
        platform: '',
        genre: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [games, setGames] = useState([]);
    const [user, setUser] = useState(null);
    const [editingGame, setEditingGame] = useState(null);

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
        }
        fetchGames();
    }, []);

    const fetchGames = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found, please log in.');
            return;
        }

        try {
            const response = await axios.get('http://localhost:8080/games/all', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setGames(response.data);
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    };

    const handleChange = (e) => {
        setGame({ ...game, [e.target.name]: e.target.value || '' });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found, please log in.');
            return;
        }

        const formData = new FormData();
        formData.append('game', new Blob([JSON.stringify(game)], { type: 'application/json' }));
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const response = await axios.post('http://localhost:8080/games/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Game added:', response.data);
            fetchGames(); // Refresh the list of games
        } catch (error) {
            console.error('Error adding game:', error);
        }
    };

    const handleEditGame = (game) => {
        setEditingGame(game);
        setGame({
            title: game.title || '',
            platform: game.platform || '',
            genre: game.genre || ''
        });
    };

    const handleUpdateGame = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found, please log in.');
            return;
        }

        const formData = new FormData();
        formData.append('game', new Blob([JSON.stringify(game)], { type: 'application/json' }));
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const response = await axios.patch(`http://localhost:8080/games/${editingGame.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Game updated:', response.data);
            fetchGames(); // Refresh the list of games
            setEditingGame(null);
            setGame({
                title: '',
                platform: '',
                genre: ''
            });
            setImageFile(null); // Reset the image file
        } catch (error) {
            console.error('Error updating game:', error);
        }
    };

    const handleDeleteGame = async (gameId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found, please log in.');
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/games/${gameId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Game deleted:', gameId);
            fetchGames(); // Refresh the list of games
        } catch (error) {
            console.error('Error deleting game:', error);
        }
    };

    const handleRemoveFromBacklog = async (gameId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found, please log in.');
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/games/remove-from-backlog/${gameId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Game removed from backlog:', gameId);
            fetchGames();
        } catch (error) {
            console.error('Error removing game from backlog:', error);
        }
    };

    const columns = [
        {
            field: 'image',
            headerName: 'Game Image',
            width: 130,
            renderCell: (params) => {
                return params.row.imageUrl ? (
                    <img
                        src={`http://localhost:8080/uploads/${params.row.imageUrl}`}
                        alt={params.row.title}
                        onError={(e) => { e.target.style.display = 'none'; }}  // Hide if the image URL is broken
                        style={{ width: '100px', height: 'auto', borderRadius: '5px' }}
                    />
                ) : (
                    <Tooltip title="No image available">
                        <ImageNotSupportedIcon color="disabled" />
                    </Tooltip>
                );
            },
        },
        { field: 'title', headerName: 'Title', width: 200 },
        { field: 'genre', headerName: 'Genre', width: 150 },
        { field: 'platform', headerName: 'Platform', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box>
                    <Button
                        color="primary"
                        onClick={() => handleEditGame(params.row)}
                    >
                        Edit
                    </Button>
                    <Button
                        color="error"
                        onClick={() => handleDeleteGame(params.row.id)}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    const paginationModel = { page: 0, pageSize: 10 };

    return (
        <TemplateFrame
            mode={mode}
            toggleColorMode={toggleColorMode}
            user={user}
        >
            <Container>
                <Typography variant="h4" gutterBottom>
                    Admin Game Management
                </Typography>
                <form onSubmit={editingGame ? handleUpdateGame : handleSubmit} encType="multipart/form-data">
                    <Stack direction="column" spacing={2}>
                        <TextField
                            label="Game Title"
                            name="title"
                            value={game.title}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Platform"
                            name="platform"
                            value={game.platform}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Genre"
                            name="genre"
                            value={game.genre}
                            onChange={handleChange}
                            fullWidth
                        />
                        <label htmlFor="upload-button">
                            <input
                                id="upload-button"
                                type="file"
                                accept="image/jpeg, image/png, image/gif"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <Button variant="contained" component="span">
                                Choose File
                            </Button>
                            {imageFile && <span> {imageFile.name}</span>}
                        </label>
                        <Button type="submit" variant="contained">{editingGame ? 'Update Game' : 'Add Game'}</Button>
                    </Stack>
                </form>
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>
                        All Games
                    </Typography>
                    <Box sx={{ height: 500, width: '100%', mt: 4 }}>
                        <DataGrid
                            rows={games}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[10, 20, 50]}
                            getRowId={(row) => row.id}
                        />
                    </Box>
                </Box>
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>
                        Users and Their Backlogs
                    </Typography>
                    <Grid2 container spacing={4}>
                        {games.map(game => (
                            game.backlogUsers.length > 0 ? (
                                game.backlogUsers.map(user => (
                                    <Grid2 key={user.id} xs={12} sm={6} md={4}>
                                        <Card sx={{ maxWidth: 345 }}>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {user.username}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Email: {user.email}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Backlog:
                                                </Typography>
                                                <Typography key={game.id} variant="body2" color="text.secondary">
                                                    - {game.title}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid2>
                                ))
                            ) : (
                                <Grid2 key={game.id} xs={12}>
                                    <Typography variant="body2" color="text.secondary">
                                        No users have added this game to their backlog.
                                    </Typography>
                                </Grid2>
                            )
                        ))}
                    </Grid2>
                </Box>
            </Container>
        </TemplateFrame>
    );
};

export default AdminGameManagement;