import { useState } from 'react';
import axios from 'axios';

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

    //TODO: user is null here, need to connect user_id to game
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        axios.post('http://localhost:8080/games/add', game, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => console.log('Game added:', response.data))
            .catch(error => console.error('Error adding game:', error));
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
            </select>
            <button type="submit">Add Game</button>
        </form>
    );
};

export default AddGameForm;
