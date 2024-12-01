import React, { useState } from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../contexts/ThemeContext.js';
import ToggleColorMode from './ToggleColorMode.js';
import getSignUpTheme from '../theme/getSignUpTheme.js';
import SearchAutocomplete from './SearchAutocomplete.js';
import { useUser } from '../contexts/UserContext.js';

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

function TemplateFrame({ children }) {
  const { mode } = useThemeContext();
  const { user, handleLogout } = useUser();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const signUpTheme = createTheme(getSignUpTheme(mode));
  const isMenuOpen = Boolean(menuAnchor);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };


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
              maxWidth: 'xl',
              width: '100%',
              p: '8px 12px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                size="small"
                aria-label="Home"
                onClick={handleBackToHome}
              >
                <HomeIcon />
              </IconButton>
              <IconButton
                size="small"
                aria-label="Menu"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <SearchAutocomplete />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user ? (
                <>
                  <Typography variant="body2" aria-label="username" sx={{ color: 'text.primary' }}>
                    Logged in as: {user.username}
                  </Typography>
                  <IconButton
                    size="small"
                    aria-label="Account"
                    onClick={handleMenuOpen}
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => navigate('/backlog')}>Backlog</MenuItem>
                    <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>Log out</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button color="primary" variant="text" size="small" onClick={() => navigate('/log-in')}>
                    Sign in
                  </Button>
                  <Button color="primary" variant="contained" size="small" onClick={() => navigate('/sign-up')}>
                    Sign up
                  </Button>
                </>
              )}
              <ToggleColorMode />
            </Box>
          </Toolbar>
        </StyledAppBar>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 250,
              top: '56px',
            },
          }}
        >
          <Box sx={{ width: 250 }}>
            <MenuItem onClick={() => navigate('/backlog')}>Backlog</MenuItem>
            {user && user.authorities === 'ROLE_ADMIN' && (
              <MenuItem onClick={() => navigate('/admin')}>Admin</MenuItem>
            )}
          </Box>
        </Drawer>
        <Box sx={{ flex: '1 1', overflow: 'auto' }}>{children}</Box>
      </Box>
    </ThemeProvider>
  );
}
export default TemplateFrame;