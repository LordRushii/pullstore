import mongoose from "mongoose";
import Category from "../models/Category.js";

const MONGO_URI = process.env.MONGO_URI;
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

// GET all categories
export async function getCategories(req) {
    try {
        await connectToDatabase();

        const categories = await Category.find({}).sort({ name: 1 }).lean();

        return new Response(
            JSON.stringify({
                success: true,
                categories: categories,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error fetching categories:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to fetch categories",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// CREATE category
export async function createCategory(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { name, description } = body;

        if (!name) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Category name is required",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Generate slug from name
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");

        // Check if category already exists
        const existingCategory = await Category.findOne({
            $or: [{ name }, { slug }],
        });

        if (existingCategory) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Category with this name already exists",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const newCategory = new Category({
            name: name.trim(),
            slug,
            description: description || "",
        });

        await newCategory.save();

        return new Response(
            JSON.stringify({
                success: true,
                category: newCategory,
                message: "Category created successfully",
            }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error creating category:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to create category",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// UPDATE category
export async function updateCategory(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();
        const body = await req.json();

        if (!id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Category ID is required",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const category = await Category.findById(id);

        if (!category) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Category not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Update fields
        if (body.name) {
            category.name = body.name.trim();
            // Regenerate slug if name changes
            category.slug = body.name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, "")
                .replace(/[\s_-]+/g, "-")
                .replace(/^-+|-+$/g, "");
        }

        if (body.description !== undefined) {
            category.description = body.description;
        }

        await category.save();

        return new Response(
            JSON.stringify({
                success: true,
                category: category,
                message: "Category updated successfully",
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error updating category:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to update category",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// DELETE category
export async function deleteCategory(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Category ID is required",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Category not found",
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
                message: "Category deleted successfully",
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error deleting category:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to delete category",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
