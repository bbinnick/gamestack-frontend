import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Stack, Container, Typography,
    Box, Grid2, Card, CardContent, Tooltip,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import TemplateFrame from '../components/TemplateFrame';
import { useNavigate } from 'react-router-dom';
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
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState(null);
    const navigate = useNavigate();

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
            const response = await axios.get('http://localhost:8080/games/all-with-users', {
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
        setDialogAction('add');
        setDialogOpen(true);
    };

    const handleUpdateGame = async (e) => {
        e.preventDefault();
        setDialogAction('update');
        setDialogOpen(true);
    };

    const handleEditGame = (game) => {
        setEditingGame(game);
        setGame({
            title: game.title || '',
            platform: game.platform || '',
            genre: game.genre || ''
        });
    };

    const handleDeleteGame = (gameId) => {
        setDialogAction({ type: 'delete', gameId });
        setDialogOpen(true);
    };

    const handleConfirmAction = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found, please log in.');
            setDialogOpen(false);
            return;
        }

        if (dialogAction === 'add') {
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
                fetchGames();
                setGame({
                    title: '',
                    platform: '',
                    genre: ''
                });
                setImageFile(null);
            } catch (error) {
                console.error('Error adding game:', error);
            }
        } else if (dialogAction === 'update') {
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
                fetchGames();
                setEditingGame(null);
                setGame({
                    title: '',
                    platform: '',
                    genre: ''
                });
                setImageFile(null);
            } catch (error) {
                console.error('Error updating game:', error);
            }
        } else if (dialogAction.type === 'delete') {
            try {
                await axios.delete(`http://localhost:8080/games/${dialogAction.gameId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Game deleted:', dialogAction.gameId);
                fetchGames();
            } catch (error) {
                console.error('Error deleting game:', error);
            }
        }

        setDialogOpen(false);
    };

    const handleDetailNavigation = (gameId) => {
        navigate(`/games/${gameId}`);
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
                        onError={(e) => { e.target.style.display = 'none'; }}
                        style={{ width: '100px', height: 'auto', borderRadius: '5px' }}
                    />
                ) : (
                    <Tooltip title="No image available">
                        <ImageNotSupportedIcon color="disabled" />
                    </Tooltip>
                );
            },
        },
        {
            field: 'title',
            headerName: 'Title',
            width: 200,
            renderCell: (params) => (
                <Button
                    color="primary"
                    onClick={() => handleDetailNavigation(params.row.id)}
                >
                    {params.row.title}
                </Button>
            ),
        },
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
                        variant="contained"
                        onClick={() => handleEditGame(params.row)}
                        sx={{ mr: 1 }}
                    >
                        Edit
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => handleDeleteGame(params.row.id)}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    const paginationModel = { page: 0, pageSize: 5 };

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
                            pageSizeOptions={[5, 10, 20, { value: games.length, label: 'All' }]}
                            getRowId={(row) => row.id}
                        />
                    </Box>
                </Box>
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>
                        {/*Revise this to manage users instead*/}
                        Users and Their Backlogs
                    </Typography>
                    <Grid2 container spacing={4}>
                        {games.map(game => (
                            game.userGames.length > 0 ? (
                                game.userGames.map(user => (
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
                                                    Status: {user.status}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Added On: {user.addedOn}
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
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {dialogAction === 'add' ? 'Confirm Add' : dialogAction === 'update' ? 'Confirm Update' : 'Confirm Delete'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogAction === 'add'
                            ? 'Are you sure you want to add this game?'
                            : dialogAction === 'update'
                                ? 'Are you sure you want to update this game?'
                                : 'Are you sure you want to delete this game?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmAction} color="primary" variant="contained" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </TemplateFrame>
    );
};

export default AdminGameManagement;