import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const Login: React.FC = () => {
    const handleLogin = () => {
        window.location.href = '/auth/github';
    };

    return (
        <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            minHeight='100vh'
        >
            <Typography variant='h4' gutterBottom>
                Welcome to Ecosystem OAuth
            </Typography>
            <Button
                variant='contained'
                color='primary'
                onClick={handleLogin}
                size='large'
            >
                Login with GitHub
            </Button>
        </Box>
    );
};

export default Login;