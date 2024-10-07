import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';

export default function User() {
    const [email, setEmail] = useState('test@user.com');
    const [password, setPassword] = useState('password');
    const theme = useTheme();

    return (
        <Box
            component="form"
            sx={{ '& > *': { m: theme.spacing(1) }, }}
            noValidate
            autoComplete="off"
        >
            <Container>
                <Paper elevation={3} style={styles.paper}>
                    <h2 style={styles.h2}>Sign In</h2>
                    <form noValidate autoComplete="off">
                        <TextField fullWidth focused label="E-mail" color="secondary" variant="outlined"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField fullWidth focused label="Password" color="success" variant="outlined"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                    </form>
                </Paper>
            </Container>
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        padding: '50px 20px',
        width: 600,
        margin: '20px auto',
    },
    h2: {
        color: 'blue',
    },
});