import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { config } from "dotenv";

config();

const MONGO_URI = process.env.VITE_MONGO_URI;
const DB_NAME = "pullstore_db";

let isConnected = false;

async function connectToDatabase() {
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    try {
        await mongoose.connect(MONGO_URI, {
            dbName: DB_NAME,
        });
        isConnected = true;
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        throw error;
    }
}

// GET cart by userId
export async function getCart(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        let userId = url.searchParams.get("userId");

        // Convert to string if needed
        if (userId && typeof userId !== 'string') {
            userId = userId.toString();
        }

        if (!userId) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "userId is required",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        let cart = await Cart.findOne({ userId: userId.toString() }).lean();

        if (!cart) {
            // Create empty cart if doesn't exist
            cart = await Cart.create({ userId, items: [] });
        }

        return new Response(
            JSON.stringify({
                success: true,
                cart: cart,
                items: cart.items || [],
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error fetching cart:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to fetch cart",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// ADD item to cart
export async function addToCart(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        let { userId, sku, size, color, quantity } = body;

        // Convert userId to string
        if (userId && typeof userId !== 'string') {
            userId = userId.toString();
        }

        if (!userId || !sku) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "userId and sku are required",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Get product details
        const product = await Product.findOne({ sku: sku.toUpperCase() }).lean();

        if (!product) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Product not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Check stock
        if (!product.inStock || product.stock < (quantity || 1)) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Product out of stock",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Find or create cart (ensure userId is string)
        let cart = await Cart.findOne({ userId: userId.toString() });

        if (!cart) {
            cart = new Cart({ userId: userId.toString(), items: [] });
        }

        // Create unique item identifier
        const itemId = `${sku}-${size || "default"}-${color || "default"}`;

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            (item) =>
                item.sku === sku.toUpperCase() &&
                item.size === size &&
                item.color === color
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity || 1;
        } else {
            // Add new item
            cart.items.push({
                productId: product._id,
                sku: product.sku,
                name: product.name,
                price: product.price,
                image: product.image,
                size: size || null,
                color: color || null,
                quantity: quantity || 1,
            });
        }

        await cart.save();

        return new Response(
            JSON.stringify({
                success: true,
                cart: cart,
                items: cart.items,
                message: "Item added to cart",
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error adding to cart:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to add item to cart",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// UPDATE cart item quantity
export async function updateCartItem(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { userId, itemId, quantity } = body;

        if (!userId || itemId === undefined || !quantity) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "userId, itemId, and quantity are required",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Cart not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        if (quantity < 1) {
            // Remove item if quantity is less than 1
            cart.items = cart.items.filter((_, index) => index !== itemId);
        } else {
            // Update quantity
            if (cart.items[itemId]) {
                cart.items[itemId].quantity = quantity;
            }
        }

        await cart.save();

        return new Response(
            JSON.stringify({
                success: true,
                cart: cart,
                items: cart.items,
                message: "Cart updated",
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error updating cart:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to update cart",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// REMOVE item from cart
export async function removeFromCart(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { userId, itemId } = body;

        if (!userId || itemId === undefined) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "userId and itemId are required",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Cart not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Remove item
        cart.items = cart.items.filter((_, index) => index !== itemId);

        await cart.save();

        return new Response(
            JSON.stringify({
                success: true,
                cart: cart,
                items: cart.items,
                message: "Item removed from cart",
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error removing from cart:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to remove item from cart",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// CLEAR cart
export async function clearCart(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "userId is required",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const cart = await Cart.findOne({ userId });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        return new Response(
            JSON.stringify({
                success: true,
                items: [],
                message: "Cart cleared",
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error clearing cart:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to clear cart",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
