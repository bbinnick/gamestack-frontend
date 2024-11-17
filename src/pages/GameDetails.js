import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CardMedia } from '@mui/material';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import TemplateFrame from '../components/TemplateFrame';
import { useThemeContext } from '../components/ThemeContext';
import { jwtDecode } from 'jwt-decode';

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
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(-1);


  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/games/${gameId}`);
        setGame(response.data);
      } catch (error) {
        console.error('Error fetching game details:', error);
      }
    };

    const fetchUserRating = async (userId) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/games/${gameId}/user-rating`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRating(response.data.rating || 0);
      } catch (error) {
        console.error('Error fetching user rating:', error);
      }
    };
    // refactor this into a helper class
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        fetchUserRating();
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
      }
    }

    fetchGameDetails();
  }, [gameId]);

  const handleAddToBacklog = async () => {
    if (!user) {
      navigate('/log-in');
      return;
    }

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

  const handleRatingChange = async (event, newValue) => {
    if (!user) {
      navigate('/log-in');
      return;
    }

    setRating(newValue);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8080/games/${gameId}/rate`, null, {
        params: { rating: newValue },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Rating submitted:', newValue);
    } catch (error) {
      console.error('Error submitting rating:', error);
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
          <Box sx={{ width: 200, display: 'flex', alignItems: 'center', mt: 2 }}>
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
          </Box>
          {/* <Typography variant="h6">Release Date: {game.releaseDate}</Typography> */}
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