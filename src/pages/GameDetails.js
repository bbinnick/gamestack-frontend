import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Button, CardMedia } from '@mui/material';
import axios from 'axios';
import TemplateFrame from '../components/TemplateFrame';
import { useThemeContext } from '../components/ThemeContext';

const GameDetails = () => {
  const { mode, toggleColorMode } = useThemeContext();
  const { gameId } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/games/${gameId}`);
        setGame(response.data);
      } catch (error) {
        console.error('Error fetching game details:', error);
      }
    };

    fetchGameDetails();
  }, [gameId]);

  const handleAddToBacklog = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in.');
      return;
    }

    try {
      await axios.post(`http://localhost:8080/games/add-to-backlog/${gameId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Game added to backlog:', gameId);
    } catch (error) {
      console.error('Error adding game to backlog:', error);
    }
  };

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <TemplateFrame mode={mode} toggleColorMode={toggleColorMode}>
      <Container>
        <Typography variant="h4" gutterBottom>
          {game.title}
        </Typography>
        <CardMedia
          component="img"
          alt={game.title}
          image={game.imageUrl ? `http://localhost:8080/uploads/${game.imageUrl}` : 'https://via.placeholder.com/800x450'}
          sx={{
            width: '100%',
            height: 400,
            objectFit: 'cover',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        />
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Platform: {game.platform}</Typography>
          <Typography variant="h6">Genre: {game.genre}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {game.description}
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAddToBacklog}>
            Add to Backlog
          </Button>
        </Box>
      </Container>
    </TemplateFrame>
  );
};

export default GameDetails;