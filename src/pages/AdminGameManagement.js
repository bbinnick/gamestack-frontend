import React, { useState, useEffect } from 'react';
import {
    Button, Container, Typography, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import TemplateFrame from '../components/TemplateFrame';
import { useNavigate } from 'react-router-dom';
import authService from '../services/AuthService';
import GameForm from '../components/CreateGameForm';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import Tooltip from '@mui/material/Tooltip';
import { useUser } from '../contexts/UserContext';

const AdminGameManagement = () => {
    const [game, setGame] = useState({
        title: '',
        platforms: [],
        genres: []
    });
    const [imageFile, setImageFile] = useState(null);
    const [games, setGames] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [editingGame, setEditingGame] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState(null);
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const response = await authService.getAxiosInstance().get('/users/all');
                const usersData = response.data.filter(u => u.id !== user.user_id);
                //response.data.filter(u => u.role !== 'ADMIN'); // Filter out the admin user
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        if (user) {
            fetchGames();
            fetchUsers();
        } else {
            navigate('/log-in');
        }
    }, [user, navigate]);

    const fetchGames = async () => {
        try {
            const response = await authService.getAxiosInstance().get('/games/all-with-users');
            const gamesData = response.data.map(game => ({
                ...game,
                imageUrl: game.igdbGameId ? game.imageUrl : `http://localhost:8080/uploads/${game.imageUrl}`
            }));
            setGames(gamesData);
        } catch (error) {
            console.error('Error fetching games:', error);
        }
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
                const response = await authService.getAxiosInstance().post('/games/create', formData, {
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
        } else if (dialogAction === 'deleteUser') {
            try {
                await authService.getAxiosInstance().delete(`/users/${selectedUserId}`);
                console.log('User deleted:', selectedUserId);
                setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUserId));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
        setDialogOpen(false);
    };

    const handleDeleteGame = (gameId) => {
        setDialogAction({ type: 'delete', gameId });
        setDialogOpen(true);
    };

    const handleDeleteUser = (userId) => {
        setSelectedUserId(userId);
        setDialogAction('deleteUser');
        setDialogOpen(true);
    };

    const handleDetailNavigation = (gameId) => {
        navigate(`/games/local/${gameId}`);
    };

    const gameColumns = [
        {
            field: 'imageUrl',
            headerName: '',
            width: 130,
            renderCell: (params) => {
                return params.row.imageUrl ? (
                    <img
                        src={params.row.imageUrl}
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
            headerName: '',
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

    const userColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'username', headerName: 'Username', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'role', headerName: 'Role', width: 150 },
        {
            field: 'actions',
            headerName: '',
            width: 150,
            renderCell: (params) => (
                <Button
                    color="error"
                    variant="contained"
                    onClick={() => handleDeleteUser(params.row.id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    const paginationModel = { page: 0, pageSize: 10 };

    return (
        <TemplateFrame>
            <Container maxWidth='xl' sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" gutterBottom>
                    Admin Game Management
                </Typography>
                <GameForm
                    game={game}
                    setGame={setGame}
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    handleSubmit={handleSubmit}
                    handleUpdateGame={handleUpdateGame}
                    editingGame={editingGame}
                />
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>
                        All Games
                    </Typography>
                    <Box sx={{ height: 500, width: '100%', mt: 4 }}>
                        <DataGrid
                            rows={games}
                            columns={gameColumns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[10, 15, 20, { value: games.length, label: 'All' }]}
                            getRowId={(row) => row.id}
                        />
                    </Box>
                </Box>
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>
                        All Users
                    </Typography>
                    <Box sx={{ height: 500, width: '100%', mt: 4 }}>
                        <DataGrid
                            rows={users}
                            columns={userColumns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[10, 15, 20, { value: users.length, label: 'All' }]}
                            getRowId={(row) => row.id}
                        />
                    </Box>
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