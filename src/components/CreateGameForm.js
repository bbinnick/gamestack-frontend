import React from 'react';
import {
    TextField, Button, Stack, Typography
} from '@mui/material';
import PropTypes from 'prop-types';

const GameForm = ({ game, setGame, imageFile, setImageFile, handleSubmit, handleUpdateGame, editingGame }) => {
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

    return (
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
                    <Button variant="contained" color='secondary' component="span">
                        Choose File
                    </Button>
                    {imageFile && <span> {imageFile.name}</span>}
                </label>
                <Button type="submit" variant="contained" color='primary' sx={{ alignSelf: 'flex-start' }}>
                    {editingGame ? 'Update Game' : 'Add Game'}
                </Button>
            </Stack>
        </form>
    );
};

GameForm.propTypes = {
    game: PropTypes.object.isRequired,
    setGame: PropTypes.func.isRequired,
    imageFile: PropTypes.object,
    setImageFile: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleUpdateGame: PropTypes.func.isRequired,
    editingGame: PropTypes.object
};

export default GameForm;