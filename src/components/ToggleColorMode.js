import * as React from 'react';
import IconButton from '@mui/material/IconButton';

import ModeNightRoundedIcon from '@mui/icons-material/ModeNightRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import { useThemeContext } from './ThemeContext';

function ToggleColorMode(props) {
  const { mode, toggleColorMode } = useThemeContext();

  return (
    <IconButton
      onClick={toggleColorMode}
      size="small"
      color="primary"
      aria-label="Theme toggle button"
      {...props}
    >
      {mode === 'dark' ? (
        <WbSunnyRoundedIcon fontSize="small" />
      ) : (
        <ModeNightRoundedIcon fontSize="small" />
      )}
    </IconButton>
  );
}

export default ToggleColorMode;