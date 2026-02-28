import React from 'react';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Divider,
    Container
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Business as BusinessIcon,
    Settings as SettingsIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logout as LogoutIcon, AccountCircle } from '@mui/icons-material';

const drawerWidth = 240;

/**
 * MainLayout provides a professional dashboard structure.
 * It includes a persistent sidebar (Drawer) and a top Navbar (AppBar).
 */
const MainLayout = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Resources', icon: <BusinessIcon />, path: '/resources' },
        { text: 'Users', icon: <PersonIcon />, path: '/users' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    ];

    const drawer = (
        <div>
            <Toolbar sx={{ backgroundColor: 'primary.main', color: 'white' }}>
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
                    Smart Campus
                </Typography>
            </Toolbar>
            <Divider />
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <AccountCircle sx={{ mr: 1, color: 'primary.main' }} />
                <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                        {user?.username || 'User'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        {user?.role?.replace('ROLE_', '') || 'Student'}
                    </Typography>
                </Box>
            </Box>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => navigate(item.path)}
                        sx={{
                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                            borderRadius: '0 20px 20px 0',
                            mr: 1,
                            mb: 0.5
                        }}
                    >
                        <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
                <Divider sx={{ my: 1 }} />
                <ListItem
                    button
                    onClick={handleLogout}
                    sx={{
                        '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.04)' },
                        color: 'error.main',
                        borderRadius: '0 20px 20px 0',
                        mr: 1
                    }}
                >
                    <ListItemIcon sx={{ color: 'error.main' }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    backgroundColor: 'white',
                    color: 'text.primary',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
                        Management Portal
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout} title="Logout">
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', boxShadow: '4px 0 10px rgba(0,0,0,0.05)' },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(0, 0, 0, 0.08)' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    backgroundColor: '#f8f9fa'
                }}
            >
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
};

export default MainLayout;
