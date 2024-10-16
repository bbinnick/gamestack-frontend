import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useNavigate } from 'react-router-dom';
import ToggleColorMode from '../components/TemplateColorMode';
import getSignUpTheme from '../theme/getSignUpTheme.js';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  backgroundImage: 'none',
  zIndex: theme.zIndex.drawer + 1,
  flex: '0 0 auto',
}));

function TemplateFrame({
  mode,
  toggleColorMode,
  children,
  user,
}) {
  const navigate = useNavigate();
  const handleBackToHome = () => {
    navigate('/');
  };
  const signUpTheme = createTheme(getSignUpTheme(mode));

  return (
    <ThemeProvider theme={signUpTheme}>
      <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <StyledAppBar>
          <Toolbar
            variant="dense"
            disableGutters
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              p: '8px 12px',
            }}
          >
            <Button
              variant="text"
              size="small"
              aria-label="Back to Dashboard"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={handleBackToHome}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Back to Dashboard
            </Button>
            <IconButton
              size="small"
              aria-label="Back to Dashboard"
              onClick={handleBackToHome}
              sx={{ display: { xs: 'auto', sm: 'none' } }}
            >
              <ArrowBackRoundedIcon />
            </IconButton>
            <Button
              variant="text"
              size="small"
              aria-label="Add a Game"
              onClick={() => navigate('/add-game')}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Add a Game
            </Button>
            {/* Currently does not adapt to dark/light mode */}
            {user && (
              <Box variant="text" aria-label="username" sx={{ display: { xs: 'none', sm: 'flex' }}}>
                Logged in as: {user.username}
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <ToggleColorMode
                data-screenshot="toggle-mode"
                mode={mode}
                toggleColorMode={toggleColorMode}
              />
            </Box>
          </Toolbar>
        </StyledAppBar>
        <Box sx={{ flex: '1 1', overflow: 'auto' }}>{children}</Box>
      </Box>
    </ThemeProvider >
  );
}

TemplateFrame.propTypes = {
  children: PropTypes.node,
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};

export default TemplateFrame;