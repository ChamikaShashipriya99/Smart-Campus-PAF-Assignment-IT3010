import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    useTheme
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import {
    Inventory as TotalIcon,
    CheckCircle as ActiveIcon,
    Error as OutIcon,
    Category as TypeIcon
} from '@mui/icons-material';
import resourceService from '../services/resourceService';

const DashboardPage = () => {
    const theme = useTheme();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await resourceService.getAnalytics();
                setData(response.data);
            } catch (err) {
                setError('Failed to load analytics data. Ensure the backend is running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    // Transform Map to Array for Recharts
    const chartData = Object.entries(data.resourcesByType).map(([name, value]) => ({
        name,
        count: value
    }));

    const summaryCards = [
        { title: 'Total Resources', value: data.totalResources, icon: <TotalIcon />, color: '#2196f3' },
        { title: 'Active', value: data.activeResources, icon: <ActiveIcon />, color: '#4caf50' },
        { title: 'Out of Service', value: data.outOfServiceResources, icon: <OutIcon />, color: '#f44336' },
        { title: 'Categories', value: chartData.length, icon: <TypeIcon />, color: '#ff9800' }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.dark' }}>
                System Analytics
            </Typography>

            {/* Summary Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {summaryCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                                        {card.title}
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                        {card.value}
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    bgcolor: `${card.color}15`,
                                    p: 1.5,
                                    borderRadius: 3,
                                    display: 'flex',
                                    color: card.color
                                }}>
                                    {card.icon}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <Typography variant="h6" sx={{ mb: 4, fontWeight: 'bold' }}>
                            Resource Distribution by Type
                        </Typography>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                        cursor={{ fill: '#f5f5f5' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="count" fill={theme.palette.primary.main} radius={[8, 8, 0, 0]} barSize={50}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;
