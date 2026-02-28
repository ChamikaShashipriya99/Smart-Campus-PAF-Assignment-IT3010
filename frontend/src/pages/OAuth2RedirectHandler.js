import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Component to handle the redirect from OAuth2 login.
 * It extracts the token and user info from the URL, saves them, and redirects to dashboard.
 */
const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const username = params.get('username');
        const role = params.get('role');
        const name = params.get('name');
        const email = params.get('email');

        if (token) {
            const userData = { token, username, role, name, email };
            localStorage.setItem('user', JSON.stringify(userData));

            // We use a small timeout to ensure localStorage is set before redirecting
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 100);
        } else {
            navigate('/login?error=oauth2_failed');
        }
    }, [location, navigate]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                bgcolor: 'background.default'
            }}
        >
            <CircularProgress size={60} thickness={4} sx={{ mb: 4 }} />
            <Typography variant="h5" color="primary" fontWeight="bold">
                Authenticating with Google...
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Please wait while we complete your sign-in.
            </Typography>
        </Box>
    );
};

export default OAuth2RedirectHandler;
