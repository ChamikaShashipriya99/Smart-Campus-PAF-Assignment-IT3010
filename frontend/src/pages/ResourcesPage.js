import React, { useState, useEffect } from 'react';
import {
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Grid,
    Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    Save as SaveIcon,
    Search as SearchIcon,
    RestartAlt as ResetIcon
} from '@mui/icons-material';
import resourceService from '../services/resourceService';

const INITIAL_FORM_STATE = {
    name: '',
    type: '',
    capacity: '',
    location: '',
    status: 'ACTIVE',
    availabilityStart: '08:00',
    availabilityEnd: '17:00'
};

const INITIAL_FILTER_STATE = {
    type: '',
    capacity: '',
    location: ''
};

const ResourcesPage = () => {
    // --- Auth Simulation ---
    /**
     * In a real app, this would come from an AuthContext or Redux store
     * after the user logs in via the Spring Boot backend.
     * CHANGE 'ROLE_ADMIN' to 'ROLE_USER' to test the button visibility!
     */
    const [user] = useState({
        name: 'Admin User',
        role: 'ROLE_ADMIN' // Options: 'ROLE_ADMIN', 'ROLE_USER'
    });

    const isAdmin = user.role === 'ROLE_ADMIN';

    // --- Component State ---
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Filter State ---
    const [filters, setFilters] = useState(INITIAL_FILTER_STATE);
    const [isSearching, setIsSearching] = useState(false);

    // --- Dialog State ---
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [editingId, setEditingId] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // --- Delete Confirmation State ---
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // --- Notification State ---
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const showNotification = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async (searchFilters = null) => {
        setLoading(true);
        try {
            let response;
            if (searchFilters) {
                // Remove empty strings from filters before sending
                const cleanFilters = Object.fromEntries(
                    Object.entries(searchFilters).filter(([_, v]) => v !== '')
                );
                response = await resourceService.searchResources(cleanFilters);
            } else {
                response = await resourceService.getAllResources();
            }
            setResources(response.data);
            setError(null);
        } catch (err) {
            setError('Unable to fetch resources. Please check if the Spring Boot backend is active on port 8080.');
            console.error('API Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // --- Search Handlers ---
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSearch = () => {
        setIsSearching(true);
        fetchResources(filters);
    };

    const handleReset = () => {
        setFilters(INITIAL_FILTER_STATE);
        setIsSearching(false);
        fetchResources();
    };

    // --- Form Handlers ---
    const handleOpenDialog = (resource = null) => {
        if (resource) {
            setFormData({
                name: resource.name || '',
                type: resource.type || '',
                capacity: resource.capacity || '',
                location: resource.location || '',
                status: resource.status || 'ACTIVE',
                availabilityStart: resource.availabilityStart || '08:00',
                availabilityEnd: resource.availabilityEnd || '17:00'
            });
            setEditingId(resource.id);
        } else {
            setFormData(INITIAL_FORM_STATE);
            setEditingId(null);
        }
        setFormErrors({});
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: null });
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.type.trim()) errors.type = 'Type is required';
        if (!formData.location.trim()) errors.location = 'Location is required';
        if (!formData.capacity || formData.capacity < 1) errors.capacity = 'Valid capacity required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            if (editingId) {
                await resourceService.updateResource(editingId, formData);
                showNotification('Resource updated successfully');
            } else {
                await resourceService.createResource(formData);
                showNotification('Resource created successfully');
            }
            handleCloseDialog();
            fetchResources(isSearching ? filters : null);
        } catch (err) {
            showNotification('Failed to save resource', 'error');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (resource) => {
        setResourceToDelete(resource);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!resourceToDelete) return;

        setDeleting(true);
        try {
            await resourceService.deleteResource(resourceToDelete.id);
            setResources(resources.filter(r => r.id !== resourceToDelete.id));
            setDeleteDialogOpen(false);
            setResourceToDelete(null);
            showNotification('Resource deleted successfully', 'error');
        } catch (err) {
            showNotification('Action failed: Could not delete resource', 'error');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Box>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                        Campus Resources
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Logged in as: <strong>{user.name}</strong> ({user.role})
                    </Typography>
                </Box>
                <Box>
                    <IconButton onClick={() => fetchResources(isSearching ? filters : null)} sx={{ mr: 1 }} color="primary">
                        <RefreshIcon />
                    </IconButton>

                    {/* [Conditional Rendering]: Only Admins can see the Add button */}
                    {isAdmin && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                            sx={{ borderRadius: 2, textTransform: 'none', px: 3, boxShadow: 2 }}
                        >
                            Add Resource
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Filter Section */}
            <Paper sx={{ p: 2.5, mb: 4, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth size="small" label="Search by Type" name="type"
                            value={filters.type} onChange={handleFilterChange}
                            placeholder="e.g. Lab, Room"
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            fullWidth size="small" label="Min Capacity" name="capacity" type="number"
                            value={filters.capacity} onChange={handleFilterChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth size="small" label="Search Location" name="location"
                            value={filters.location} onChange={handleFilterChange}
                            placeholder="e.g. Block C"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ display: 'flex', gap: 1.5 }}>
                        <Button
                            fullWidth variant="contained" color="primary"
                            startIcon={<SearchIcon />} onClick={handleSearch}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                            Apply Search
                        </Button>
                        <Button
                            fullWidth variant="outlined" color="inherit"
                            startIcon={<ResetIcon />} onClick={handleReset}
                            sx={{ textTransform: 'none', borderRadius: 2, borderColor: 'grey.300' }}
                        >
                            Reset
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Resource Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 25px rgba(0,0,0,0.06)' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', flexFlow: 'column', alignItems: 'center', p: 10 }}>
                        <CircularProgress size={60} thickness={4} />
                        <Typography sx={{ mt: 2, fontWeight: 500, color: 'text.secondary' }}>
                            {isSearching ? 'Filtering Campus records...' : 'Loading Resource data...'}
                        </Typography>
                    </Box>
                ) : (
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: 'primary.light', '& .MuiTableCell-head': { fontWeight: 'bold', color: 'primary.dark' } }}>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Capacity</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {resources.length > 0 ? (
                                resources.map((res) => (
                                    <TableRow key={res.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell sx={{ fontWeight: 600 }}>{res.name}</TableCell>
                                        <TableCell sx={{ fontSize: '0.9rem' }}>{res.type}</TableCell>
                                        <TableCell>{res.capacity}</TableCell>
                                        <TableCell>{res.location}</TableCell>
                                        <TableCell>
                                            <Box component="span" sx={{
                                                px: 1.5, py: 0.5, borderRadius: 10, fontSize: '0.75rem', fontWeight: 'bold',
                                                bgcolor: res.status === 'ACTIVE' ? 'success.light' : 'warning.light',
                                                color: res.status === 'ACTIVE' ? 'success.dark' : 'warning.dark',
                                                textTransform: 'uppercase'
                                            }}>
                                                {res.status}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            {/* [Conditional Rendering]: Only Admins see Edit/Delete */}
                                            {isAdmin ? (
                                                <>
                                                    <Tooltip title="Modify Entry">
                                                        <IconButton color="primary" size="small" onClick={() => handleOpenDialog(res)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Remove Entry">
                                                        <IconButton
                                                            onClick={() => handleDeleteClick(res)}
                                                            color="error"
                                                            size="small"
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">Read Only</Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 12 }}>
                                        <Typography color="text.secondary" variant="body1" sx={{ fontStyle: 'italic' }}>
                                            {isSearching ? 'No campus resources match your current selection.' : 'No resources have been registered yet.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* Add/Edit Modal (Dialog) remains same */}
            <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
                    {editingId ? 'Update Resource Details' : 'Register New Resource'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent dividers sx={{ bgcolor: 'grey.50' }}>
                        <Grid container spacing={2.5}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth label="Resource Name" name="name"
                                    value={formData.name} onChange={handleInputChange}
                                    error={!!formErrors.name} helperText={formErrors.name}
                                    placeholder="e.g. Auditorium A, Lab 403" variant="outlined"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Resource Category" name="type"
                                    value={formData.type} onChange={handleInputChange}
                                    error={!!formErrors.type} helperText={formErrors.type}
                                    placeholder="e.g. Lab, Classroom"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Max Capacity" name="capacity" type="number"
                                    value={formData.capacity} onChange={handleInputChange}
                                    error={!!formErrors.capacity} helperText={formErrors.capacity}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth label="Location" name="location"
                                    value={formData.location} onChange={handleInputChange}
                                    error={!!formErrors.location} helperText={formErrors.location}
                                    placeholder="e.g. Main Building, Floor 4"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth select label="Status" name="status"
                                    value={formData.status} onChange={handleInputChange}
                                >
                                    <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                                    <MenuItem value="OUT_OF_SERVICE">OUT_OF_SERVICE</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Available From" name="availabilityStart" type="time"
                                    value={formData.availabilityStart} onChange={handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth label="Available Until" name="availabilityEnd" type="time"
                                    value={formData.availabilityEnd} onChange={handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, py: 2.5 }}>
                        <Button onClick={handleCloseDialog} color="inherit" sx={{ textTransform: 'none', fontWeight: 500 }}>
                            Cancel
                        </Button>
                        <Button
                            type="submit" variant="contained"
                            disabled={submitting} startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                            sx={{ textTransform: 'none', px: 4, borderRadius: 2, fontWeight: 'bold' }}
                        >
                            {editingId ? 'Save Changes' : 'Confirm Registration'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* --- Delete Confirmation Dialog --- */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => !deleting && setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: { borderRadius: 3, p: 1, width: '400px' }
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete <strong>{resourceToDelete?.name}</strong>?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        color="inherit"
                        disabled={deleting}
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        color="error"
                        variant="contained"
                        disabled={deleting}
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        {deleting ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* --- Notifications --- */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <MuiAlert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: 2 }}
                >
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
        </Box>
    );
};

export default ResourcesPage;
