import { createContext, useContext, useState, useEffect } from "react";
import { dataLayer } from "../lib/apiService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [guestId, setGuestId] = useState(() => {
        const stored = localStorage.getItem("guest_id");
        if (stored) return stored;
        const newId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("guest_id", newId);
        return newId;
    });

    const getEffectiveUserId = () => {
        // Use _id for real users from database, or guestId for guests
        // Always convert to string for consistency
        const userId = user?._id || user?.id || guestId;
        return userId ? userId.toString() : guestId;
    };

    useEffect(() => {
        const loadCart = async () => {
            try {
                const userId = getEffectiveUserId();
                const items = await dataLayer.getCart(userId);
                // Add unique id to each item for React key (using array index)
                const itemsWithIds = items.map((item, index) => ({
                    ...item,
                    id: `cart-${index}`,
                    itemIndex: index, // Store the actual index for API calls
                }));
                setCartItems(itemsWithIds);
            } catch (error) {
                console.error("Error loading cart:", error);
                setCartItems([]);
            }
        };
        loadCart();
    }, [user, guestId]);

    const addToCart = async (product, selectedSize = null, selectedColor = null) => {
        try {
            const userId = getEffectiveUserId();
            const updatedCart = await dataLayer.addToCart(userId, product, selectedSize, selectedColor);
            if (updatedCart) {
                const itemsWithIds = updatedCart.map((item, index) => ({
                    ...item,
                    id: `cart-${index}`,
                    itemIndex: index,
                }));
                setCartItems(itemsWithIds);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const userId = getEffectiveUserId();
            // Find the actual array index
            const item = cartItems.find(i => i.id === itemId);
            if (!item) return;

            const updatedCart = await dataLayer.removeFromCart(userId, item.itemIndex);
            if (updatedCart !== undefined) {
                const itemsWithIds = updatedCart.map((item, index) => ({
                    ...item,
                    id: `cart-${index}`,
                    itemIndex: index,
                }));
                setCartItems(itemsWithIds);
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            const userId = getEffectiveUserId();
            // Find the actual array index
            const item = cartItems.find(i => i.id === itemId);
            if (!item) return;

            const updatedCart = await dataLayer.updateCartItemQuantity(userId, item.itemIndex, quantity);
            if (updatedCart !== undefined) {
                const itemsWithIds = updatedCart.map((item, index) => ({
                    ...item,
                    id: `cart-${index}`,
                    itemIndex: index,
                }));
                setCartItems(itemsWithIds);
            }
        } catch (error) {
            console.error("Error updating cart quantity:", error);
        }
    };

    const clearCart = async () => {
        try {
            const userId = getEffectiveUserId();
            const updatedCart = await dataLayer.clearCart(userId);
            if (updatedCart !== undefined) {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    const checkout = async (orderDetails) => {
        try {
            const userId = getEffectiveUserId();
            const response = await dataLayer.createOrder(userId, orderDetails);
            if (response.success) {
                setCartItems([]);
            }
            return response;
        } catch (error) {
            console.error("Error during checkout:", error);
            return {
                success: false,
                message: error.message || "Checkout failed",
            };
        }
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                checkout,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
