import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

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

// Generate unique order ID
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD-${timestamp}-${random}`;
}

// CREATE order
export async function createOrder(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        let { userId, shippingAddress, paymentMethod } = body;

        // Convert userId to string if it's an ObjectId
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

        // Get user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Cart not found. Please add items to cart first.",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        if (!cart.items || cart.items.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Cart is empty",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Verify stock and update inventory
        for (const item of cart.items) {
            const product = await Product.findOne({ sku: item.sku });

            if (!product) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: `Product ${item.name} (SKU: ${item.sku}) not found`,
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    }
                );
            }

            if (product.stock < item.quantity) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: `Insufficient stock for ${item.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
                    }),
                    {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    }
                );
            }

            // Reduce stock
            product.stock -= item.quantity;
            product.inStock = product.stock > 0;
            await product.save();
        }

        // Calculate totals
        const subtotal = cart.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        const shipping = subtotal > 0 ? 10 : 0;
        const total = subtotal + shipping;

        // Create order
        // Map cart items to order items format (ensure productId is ObjectId if present)
        const orderItems = cart.items.map(item => ({
            productId: item.productId ? (typeof item.productId === 'string' ? item.productId : item.productId.toString()) : null,
            sku: item.sku,
            name: item.name,
            price: item.price,
            image: item.image,
            size: item.size || null,
            color: item.color || null,
            quantity: item.quantity,
        }));

        const newOrder = new Order({
            orderId: generateOrderId(),
            userId: userId.toString(), // Ensure it's a string
            items: orderItems,
            subtotal,
            shipping,
            total,
            status: "Pending",
            shippingAddress: shippingAddress || {},
            paymentMethod: paymentMethod || null,
        });

        await newOrder.save();

        // Clear cart
        cart.items = [];
        await cart.save();

        return new Response(
            JSON.stringify({
                success: true,
                order: newOrder,
                message: "Order created successfully",
            }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error creating order:", error);
        
        // Check for validation errors
        if (error.name === 'ValidationError') {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Order validation failed",
                    error: error.message,
                    validationErrors: Object.keys(error.errors || {}).map(key => ({
                        field: key,
                        message: error.errors[key].message
                    })),
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to create order",
                error: error.message,
                errorType: error.name,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// GET orders by userId
export async function getUserOrders(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");

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

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        return new Response(
            JSON.stringify({
                success: true,
                orders: orders,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error fetching orders:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to fetch orders",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// GET all orders (admin)
export async function getAllOrders(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const status = url.searchParams.get("status");
        const limit = parseInt(url.searchParams.get("limit") || "100");
        const page = parseInt(url.searchParams.get("page") || "1");

        let query = {};

        if (status) {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean();

        const totalOrders = await Order.countDocuments(query);

        return new Response(
            JSON.stringify({
                success: true,
                orders: orders,
                pagination: {
                    page,
                    limit,
                    total: totalOrders,
                    pages: Math.ceil(totalOrders / limit),
                },
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to fetch orders",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// UPDATE order status
export async function updateOrderStatus(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "orderId and status are required",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

        if (!validStatuses.includes(status)) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const order = await Order.findOne({ orderId });

        if (!order) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Order not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        order.status = status;
        await order.save();

        return new Response(
            JSON.stringify({
                success: true,
                order: order,
                message: "Order status updated successfully",
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error updating order status:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to update order status",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// GET single order by orderId
export async function getOrderById(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const orderId = url.pathname.split("/").pop();

        if (!orderId) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "orderId is required",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const order = await Order.findOne({ orderId }).lean();

        if (!order) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Order not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                order: order,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error fetching order:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to fetch order",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
