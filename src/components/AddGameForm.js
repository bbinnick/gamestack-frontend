import { useState } from 'react';
import { TextField, Button, Stack, MenuItem } from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AddGameForm = () => {
    const [game, setGame] = useState({
        title: '',
        platform: '',
        genre: '',
        status: ''
    });
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        setGame({ ...game, [e.target.name]: e.target.value });
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

        let userId;
        try {
            const decodedToken = jwtDecode(token);
            console.log('Decoded token:', decodedToken);
            userId = decodedToken.user_id;
        } catch (error) {
            console.error('Error decoding token:', error);
            return;
        }

        const formData = new FormData();
        formData.append('game', new Blob([JSON.stringify({ ...game, userId })], { type: 'application/json' }));
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
        } catch (error) {
            console.error('Error adding game:', error);
        }
    };
    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                <TextField
                    label="Status"
                    name="status"
                    select
                    value={game.status}
                    onChange={handleChange}
                    fullWidth
                >
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Replay">Replay</MenuItem>
                    <MenuItem value="Wishlist">Wishlist</MenuItem>
                </TextField>
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
                <Button type="submit" variant="contained">Add Game</Button>
            </Stack>
        </form>
    );
};


export default AddGameForm;
