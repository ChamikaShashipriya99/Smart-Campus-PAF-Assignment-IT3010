import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

/**
 * Professional Login Page for Smart Campus Operations Hub.
 */
const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect path (where the user was before redirection to login)
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await login(username, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError('Invalid username or password. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                p: 3
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={10}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            p: 2,
                            borderRadius: '50%',
                            mb: 2,
                            display: 'flex'
                        }}
                    >
                        <LoginIcon fontSize="large" />
                    </Box>

                    <Typography component="h1" variant="h4" gutterBottom fontWeight="700" color="primary">
                        Welcome Back
                    </Typography>

                    <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
                        Please sign in to access the Smart Campus Operations Hub
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            InputProps={{
                                sx: { borderRadius: 2 }
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                sx: { borderRadius: 2 },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={submitting}
                            sx={{
                                mt: 4,
                                mb: 2,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                borderRadius: 2,
                                textTransform: 'none',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                            }}
                        >
                            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                        </Button>

                        <Box sx={{ my: 2, display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ flex: 1, height: '1px', bgcolor: '#eee' }} />
                            <Typography variant="body2" color="textSecondary" sx={{ mx: 2 }}>
                                OR
                            </Typography>
                            <Box sx={{ flex: 1, height: '1px', bgcolor: '#eee' }} />
                        </Box>

                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                            sx={{
                                py: 1.2,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: '600',
                                borderColor: '#ddd',
                                color: 'text.primary',
                                '&:hover': {
                                    borderColor: '#ccc',
                                    backgroundColor: '#f9f9f9'
                                }
                            }}
                        >
                            <Box component="img"
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                sx={{ width: 18, height: 18, mr: 1.5 }}
                            />
                            Sign in with Google
                        </Button>
                    </Box>

                    <Box sx={{ mt: 3, width: '100%', borderTop: '1px solid #eee', pt: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="textSecondary">
                            Default testing accounts: admin/admin123 or user/user123
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;
