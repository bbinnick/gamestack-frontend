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
    const [editingGame, setEditingGame] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState(null);
    const [selectedGameIds, setSelectedGameIds] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
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
        } else if (dialogAction === 'deleteSelectedGames') {
            try {
                await Promise.all(selectedGameIds.map(gameId => authService.getAxiosInstance().delete(`/games/${gameId}`)));
                console.log('Selected games deleted:', selectedGameIds);
                fetchGames();
                setSelectedGameIds([]);
            } catch (error) {
                console.error('Error deleting selected games:', error);
            }
        } else if (dialogAction === 'deleteSelectedUsers') {
            try {
                await Promise.all(selectedUserIds.map(userId => authService.getAxiosInstance().delete(`/users/${userId}`)));
                console.log('Selected users deleted:', selectedUserIds);
                setUsers(prevUsers => prevUsers.filter(user => !selectedUserIds.includes(user.id)));
                setSelectedUserIds([]);
            } catch (error) {
                console.error('Error deleting selected users:', error);
            }
        }
        setDialogOpen(false);
    };

    const handleDeleteSelectedGames = () => {
        setDialogAction('deleteSelectedGames');
        setDialogOpen(true);
    };

    const handleDeleteSelectedUsers = () => {
        setDialogAction('deleteSelectedUsers');
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
            flex: 1,
            renderCell: (params) => (
                <Button
                    color="primary"
                    onClick={() => handleDetailNavigation(params.row.id)}
                >
                    {params.row.title}
                </Button>
            ),
        },
        { field: 'genres', headerName: 'Genres', flex: 1 },
        { field: 'platforms', headerName: 'Platforms', flex: 1 },
        {
            field: 'actions',
            headerName: '',
            flex: 1,
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
                </Box>
            ),
        },
    ];

    const userColumns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'username', headerName: 'Username', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'role', headerName: 'Role', flex: 1 },
        { field: 'actions', headerName: '', flex: 1, },
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={handleDeleteSelectedGames}
                            disabled={selectedGameIds.length === 0}
                        >
                            Delete Selected Games
                        </Button>
                    </Box>
                    <Box sx={{ height: 'auto', width: '100%', mt: 4 }}>
                        <DataGrid
                            rows={games}
                            columns={gameColumns}
                            checkboxSelection
                            onRowSelectionModelChange={(newSelection) => {
                                setSelectedGameIds(newSelection);
                            }}
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={handleDeleteSelectedUsers}
                            disabled={selectedUserIds.length === 0}
                        >
                            Delete Selected Users
                        </Button>
                    </Box>
                    <Box sx={{ height: 'auto', width: '100%', mt: 4 }}>
                        <DataGrid
                            rows={users}
                            columns={userColumns}
                            checkboxSelection
                            onRowSelectionModelChange={(newSelection) => {
                                setSelectedUserIds(newSelection);
                            }}
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
                                : dialogAction === 'deleteSelectedGames'
                                    ? 'Are you sure you want to delete the selected games?'
                                    : dialogAction === 'deleteSelectedUsers'
                                        ? 'Are you sure you want to delete the selected users?'
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