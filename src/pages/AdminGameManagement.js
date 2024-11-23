import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Stack, Container, Typography,
    Box, Grid2, Card, CardContent, Tooltip,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import TemplateFrame from '../components/TemplateFrame';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../components/ThemeContext';
import authService from '../services/AuthService';

const AdminGameManagement = () => {
    const { mode, toggleColorMode } = useThemeContext();
    const [game, setGame] = useState({
        title: '',
        platforms: [],
        genres: []
    });
    const [imageFile, setImageFile] = useState(null);
    const [games, setGames] = useState([]);
    const [editingGame, setEditingGame] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState(null);
    const user = authService.getUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchGames();
        } else {
            navigate('/log-in');
        }
    }, [user, navigate]);

    const fetchGames = async () => {
        try {
            const response = await authService.getAxiosInstance().get('/games/all-with-users');
            setGames(response.data);
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGame(prevGame => ({
            ...prevGame,
            [name]: value
        }));
    };

    const handleArrayChange = (e, index, field) => {
        const { value } = e.target;
        setGame(prevGame => {
            const updatedArray = [...prevGame[field]];
            updatedArray[index] = value;
            return {
                ...prevGame,
                [field]: updatedArray
            };
        });
    };

    const handleAddItem = (field) => {
        setGame(prevGame => ({
            ...prevGame,
            [field]: [...prevGame[field], '']
        }));
    };

    const handleRemoveItem = (index, field) => {
        setGame(prevGame => {
            const updatedArray = [...prevGame[field]];
            updatedArray.splice(index, 1);
            return {
                ...prevGame,
                [field]: updatedArray
            };
        });
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
            platforms: game.platforms || [],
            genres: game.genres || []
        });
    };

    const handleDeleteGame = (gameId) => {
        setDialogAction({ type: 'delete', gameId });
        setDialogOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!user) {
            console.error('No user found, please log in.');
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
                const response = await authService.getAxiosInstance().post('/games/add', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('Game added:', response.data);
                fetchGames();
                setGame({
                    title: '',
                    platforms: [],
                    genres: []
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
                const response = await authService.getAxiosInstance().patch(`/games/${editingGame.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('Game updated:', response.data);
                fetchGames();
                setEditingGame(null);
                setGame({
                    title: '',
                    platforms: [],
                    genres: []
                });
                setImageFile(null);
            } catch (error) {
                console.error('Error updating game:', error);
            }
        } else if (dialogAction.type === 'delete') {
            try {
                await authService.getAxiosInstance().delete(`/games/${dialogAction.gameId}`);
                console.log('Game deleted:', dialogAction.gameId);
                fetchGames();
            } catch (error) {
                console.error('Error deleting game:', error);
            }
        }
        setDialogOpen(false);
    };

    const handleDetailNavigation = (gameId) => {
        navigate(`/games/local/${gameId}`);
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
        { field: 'genres', headerName: 'Genres', width: 150 },
        { field: 'platforms', headerName: 'Platforms', width: 150 },
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
                        <div>
                            <Typography variant="h6">Platforms</Typography>
                            {game.platforms.map((platform, index) => (
                                <div key={index}>
                                    <TextField
                                        value={platform}
                                        onChange={(e) => handleArrayChange(e, index, 'platforms')}
                                        fullWidth
                                    />
                                    <Button variant='contained' color='warning' onClick={() => handleRemoveItem(index, 'platforms')} sx={{ mt: 1, mb: 1 }}>Remove</Button>
                                </div>
                            ))}
                            <Button variant='contained' color='secondary' onClick={() => handleAddItem('platforms')}>Add Platform</Button>
                        </div>
                        <div>
                            <Typography variant="h6">Genres</Typography>
                            {game.genres.map((genre, index) => (
                                <div key={index}>
                                    <TextField
                                        value={genre}
                                        onChange={(e) => handleArrayChange(e, index, 'genres')}
                                        fullWidth
                                    />
                                    <Button variant='contained' color='warning' onClick={() => handleRemoveItem(index, 'genres')} sx={{ mt: 1, mb: 1 }}>Remove</Button>
                                </div>
                            ))}
                            <Button variant='contained' color='secondary' onClick={() => handleAddItem('genres')}>Add Genre</Button>
                        </div>
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