import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { HourglassEmpty as ComingSoonIcon } from '@mui/icons-material';

/**
 * Professional placeholder page for modules under development.
 * Provides a better user experience than a generic 'Page Not Found' error.
 */
const ComingSoonPage = ({ title }) => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '70vh',
                textAlign: 'center',
                p: 3
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 6,
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: 'transparent'
                }}
            >
                <Box
                    sx={{
                        bgcolor: 'primary.light',
                        p: 3,
                        borderRadius: '50%',
                        display: 'flex',
                        mb: 3,
                        color: 'primary.main'
                    }}
                >
                    <ComingSoonIcon sx={{ fontSize: 60 }} />
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                    {title} Module Coming Soon
                </Typography>

                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 500 }}>
                    We're working hard to bring you this feature. This module is part of a future update
                    and will be available once the corresponding development phase is complete.
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/')}
                    sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.39)'
                    }}
                >
                    Return to Dashboard
                </Button>
            </Paper>
        </Box>
    );
};

export default ComingSoonPage;
