import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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

export default function Latest({ title, games }) {
  const navigate = useNavigate();

  const handleCardClick = (igdbGameId) => {
    navigate(`/games/igdb/${igdbGameId}`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Grid2 container spacing={2}>
        {games.map((igdbGame) => (
          <Grid2 key={igdbGame.id} xs={12} sm={6} md={4} lg={3}>
            <StyledCard
              variant="outlined"
              onClick={() => handleCardClick(igdbGame.id)}
              >
              {igdbGame.cover && igdbGame.cover.url ? (
                <CardMedia
                  component="img"
                  alt={igdbGame.name}
                  image={igdbGame.cover.url}
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
                  {igdbGame.name}
                </Typography>
                <Typography gutterBottom variant="subtitle2" component="div">
                  Rating: {igdbGame.rating !== undefined ? igdbGame.rating.toFixed(2) : 'N/A'}
                </Typography>
              </StyledCardContent>
            </StyledCard>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}


Latest.propTypes = {
  title: PropTypes.string.isRequired,
  games: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      cover: PropTypes.shape({
        url: PropTypes.string,
      }),
      genre: PropTypes.string,
      platform: PropTypes.string,
    })
  ).isRequired,
};