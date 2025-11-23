import { products as initialProducts, users as initialUsers, orders as initialOrders } from "../data/mockData";

// Keys for localStorage
const STORAGE_KEYS = {
    PRODUCTS: "ecommerce_products",
    USERS: "ecommerce_users",
    ORDERS: "ecommerce_orders",
    CARTS: "ecommerce_carts", // Map userId -> cartItems
};

// Helper to simulate network delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Initialize data if not present
const initData = () => {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CARTS)) {
        localStorage.setItem(STORAGE_KEYS.CARTS, JSON.stringify({}));
    }
};

// Initialize on load
initData();

// Generic helpers
const getStored = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const setStored = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const dataLayer = {
    // --- Products ---
    getProducts: async () => {
        await delay();
        return getStored(STORAGE_KEYS.PRODUCTS);
    },

    getProductBySku: async (sku) => {
        await delay();
        const products = getStored(STORAGE_KEYS.PRODUCTS);
        return products.find((p) => p.sku === sku);
    },

    updateProductStock: async (sku, quantityChange) => {
        // quantityChange: negative for decrease (sale), positive for restock
        await delay();
        const products = getStored(STORAGE_KEYS.PRODUCTS);
        const productIndex = products.findIndex((p) => p.sku === sku);
        if (productIndex !== -1) {
            if (products[productIndex].stock === undefined) {
                products[productIndex].stock = 10;
            }

            products[productIndex].stock += quantityChange;
            if (products[productIndex].stock <= 0) {
                products[productIndex].inStock = false;
                products[productIndex].stock = 0;
            } else {
                products[productIndex].inStock = true;
            }

            setStored(STORAGE_KEYS.PRODUCTS, products);
        }
    },

    // --- Users & Auth ---
    login: async (email, password) => {
        await delay();
        const users = getStored(STORAGE_KEYS.USERS);
        const user = users.find((u) => u.email === email && u.password === password);
        if (user) {
            // Return user without password
            const { password, ...safeUser } = user;
            return { success: true, user: safeUser };
        }
        return { success: false, message: "Invalid credentials" };
    },

    register: async (userData) => {
        await delay();
        const users = getStored(STORAGE_KEYS.USERS);
        if (users.find((u) => u.email === userData.email)) {
            return { success: false, message: "User already exists" };
        }
        const newUser = { ...userData, id: `u${Date.now()}`, role: "user" };
        users.push(newUser);
        setStored(STORAGE_KEYS.USERS, users);
        const { password, ...safeUser } = newUser;
        return { success: true, user: safeUser };
    },

    // --- Cart ---
    getCart: async (userId) => {
        await delay();
        if (!userId) return [];
        const carts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARTS) || "{}");
        return carts[userId] || [];
    },

    addToCart: async (userId, product, size, color, quantity = 1) => {
        await delay();
        if (!userId) return null;

        const carts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARTS) || "{}");
        const userCart = carts[userId] || [];

        const cartItemId = `${product.sku}-${size || "default"}-${color || "default"}`;
        const existingItemIndex = userCart.findIndex((item) => item.id === cartItemId);

        if (existingItemIndex > -1) {
            userCart[existingItemIndex].quantity += quantity;
        } else {
            userCart.push({
                id: cartItemId,
                sku: product.sku,
                name: product.name,
                price: product.price,
                image: product.image,
                size,
                color,
                quantity,
            });
        }

        carts[userId] = userCart;
        localStorage.setItem(STORAGE_KEYS.CARTS, JSON.stringify(carts));
        return userCart;
    },

    removeFromCart: async (userId, cartItemId) => {
        await delay();
        if (!userId) return;
        const carts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARTS) || "{}");
        let userCart = carts[userId] || [];
        userCart = userCart.filter((item) => item.id !== cartItemId);
        carts[userId] = userCart;
        localStorage.setItem(STORAGE_KEYS.CARTS, JSON.stringify(carts));
        return userCart;
    },

    updateCartItemQuantity: async (userId, cartItemId, quantity) => {
        await delay();
        if (!userId) return;
        const carts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARTS) || "{}");
        let userCart = carts[userId] || [];

        if (quantity < 1) {
            userCart = userCart.filter((item) => item.id !== cartItemId);
        } else {
            userCart = userCart.map(item => item.id === cartItemId ? { ...item, quantity } : item);
        }

        carts[userId] = userCart;
        localStorage.setItem(STORAGE_KEYS.CARTS, JSON.stringify(carts));
        return userCart;
    },

    clearCart: async (userId) => {
        await delay();
        if (!userId) return;
        const carts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARTS) || "{}");
        carts[userId] = [];
        localStorage.setItem(STORAGE_KEYS.CARTS, JSON.stringify(carts));
        return [];
    },

    // --- Admin Products ---
    createProduct: async (productData) => {
        await delay();
        const products = getStored(STORAGE_KEYS.PRODUCTS);
        if (products.find((p) => p.sku === productData.sku)) {
            return { success: false, message: "Product with this SKU already exists" };
        }
        const newProduct = { ...productData, sizes: ["S", "M", "L", "XL"], colors: ["Default"] };
        products.push(newProduct);
        setStored(STORAGE_KEYS.PRODUCTS, products);
        return { success: true, product: newProduct };
    },

    updateProduct: async (sku, updates) => {
        await delay();
        const products = getStored(STORAGE_KEYS.PRODUCTS);
        const index = products.findIndex((p) => p.sku === sku);
        if (index === -1) return { success: false, message: "Product not found" };

        products[index] = { ...products[index], ...updates };
        setStored(STORAGE_KEYS.PRODUCTS, products);
        return { success: true, product: products[index] };
    },

    deleteProduct: async (sku) => {
        await delay();
        let products = getStored(STORAGE_KEYS.PRODUCTS);
        products = products.filter((p) => p.sku !== sku);
        setStored(STORAGE_KEYS.PRODUCTS, products);
        return { success: true };
    },

    // --- Orders ---
    createOrder: async (userId, orderDetails) => {
        await delay();
        const carts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARTS) || "{}");
        const userCart = carts[userId] || [];

        if (userCart.length === 0) {
            return { success: false, message: "Cart is empty" };
        }

        const products = getStored(STORAGE_KEYS.PRODUCTS);
        for (const item of userCart) {
            const product = products.find(p => p.sku === item.sku);
            if (product && product.stock !== undefined && product.stock < item.quantity) {
                return { success: false, message: `Not enough stock for ${item.name}` };
            }
        }

        const newOrder = {
            id: `ORD-${Date.now()}`,
            userId,
            date: new Date().toISOString().split('T')[0],
            total: userCart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: "Pending",
            items: [...userCart],
            ...orderDetails
        };

        const orders = getStored(STORAGE_KEYS.ORDERS);
        orders.push(newOrder);
        setStored(STORAGE_KEYS.ORDERS, orders);

        for (const item of userCart) {
            const pIndex = products.findIndex(p => p.sku === item.sku);
            if (pIndex > -1) {
                if (products[pIndex].stock === undefined) products[pIndex].stock = 10;
                products[pIndex].stock -= item.quantity;
                if (products[pIndex].stock <= 0) {
                    products[pIndex].stock = 0;
                    products[pIndex].inStock = false;
                }
            }
        }
        setStored(STORAGE_KEYS.PRODUCTS, products);

        carts[userId] = [];
        localStorage.setItem(STORAGE_KEYS.CARTS, JSON.stringify(carts));

        return { success: true, order: newOrder };
    },

    getOrders: async (userId) => {
        await delay();
        const orders = getStored(STORAGE_KEYS.ORDERS);
        if (!userId) return [];
        return orders.filter(o => o.userId === userId);
    },

    getAllOrders: async () => {
        await delay();
        return getStored(STORAGE_KEYS.ORDERS);
    },

    updateOrderStatus: async (orderId, newStatus) => {
        await delay();
        const orders = getStored(STORAGE_KEYS.ORDERS);
        const index = orders.findIndex((o) => o.id === orderId);
        if (index === -1) return { success: false, message: "Order not found" };

        orders[index].status = newStatus;
        setStored(STORAGE_KEYS.ORDERS, orders);
        return { success: true, order: orders[index] };
    }
};
