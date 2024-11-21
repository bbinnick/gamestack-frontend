import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

const TitleTypography = styled(Typography)(({ theme }) => ({
  position: 'relative',
  textDecoration: 'none',
  '&:hover': { cursor: 'pointer' },
  '& .arrow': {
    visibility: 'hidden',
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  '&:hover .arrow': {
    visibility: 'visible',
    opacity: 0.7,
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '3px',
    borderRadius: '8px',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 0,
    height: '1px',
    bottom: 0,
    left: 0,
    backgroundColor: theme.palette.text.primary,
    opacity: 0.3,
    transition: 'width 0.3s ease, opacity 0.3s ease',
  },
  '&:hover::before': {
    width: '100%',
  },
}));

export default function Latest({ title, games }) {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Grid2 container spacing={2}>
        {games.map((game) => (
          <Grid2 key={game.id} xs={12} sm={6} md={4} lg={3}>
            <Box>
              {game.cover && game.cover.url ? (
                <img src={game.cover.url} alt={game.name} style={{ width: '100%' }} />
              ) : (
                <Box sx={{ width: '100%', height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f0f0f0' }}>
                  {/* replace with NoImage component from MUI */}
                  <Typography variant="body2" color="text.secondary">No Image Available</Typography>
                </Box>
              )}
              <TitleTypography variant="h6">
                {game.name}
                <NavigateNextRoundedIcon className="arrow" sx={{ fontSize: '1rem' }} />
              </TitleTypography>
            </Box>
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
    })
  ).isRequired,
};