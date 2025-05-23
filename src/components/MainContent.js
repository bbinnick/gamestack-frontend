import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { useNavigate } from 'react-router-dom';
import Grid2 from '@mui/material/Grid2';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
}));

const StyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 8,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 8,
  },
});

// Author component to display the author(s) of a review for games. Not implemented yet.
function Author({ authors }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
      }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
      >
        <AvatarGroup max={3}>
          {authors.map((author, index) => (
            <Avatar
              key={index} // Change to key={author.name || index} for more uniqueness
              alt={author.name}
              src={author.avatar}
              sx={{ width: 24, height: 24 }}
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption">
          {authors.map((author) => author.name).join(', ')}
        </Typography>
      </Box>
      <Typography variant="caption">July 14, 2021</Typography>
    </Box>
  );
}

Author.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string, // could make required when adding reviews
    }),
  ).isRequired,
};
// end of Author component

MainContent.propTypes = {
  games: PropTypes.array.isRequired,
};

export default function MainContent({ games }) {
  const [focusedCardIndex, setFocusedCardIndex] = useState(null);
  const navigate = useNavigate();

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handleFilterClick = () => {
    console.info('You clicked the filter chip.');
  };

  const handleCardClick = (gameId) => {
    navigate(`/games/local/${gameId}`);
  };

  // Filter out IGDB games
  const filteredGames = games.filter(game => !game.igdbGameId);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div>
        <Typography variant="h1" gutterBottom>
          Explore our selection of games
        </Typography>
      </div>
      {/* Filter chips. Not implemented yet */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          width: '100%',
          justifyContent: 'space-between',
          alignItems: { xs: 'start', md: 'center' },
          gap: 4,
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            flexDirection: 'row',
            gap: 3,
            overflow: 'auto',
          }}
        >
          <Chip onClick={handleFilterClick} size="medium" label="All categories" />
          <Chip
            onClick={handleFilterClick}
            size="medium"
            label="Popular"
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
          />
          <Chip
            onClick={handleFilterClick}
            size="medium"
            label="New Releases"
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
          />
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'row',
            gap: 1,
            width: { xs: '100%', md: 'fit-content' },
            overflow: 'auto',
          }}
        >
        </Box>
      </Box>
      <Box>
        <Typography variant="h4" gutterBottom>
          Featured Games
        </Typography>
        <Grid2 container spacing={2}>
          {filteredGames.map((game, index) => (
            <Grid2 key={game.id} xs={12} sm={6} md={4} lg={2.4}>
              <StyledCard
                variant="outlined"
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                tabIndex={0}
                className={focusedCardIndex === index ? 'Mui-focused' : ''}
                onClick={() => handleCardClick(game.id)}
              >
                {game.imageUrl ? (
                  <CardMedia
                    component="img"
                    alt={game.title}
                    image={game.imageUrl}
                    onError={(e) => { e.target.style.display = 'none'; }}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                ) : (
                  <Box sx={{ width: '100%', height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f0f0f0' }}>
                    <ImageNotSupportedIcon color="disabled" />
                  </Box>
                )}
                <StyledCardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {game.title}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2" component="div">
                    Rating: {game.rating !== undefined ? game.rating.toFixed(2) : 'N/A'}
                  </Typography>
                </StyledCardContent>
                {/* <Author authors={cardData[5].authors} /> */}
              </StyledCard>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Box>
  );
}