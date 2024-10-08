import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Paper, Container, Button } from '@mui/material';

const styles = {
    paper: {
        padding: '50px 20px',
        width: 600,
        margin: '20px auto',
    },
    h2: {
        color: 'blue',
    },
};

export default function User() {
    const [firstName, setFirstName] = useState('John');
    const [lastName, setLastName] = useState('Doe');
    const [email, setEmail] = useState('test@user.com');
    const [password, setPassword] = useState('password');
    const theme = useTheme();

    const handleClick = async (e) => {
        e.preventDefault();
        const user = { firstName, lastName, email, password };
        console.log(user);

        const authUsername = 'your-username';
        const authPassword = 'your-password';
        const credentials = btoa(`${authUsername}:${authPassword}`);

        fetch('http://localhost:8080/users/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${credentials}`
            },
            body: JSON.stringify(user)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            console.log('New user added:', data);
        }).catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

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
                    <TextField fullWidth focused label="First Name" color="primary" variant="outlined"
                        value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    />
                    <TextField fullWidth focused label="Last Name" color="primary" variant="outlined"
                        value={lastName} onChange={(e) => setLastName(e.target.value)}
                    />
                    <TextField fullWidth focused label="E-mail" color="secondary" variant="outlined"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField fullWidth focused label="Password" color="secondary" variant="outlined"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleClick}>Submit</Button>
                </Paper>
            </Container>
        </Box>
    );
}