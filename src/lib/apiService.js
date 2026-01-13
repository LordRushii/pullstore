/**
 * API Service Layer
 * Handles all HTTP requests to the backend API
 */

const API_BASE = import.meta.env.VITE_APP_URL || window.location.origin;

// Helper function for making API requests
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/448742b1-5c1b-41e6-9e55-ef8709699245',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiService.js:10',message:'API request initiated',data:{endpoint,url,apiBase:API_BASE},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    const config = {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/448742b1-5c1b-41e6-9e55-ef8709699245',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiService.js:22',message:'Response received',data:{endpoint,status:response.status,statusText:response.statusText,contentType:response.headers.get('content-type')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/448742b1-5c1b-41e6-9e55-ef8709699245',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiService.js:26',message:'Content type check',data:{endpoint,isJson,contentType},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        let data;
        if (isJson) {
            data = await response.json();
        } else {
            const text = await response.text();
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/448742b1-5c1b-41e6-9e55-ef8709699245',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiService.js:33',message:'Non-JSON response received',data:{endpoint,status:response.status,textPreview:text.substring(0,100)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
            // #endregion
            throw new Error(`Expected JSON but got ${contentType || 'unknown content type'}. Response preview: ${text.substring(0, 100)}`);
        }

        if (!response.ok) {
            throw new Error(data.message || "API request failed");
        }

        return data;
    } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/448742b1-5c1b-41e6-9e55-ef8709699245',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiService.js:44',message:'API request error',data:{endpoint,errorMessage:error.message,errorName:error.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

// ===== PRODUCTS API =====
export const productsApi = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.category) params.append("category", filters.category);
        if (filters.search) params.append("search", filters.search);

        const queryString = params.toString();
        const endpoint = queryString ? `/api/products?${queryString}` : "/api/products";

        const data = await apiRequest(endpoint);
        return data.products || [];
    },

    getBySku: async (sku) => {
        const data = await apiRequest(`/api/products/${sku}`);
        return data.product;
    },

    create: async (productData) => {
        const data = await apiRequest("/api/products", {
            method: "POST",
            body: JSON.stringify(productData),
        });
        return data;
    },

    update: async (sku, updates) => {
        const data = await apiRequest(`/api/products/${sku}`, {
            method: "PUT",
            body: JSON.stringify(updates),
        });
        return data;
    },

    delete: async (sku) => {
        const data = await apiRequest(`/api/products/${sku}`, {
            method: "DELETE",
        });
        return data;
    },
};

// ===== CART API =====
export const cartApi = {
    get: async (userId) => {
        const data = await apiRequest(`/api/cart?userId=${userId}`);
        return data.items || [];
    },

    add: async (userId, product, size, color, quantity = 1) => {
        const data = await apiRequest("/api/cart/add", {
            method: "POST",
            body: JSON.stringify({
                userId,
                sku: product.sku,
                size,
                color,
                quantity,
            }),
        });
        return data.items || [];
    },

    updateQuantity: async (userId, itemId, quantity) => {
        const data = await apiRequest("/api/cart/update", {
            method: "PUT",
            body: JSON.stringify({
                userId,
                itemId,
                quantity,
            }),
        });
        return data.items || [];
    },

    remove: async (userId, itemId) => {
        const data = await apiRequest("/api/cart/remove", {
            method: "DELETE",
            body: JSON.stringify({
                userId,
                itemId,
            }),
        });
        return data.items || [];
    },

    clear: async (userId) => {
        const data = await apiRequest("/api/cart/clear", {
            method: "DELETE",
            body: JSON.stringify({ userId }),
        });
        return data.items || [];
    },
};

// ===== ORDERS API =====
export const ordersApi = {
    create: async (userId, orderDetails) => {
        const data = await apiRequest("/api/orders", {
            method: "POST",
            body: JSON.stringify({
                userId,
                ...orderDetails,
            }),
        });
        return data;
    },

    getUserOrders: async (userId) => {
        const data = await apiRequest(`/api/orders/user?userId=${userId}`);
        return data.orders || [];
    },

    getAllOrders: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append("status", filters.status);
        if (filters.limit) params.append("limit", filters.limit);
        if (filters.page) params.append("page", filters.page);

        const queryString = params.toString();
        const endpoint = queryString ? `/api/orders/all?${queryString}` : "/api/orders/all";

        const data = await apiRequest(endpoint);
        return data.orders || [];
    },

    updateStatus: async (orderId, status) => {
        const data = await apiRequest("/api/orders/status", {
            method: "PUT",
            body: JSON.stringify({
                orderId,
                status,
            }),
        });
        return data;
    },

    getById: async (orderId) => {
        const data = await apiRequest(`/api/orders/${orderId}`);
        return data.order;
    },
};

// ===== CATEGORIES API =====
export const categoriesApi = {
    getAll: async () => {
        const data = await apiRequest("/api/categories");
        return data.categories || [];
    },

    create: async (categoryData) => {
        const data = await apiRequest("/api/categories", {
            method: "POST",
            body: JSON.stringify(categoryData),
        });
        return data;
    },

    update: async (id, updates) => {
        const data = await apiRequest(`/api/categories/${id}`, {
            method: "PUT",
            body: JSON.stringify(updates),
        });
        return data;
    },

    delete: async (id) => {
        const data = await apiRequest(`/api/categories/${id}`, {
            method: "DELETE",
        });
        return data;
    },
};

// ===== USERS API =====
export const usersApi = {
    getProfile: async (userId) => {
        const data = await apiRequest(`/api/users/profile?userId=${userId}`);
        return data.user;
    },

    updateProfile: async (userId, updates) => {
        const data = await apiRequest("/api/users/profile", {
            method: "PUT",
            body: JSON.stringify({
                userId,
                ...updates,
            }),
        });
        return data;
    },

    changePassword: async (userId, currentPassword, newPassword) => {
        const data = await apiRequest("/api/users/change-password", {
            method: "PUT",
            body: JSON.stringify({
                userId,
                currentPassword,
                newPassword,
            }),
        });
        return data;
    },

    // Admin endpoints
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.role) params.append("role", filters.role);
        if (filters.isActive !== undefined) params.append("isActive", filters.isActive);
        if (filters.limit) params.append("limit", filters.limit);
        if (filters.page) params.append("page", filters.page);

        const queryString = params.toString();
        const endpoint = queryString ? `/api/users/all?${queryString}` : "/api/users/all";

        const data = await apiRequest(endpoint);
        return data;
    },

    update: async (userId, updates) => {
        const data = await apiRequest(`/api/users/${userId}`, {
            method: "PUT",
            body: JSON.stringify(updates),
        });
        return data;
    },

    delete: async (userId) => {
        const data = await apiRequest(`/api/users/${userId}`, {
            method: "DELETE",
        });
        return data;
    },
};

// ===== BACKWARD COMPATIBILITY LAYER =====
// This maintains the same interface as the old dataLayer for easier migration
export const dataLayer = {
    // Products
    getProducts: productsApi.getAll,
    getProductBySku: productsApi.getBySku,
    createProduct: productsApi.create,
    updateProduct: productsApi.update,
    deleteProduct: productsApi.delete,

    // Cart
    getCart: cartApi.get,
    addToCart: cartApi.add,
    updateCartItemQuantity: cartApi.updateQuantity,
    removeFromCart: cartApi.remove,
    clearCart: cartApi.clear,

    // Orders
    createOrder: ordersApi.create,
    getOrders: ordersApi.getUserOrders,
    getAllOrders: ordersApi.getAllOrders,
    updateOrderStatus: async (orderId, status) => {
        const result = await ordersApi.updateStatus(orderId, status);
        return result;
    },

    // Categories
    getCategories: categoriesApi.getAll,
    createCategory: categoriesApi.create,
    updateCategory: categoriesApi.update,
    deleteCategory: categoriesApi.delete,

    // Users
    getUserProfile: usersApi.getProfile,
    updateUserProfile: usersApi.updateProfile,
    changePassword: usersApi.changePassword,
    getAllUsers: usersApi.getAll,
    updateUser: usersApi.update,
    deleteUser: usersApi.delete,
};

export default dataLayer;
