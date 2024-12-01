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
    Button,
    Select,
    MenuItem,
    Grid2,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import TemplateFrame from '../components/TemplateFrame';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import authService from '../services/AuthService';

const BacklogPage = () => {
    const [games, setGames] = useState([]);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState(null);
    const { user } = useUser();
    const navigate = useNavigate();

    // Fetch user's game backlog
    useEffect(() => {
        const fetchBacklog = async () => {
            try {
                const response = await authService.getAxiosInstance().get('/games/backlog');
                const gamesData = response.data.map(game => {
                    const userGame = game.userGames.find(ug => ug.userId === user.user_id) || {};
                    const imageUrl = game.igdbGameId ? game.imageUrl : `http://localhost:8080/uploads/${game.imageUrl}`;
                    return { ...game, imageUrl, status: userGame.status, addedOn: userGame.addedOn, rating: userGame.rating || 0 };
                });
                setGames(gamesData);
            } catch (error) {
                console.error('Error fetching backlog:', error);
            }
        };

        if (user) {
            fetchBacklog();
        }
    }, [user]);

    // Remove game from backlog
    const handleDeleteGame = (gameId) => {
        setDialogAction({ type: 'delete', gameId });
        setDialogOpen(true);
    };

    const handleConfirmAction = async () => {
        if (dialogAction.type === 'delete') {
            try {
                await authService.getAxiosInstance().delete(`/games/remove-from-backlog/${dialogAction.gameId}`);
                console.log('Game removed from backlog:', dialogAction.gameId);
                setGames(prevGames => prevGames.filter(game => game.id !== dialogAction.gameId));
            } catch (error) {
                console.error('Error removing game from backlog:', error);
            }
        }

        setDialogOpen(false);
    };

    // Update game status
    const handleStatusChange = async (gameId, newStatus) => {
        // Find the game to get the old status
        const game = games.find(game => game.id === gameId);
        const oldStatus = game ? game.status : 'Unknown';

        try {
            await authService.getAxiosInstance().patch(`/games/${gameId}/status`, null, {
                params: { status: newStatus }
            });
            setGames(prevGames => prevGames.map(game => game.id === gameId ? { ...game, status: newStatus } : game));
            console.log(`Status updated for Game ID ${gameId} (${game.title}): ${oldStatus} -> ${newStatus}`);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDetailNavigation = (gameId) => {
        navigate(`/games/local/${gameId}`);
    };

    // Columns for DataGrid
    const columns = [
        {
            field: 'image',
            headerName: 'Game Image',
            flex: 1,
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
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params) => (
                <Select
                    value={params.row.status}
                    onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
                >
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Replay">Replay</MenuItem>
                    <MenuItem value="Wishlist">Wishlist</MenuItem>
                </Select>
            ),
        },
        {
            field: 'rating',
            headerName: 'Rating',
            flex: 1,
            renderCell: (params) => (
                <Rating
                    name={`rating-${params.row.id}`}
                    value={params.row.rating}
                    precision={0.5}
                    readOnly
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
            ),
        },
        { field: 'addedOn', headerName: 'Added On', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <Button
                    color="error"
                    variant="contained"
                    onClick={() => handleDeleteGame(params.row.id)}
                >
                    Remove
                </Button>
            ),
        },
    ];

    const paginationModel = { page: 0, pageSize: 10 };

    const toggleViewMode = () => {
        setViewMode(viewMode === 'table' ? 'cards' : 'table');
    };

    const getStatusColor = (status) => ({
        'Not Started': 'grey',
        'In Progress': 'blue',
        'Completed': 'green',
        'Replay': 'orange',
        'Wishlist': 'purple'
    }[status] || 'grey');

    return (
        <TemplateFrame>
            <Container maxWidth='xl' sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 5 }}>
                    <Typography variant="h4" component="h1">
                        My Game Backlog
                    </Typography>
                    <Tooltip title="Switch between Table and Card views">
                        <Switch checked={viewMode === 'cards'} onChange={toggleViewMode} />
                    </Tooltip>
                </Box>

                {viewMode === 'table' ? (
                    <Box sx={{ height: 'auto', mt: 4 }}>
                        <DataGrid
                            rows={games}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[10, 15, 20, { value: games.length, label: 'All' }]}
                            getRowId={(row) => row.id}
                            disableSelectionOnClick
                        />
                    </Box>
                ) : (
                    <Grid2 container spacing={4} sx={{ mt: 4 }}>
                        {games.map(game => (
                            <Grid2 key={game.id} xs={12} sm={6} md={4}>
                                <Card sx={{ maxWidth: 345, position: 'relative', cursor: 'pointer' }} onClick={() => handleDetailNavigation(game.id)}>
                                    {game.imageUrl ? (
                                        <CardMedia
                                            component="img"
                                            alt={game.title || game.name || 'Unknown Title'}
                                            image={game.imageUrl}
                                            sx={{
                                                width: '100%',
                                                height: 'auto',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : (
                                        <Box sx={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f0f0f0' }}>
                                            <ImageNotSupportedIcon color="disabled" />
                                        </Box>
                                    )}
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {game.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Added On: {game.addedOn}
                                        </Typography>
                                        <Rating
                                            name={`rating-${game.id}`}
                                            value={game.rating}
                                            precision={0.5}
                                            readOnly
                                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                        />
                                    </CardContent>
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 16,
                                        right: 16,
                                        bgcolor: getStatusColor(game.status),
                                        color: 'white',
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 1,
                                        fontWeight: 'bold'
                                    }}>
                                        {game.status}
                                    </Box>
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                )}
            </Container>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to remove this game from your backlog?
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

export default BacklogPage;
