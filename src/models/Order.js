import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and null
        ref: "Product",
        required: false,
    },
    sku: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        default: null,
    },
    color: {
        type: String,
        default: null,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
}, { _id: false }); // Don't create _id for subdocuments

const shippingAddressSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    address: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    zipCode: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
});

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: String,
            required: true,
        },
        items: [orderItemSchema],
        subtotal: {
            type: Number,
            required: true,
        },
        shipping: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending",
        },
        shippingAddress: {
            type: shippingAddressSchema,
            required: false,
        },
        paymentMethod: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        collection: "orders", // Explicit collection name
    }
);

// Index for faster queries
orderSchema.index({ userId: 1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
