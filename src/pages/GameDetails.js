import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CardMedia } from '@mui/material';
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';
import StarIcon from '@mui/icons-material/Star';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Gauge } from '@mui/x-charts/Gauge';
import RatingReviewModal from '../components/RatingReviewModal';
import TemplateFrame from '../components/TemplateFrame';
import { useUser } from '../contexts/UserContext';
import authService from '../services/AuthService';

const GameDetails = () => {
  const { gameId, igdbGameId } = useParams();
  const [game, setGame] = useState(null);
  const [rating, setRating] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('warning');
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const { user } = useUser();
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

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

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
        showAlert('Game added to your backlog successfully', 'success');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        showAlert('Game is already in your backlog', 'warning');
      } else {
        console.error('Error adding game to backlog:', error);
      }
    }
  };

  const handleRatingReviewSubmit = async (rating, review) => {
    if (!user) {
      navigate('/log-in');
      return;
    }

    setRating(rating);

    try {
      let gameIdToUse = gameId;

      if (igdbGameId) {
        const response = await authService.getAxiosInstance().get(`/games/${igdbGameId}/user-rating`);
        gameIdToUse = response.data.gameId || (await authService.getAxiosInstance().post('/games/add-igdb-game', game)).data.id;
      }

      await authService.getAxiosInstance().post(`/games/${gameIdToUse}/rate-and-review`, null, {
        params: { rating, review }
      });
      showAlert('Rating and review submitted successfully', 'success');
    } catch (error) {
      console.error('Error submitting rating and review:', error);
      showAlert('Error submitting rating and review', 'error');
    }
  };

  if (!game) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const platforms = game.platforms ? game.platforms.join(', ') : 'Unknown Platform';
  const genres = game.genres ? game.genres.join(', ') : 'Unknown Genre';
  const igdbRating = game.rating ? parseFloat(game.rating.toFixed(2)) : 0;
  const imageUrl = game.imageUrl ? `http://localhost:8080/uploads/${game.imageUrl}` : (game.coverUrl ? `https://images.igdb.com/igdb/image/upload/t_720p/${game.coverUrl}.jpg` : 'https://via.placeholder.com/800x450');

  return (
    <TemplateFrame>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={{ mt: 8 }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          sx={{
            width: '100%',
            bgcolor: {
              success: 'darkgreen',
              error: 'darkred',
              warning: 'darkorange'
            }[alertSeverity] || 'inherit'
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <Container maxWidth='xl'>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ textDecoration: 'underline' }}>
                {game.title || game.name || 'Unknown Title'}
              </Typography>
              <Typography variant="subtitle1"><strong>Platforms:</strong> {platforms}</Typography>
              <Typography variant="subtitle1"><strong>Genres:</strong> {genres}</Typography>
              <Typography variant="subtitle1" sx={{ mt: 4 }}>
                {game.summary || 'No description available.'}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleAddToBacklog}>
                  Add to Backlog
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>IGDB Rating</Typography>
              <Gauge value={igdbRating} max={100} label="IGDB Rating" sx={{ width: '100%', maxWidth: 200, height: 100, textAlign: 'center', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>User Ratings</Typography>
              <Rating
                name="hover-feedback"
                value={rating}
                precision={0.5}
                readOnly
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
              <Button variant="contained" color="primary" onClick={() => setRatingModalOpen(true)} sx={{ mt: 2 }}>
                Rate and Review
              </Button>
            </Box>
          </Box>
        </Box>
      </Container >
      <RatingReviewModal
        open={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        onSubmit={handleRatingReviewSubmit}
        initialRating={rating}
        initialReview={game.review || ''}
        message="Rating this game will add it to your backlog if it isn't already there."
      />
    </TemplateFrame >
  );
};

export default GameDetails;