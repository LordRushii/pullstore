import { MongoClient } from "mongodb";
import mongoose from "mongoose";
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

// GET all products
export async function getProducts(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const category = url.searchParams.get("category");
        const search = url.searchParams.get("search");

        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const products = await Product.find(query).sort({ createdAt: -1 }).lean();

        return new Response(
            JSON.stringify({
                success: true,
                products: products,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error fetching products:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to fetch products",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// GET single product by SKU
export async function getProductBySku(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const sku = url.pathname.split("/").pop();

        if (!sku) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "SKU is required",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

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

        return new Response(
            JSON.stringify({
                success: true,
                product: product,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error fetching product:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to fetch product",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// CREATE product
export async function createProduct(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { sku, name, description, price, image, category, sizes, colors, stock } = body;

        // Validation
        if (!sku || !name || !price || !image || !category) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Missing required fields: sku, name, price, image, category",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Check if product with SKU already exists
        const existingProduct = await Product.findOne({ sku: sku.toUpperCase() });
        if (existingProduct) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Product with this SKU already exists",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const newProduct = new Product({
            sku: sku.toUpperCase(),
            name,
            description: description || "",
            price: Number(price),
            image,
            category,
            sizes: sizes || ["S", "M", "L", "XL"],
            colors: colors || ["Default"],
            stock: stock !== undefined ? Number(stock) : 50,
            inStock: stock !== undefined ? Number(stock) > 0 : true,
        });

        await newProduct.save();

        return new Response(
            JSON.stringify({
                success: true,
                product: newProduct,
                message: "Product created successfully",
            }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error creating product:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to create product",
                error: error.message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// UPDATE product
export async function updateProduct(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const sku = url.pathname.split("/").pop();
        const body = await req.json();

        if (!sku) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "SKU is required",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const product = await Product.findOne({ sku: sku.toUpperCase() });

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

        // Update fields
        const allowedUpdates = [
            "name",
            "description",
            "price",
            "image",
            "category",
            "sizes",
            "colors",
            "stock",
            "inStock",
        ];

        allowedUpdates.forEach((field) => {
            if (body[field] !== undefined) {
                product[field] = body[field];
            }
        });

        // Auto-update inStock based on stock
        if (body.stock !== undefined) {
            product.inStock = Number(body.stock) > 0;
        }

        await product.save();

        return new Response(
            JSON.stringify({
                success: true,
                product: product,
                message: "Product updated successfully",
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error updating product:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to update product",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// DELETE product
export async function deleteProduct(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const sku = url.pathname.split("/").pop();

        if (!sku) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "SKU is required",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const product = await Product.findOneAndDelete({ sku: sku.toUpperCase() });

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

        return new Response(
            JSON.stringify({
                success: true,
                message: "Product deleted successfully",
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error deleting product:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to delete product",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
