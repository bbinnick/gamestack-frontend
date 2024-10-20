import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AddGameForm = () => {
    const [game, setGame] = useState({
        title: '',
        platform: '',
        genre: '',
        status: ''
    });

    const handleChange = (e) => {
        setGame({ ...game, [e.target.name]: e.target.value });
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

        const gameWithUser = { ...game, userId };
        try {
            const response = await axios.post('http://localhost:8080/games/add', gameWithUser, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Game added:', response.data);
        } catch (error) {
            console.error('Error adding game:', error);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="title"
                value={game.title}
                onChange={handleChange}
                placeholder="Game Title"
                required
            />
            <input
                type="text"
                name="platform"
                value={game.platform}
                onChange={handleChange}
                placeholder="Platform"
                required
            />
            <input
                type="text"
                name="genre"
                value={game.genre}
                onChange={handleChange}
                placeholder="Genre"
                required
            />
            <select name="status" value={game.status} onChange={handleChange} required>
                <option value="" disabled>Select Status</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Replay">Replay</option>
                <option value="Wishlist">Wishlist</option>
            </select>
            <button type="submit">Add Game</button>
        </form>
    );
};

export default AddGameForm;
