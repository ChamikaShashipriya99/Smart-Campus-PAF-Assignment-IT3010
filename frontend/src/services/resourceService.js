import api from './api';

/**
 * Service layer for Resource management.
 * Separating API calls from UI components improves:
 * - Reusability: Multiple components can use the same methods.
 * - Maintainability: One place to update if the endpoint changes.
 * - Testability: Easier to mock API calls in tests.
 */
const resourceService = {
    /**
     * Fetch all resources from the backend.
     * @returns {Promise} Axios response
     */
    getAllResources: async () => {
        return await api.get('/resources');
    },

    /**
     * Fetch a single resource by ID.
     * @param {string|number} id 
     * @returns {Promise} Axios response
     */
    getResourceById: async (id) => {
        return await api.get(`/resources/${id}`);
    },

    /**
     * Create a new resource.
     * @param {Object} resourceData 
     * @returns {Promise} Axios response
     */
    createResource: async (resourceData) => {
        return await api.post('/resources', resourceData);
    },

    /**
     * Update an existing resource.
     * @param {string|number} id 
     * @param {Object} resourceData 
     * @returns {Promise} Axios response
     */
    updateResource: async (id, resourceData) => {
        return await api.put(`/resources/${id}`, resourceData);
    },

    /**
     * Delete a resource by ID.
     * @param {string|number} id 
     * @returns {Promise} Axios response
     */
    deleteResource: async (id) => {
        return await api.delete(`/resources/${id}`);
    },

    /**
     * Search resources based on filters.
     * [Query Parameters]: Axios handles these via the 'params' object.
     * @param {Object} filters { type, capacity, location }
     * @returns {Promise} Axios response
     */
    searchResources: async (filters) => {
        return await api.get('/resources/search', { params: filters });
    },

    /**
     * Upload an image for a specific resource.
     * @param {number} id 
     * @param {File} file 
     * @returns {Promise} Axios response
     */
    uploadImage: async (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return await api.post(`/resources/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    /**
     * Fetch resource analytics (summary stats and distribution).
     * [Innovation Module]: Used for Dashboard visualization.
     */
    getAnalytics: async () => {
        return await api.get('/resources/analytics');
    },
};

export default resourceService;
