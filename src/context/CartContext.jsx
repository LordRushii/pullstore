import { createContext, useContext, useState, useEffect } from "react";
import { dataLayer } from "../lib/dataLayer";
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

    const getEffectiveUserId = () => user?.id || guestId;

    useEffect(() => {
        const loadCart = async () => {
            const userId = getEffectiveUserId();
            const items = await dataLayer.getCart(userId);
            setCartItems(items);
        };
        loadCart();
    }, [user, guestId]);

    const addToCart = async (product, selectedSize = null, selectedColor = null) => {
        const userId = getEffectiveUserId();
        const updatedCart = await dataLayer.addToCart(userId, product, selectedSize, selectedColor);
        if (updatedCart) setCartItems(updatedCart);
    };

    const removeFromCart = async (id) => {
        const userId = getEffectiveUserId();
        const updatedCart = await dataLayer.removeFromCart(userId, id);
        if (updatedCart) setCartItems(updatedCart);
    };

    const updateQuantity = async (id, quantity) => {
        const userId = getEffectiveUserId();
        const updatedCart = await dataLayer.updateCartItemQuantity(userId, id, quantity);
        if (updatedCart) setCartItems(updatedCart);
    };

    const clearCart = async () => {
        const userId = getEffectiveUserId();
        const updatedCart = await dataLayer.clearCart(userId);
        if (updatedCart) setCartItems(updatedCart);
    };

    const checkout = async (orderDetails) => {
        const userId = getEffectiveUserId();
        const response = await dataLayer.createOrder(userId, orderDetails);
        if (response.success) {
            setCartItems([]);
        }
        return response;
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
