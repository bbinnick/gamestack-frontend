import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import { Box, Button, TextField, Typography, Stack, Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import TemplateFrame from '../components/TemplateFrame';
import { useUser } from '../contexts/UserContext';
import authService from '../services/AuthService';

const CardStyled = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const LogInContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  backgroundImage:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
  ...theme.applyStyles('dark', {
    backgroundImage:
      'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
  }),
}));

export default function LogIn() {
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await authService.getAxiosInstance().post('/users/login', { email, password });
      const { jwt: token } = response.data;
      authService.setToken(token);
      const user = authService.getUser();
      console.log('User logged in successfully:', user.username);
      setUser(authService.getUser()); // Update the user state
      navigate('/');
    } catch (error) {
      console.error('There was an error logging in the user:', error);
    }
  };

  return (
    <TemplateFrame>
      <CssBaseline enableColorScheme />
      <LogInContainer direction="column" justifyContent="space-between">
        <CardStyled variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            //noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              //width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                fullWidth
                autoFocus
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link
                  component="button"
                  type="button"
                  onClick={handleClickOpen}
                  variant="body2"
                  sx={{ alignSelf: 'baseline' }}
                >
                  Forgot your password?
                </Link>
              </Box>
              <TextField
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign in
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <span>
                <Link
                  component="button"
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                  onClick={() => navigate('/sign-up')}
                >
                  Sign Up
                </Link>
              </span>
            </Typography>
          </Box>
        </CardStyled>
      </LogInContainer>
    </TemplateFrame>
  );
}