import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FacebookIcon from '@mui/icons-material/GitHub';

function Copyright() {
    return (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            {'Copyright © '}
            &nbsp;
            {new Date().getFullYear()}
        </Typography>
    );
}

export default function Footer() {
    return (
        <React.Fragment>
            <Divider />
            <Container
                maxWidth={false}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: { xs: 4, sm: 8 },
                    py: { xs: 4, sm: 6 },
                    textAlign: { sm: 'center', md: 'left' },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        pt: { xs: 2, sm: 4 },
                        width: '100%',
                    }}
                >
                    <div>
                        <Link color="text.secondary" variant="body2" href="#">
                            Privacy Policy
                        </Link>
                        <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>
                            &nbsp;•&nbsp;
                        </Typography>
                        <Link color="text.secondary" variant="body2" href="#">
                            Terms of Service
                        </Link>
                        <Copyright />
                    </div>
                    <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        sx={{ justifyContent: 'left', color: 'text.secondary' }}
                    >
                        <IconButton
                            color="inherit"
                            size="small"
                            href="https://github.com/mui"
                            aria-label="GitHub"
                            sx={{ alignSelf: 'center' }}
                        >
                            <FacebookIcon />
                        </IconButton>
                    </Stack>
                </Box>
            </Container>
        </React.Fragment>
    );
}