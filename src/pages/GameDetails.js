import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CardMedia } from '@mui/material';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TemplateFrame from '../components/TemplateFrame';
import { useThemeContext } from '../components/ThemeContext';
import authService from '../services/AuthService';

const labels = {
  0.5: 'Boring',
  1: 'Boring+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

const GameDetails = () => {
  const { mode, toggleColorMode } = useThemeContext();
  const { gameId, igdbGameId } = useParams();
  const [game, setGame] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(-1);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const user = authService.getUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        let response;
        if (igdbGameId) {
          response = await authService.getAxiosInstance().get(`/igdb/games/details/${igdbGameId}`);
        } else {
          response = await authService.getAxiosInstance().get(`/games/${gameId}`);
          if (response.data.igdbGameId) {
            // Redirect to IGDB endpoint if the game is an IGDB game
            navigate(`/games/igdb/${response.data.igdbGameId}`);
            return;
          }
        }
        setGame(response.data);
      } catch (error) {
        console.error('Error fetching game details:', error);
      }
    };

    const fetchUserRating = async () => {
      try {
        const id = igdbGameId || gameId;
        const response = await authService.getAxiosInstance().get(`/games/${id}/user-rating`);
        setRating(response.data.rating || 0);
      } catch (error) {
        console.error('Error fetching user rating:', error);
      }
    };

    if (user) {
      fetchUserRating();
    }

    fetchGameDetails();
  }, [gameId, igdbGameId, user, navigate]);

  const handleAddToBacklog = async () => {
    if (!user) {
      navigate('/log-in');
      return;
    }

    try {
      let response;
      if (igdbGameId) {
        response = await authService.getAxiosInstance().post('/games/add-igdb-game', game);
      } else {
        response = await authService.getAxiosInstance().post(`/games/add-to-backlog/${gameId}`);
      }

      if (response.status === 200) {
        console.log('Game added to backlog:', gameId || igdbGameId);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setAlertMessage('Game is already in your backlog');
        setAlertOpen(true);
      } else {
        console.error('Error adding game to backlog:', error);
      }
    }
  };

  const handleRatingChange = async (event, newValue) => {
    if (!user) {
      navigate('/log-in');
      return;
    }

    setRating(newValue);

    try {
      if (igdbGameId) {
        const response = await authService.getAxiosInstance().post('/games/add-igdb-game', game);
        const addedGame = response.data;
        await authService.getAxiosInstance().post(`/games/${addedGame.id}/rate`, null, {
          params: { rating: newValue }
        });
        console.log('IGDB game rated:', addedGame.id);
      } else {
        await authService.getAxiosInstance().post(`/games/${gameId}/rate`, null, {
          params: { rating: newValue }
        });
        console.log('Rating submitted:', newValue);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  if (!game) {
    return <div>Loading...</div>;
  }

  const platforms = game.platforms ? game.platforms.join(', ') : 'Unknown Platform';
  const genres = game.genres ? game.genres.join(', ') : 'Unknown Genre';
  const igdbRating = game.rating ? game.rating.toFixed(2) : 'N/A';
  const imageUrl = game.imageUrl ? `http://localhost:8080/uploads/${game.imageUrl}` : (game.coverUrl ? `https://images.igdb.com/igdb/image/upload/t_720p/${game.coverUrl}.jpg` : 'https://via.placeholder.com/800x450');

  return (
    <TemplateFrame
      mode={mode}
      toggleColorMode={toggleColorMode}
      user={user}
    >
      <Container>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CardMedia
            component="img"
            alt={game.title || game.name || 'Unknown Title'}
            image={imageUrl}
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: 700,
              objectFit: 'contain',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            {game.title || game.name || 'Unknown Title'}
          </Typography>
          <Typography variant="h6">Platforms: {platforms}</Typography>
          <Typography variant="h6">Genres: {genres}</Typography>
          <Typography variant="h6">IGDB Rating: {igdbRating}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {game.summary || 'No description available.'}
          </Typography>
          <Rating
            name="hover-feedback"
            value={rating}
            precision={0.5}
            getLabelText={getLabelText}
            onChange={handleRatingChange}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          {rating !== null && (
            <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : rating]}</Box>
          )}
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAddToBacklog}>
            Add to Backlog
          </Button>
        </Box>
        <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => setAlertOpen(false)}>
          <Alert onClose={() => setAlertOpen(false)} severity="warning" sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </Container>
    </TemplateFrame>
  );
};

export default GameDetails;