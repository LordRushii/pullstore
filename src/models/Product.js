import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        sizes: {
            type: [String],
            default: [],
        },
        colors: {
            type: [String],
            default: [],
        },
        stock: {
            type: Number,
            default: 0,
            min: 0,
        },
        inStock: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster searches
productSchema.index({ name: "text", description: "text", category: "text" });
productSchema.index({ category: 1 });
productSchema.index({ sku: 1 });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
