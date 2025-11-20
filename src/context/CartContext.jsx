import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, selectedSize = null, selectedColor = null) => {
        const cartItem = {
            id: `${product.sku}-${selectedSize || "default"}-${selectedColor || "default"}`,
            sku: product.sku,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            color: selectedColor,
            quantity: 1,
        };

        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === cartItem.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === cartItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, cartItem];
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }
        setCartItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setCartItems([]);
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
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
