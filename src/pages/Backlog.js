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
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../components/ThemeContext';

const BacklogPage = () => {
    const { mode, toggleColorMode } = useThemeContext();
    const [games, setGames] = useState([]);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
    const [user, setUser] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState(null);
    const navigate = useNavigate();

    // Fetch user's game backlog
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser ? decodedUser : null);

                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                axios.get('http://localhost:8080/games/backlog', config)
                    .then(response => {
                        const gamesData = response.data.map(game => {
                            const userGame = game.userGames.find(ug => ug.userId === decodedUser.user_id) || {};
                            const imageUrl = game.imageUrl
                                ? `http://localhost:8080/uploads/${game.imageUrl}`
                                : null;
                            return { ...game, imageUrl, status: userGame.status, addedOn: userGame.addedOn, rating: userGame.rating || 0 };
                        });
                        setGames(gamesData);
                    })
                    .catch(error => {
                        console.error('Error fetching backlog:', error);
                    });
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    // Remove game from backlog
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

        if (dialogAction.type === 'delete') {
            const config = { headers: { Authorization: `Bearer ${token}` } };

            try {
                await axios.delete(`http://localhost:8080/games/remove-from-backlog/${dialogAction.gameId}`, config);
                console.log('Game removed from backlog:', dialogAction.gameId);
                setGames(prevGames => prevGames.filter(game => game.id !== dialogAction.gameId));
            } catch (error) {
                console.error('Error removing game from backlog:', error);
            }
        }

        setDialogOpen(false);
    };

    // Update game status
    const handleStatusChange = (gameId, newStatus) => {
        const token = localStorage.getItem('token');
        const config = {
            params: { status: newStatus },
            headers: { Authorization: `Bearer ${token}` }
        };

        // Find the game to get the old status
        const game = games.find(game => game.id === gameId);
        const oldStatus = game ? game.status : 'Unknown';

        axios.patch(`http://localhost:8080/games/${gameId}/status`, { status: newStatus }, config)
            .then(() => {
                console.log(`Status updated for Game ID ${gameId} (${game.title}): ${oldStatus} -> ${newStatus}`);
                setGames(prevGames => prevGames.map(game =>
                    game.id === gameId ? { ...game, status: newStatus } : game
                ));
            })
            .catch(error => console.error('Error updating status:', error));
    };

    const handleDetailNavigation = (gameId) => {
        navigate(`/games/${gameId}`);
    };

    // Columns for DataGrid
    const columns = [
        {
            field: 'image',
            headerName: 'Game Image',
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
        { field: 'genre', headerName: 'Genre', width: 150 },
        { field: 'platform', headerName: 'Platform', width: 150 },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
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
            width: 150,
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
        { field: 'addedOn', headerName: 'Added On', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
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

    const toggleViewMode = () => {
        setViewMode(viewMode === 'table' ? 'cards' : 'table');
    };

    const paginationModel = { page: 0, pageSize: 5 };

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
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[5, 10, 20, { value: games.length, label: 'All' }]}
                            getRowId={(row) => row.id}
                        />
                    </Box>
                ) : (
                    <Grid2 container spacing={4} sx={{ mt: 4 }}>
                        {games.map(game => (
                            <Grid2 key={game.id} xs={12} sm={6} md={4}>
                                <Card sx={{ maxWidth: 345 }} onClick={() => handleDetailNavigation(game.id)}>
                                    {game.imageUrl ? (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={game.imageUrl}
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
                                            Status: {game.status}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
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
