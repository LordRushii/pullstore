import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

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

// REGISTER USER
export async function registerUser(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { name, email, password } = body;

        // Validation
        if (!name || name.trim().length < 2) {
            return new Response(
                JSON.stringify({ success: false, message: "Name must be at least 2 characters" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!email || !email.includes("@")) {
            return new Response(
                JSON.stringify({ success: false, message: "Please enter a valid email address" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!password || password.length < 6) {
            return new Response(
                JSON.stringify({ success: false, message: "Password must be at least 6 characters" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            email: email.trim().toLowerCase(),
        });

        if (existingUser) {
            return new Response(
                JSON.stringify({ success: false, message: "An account with this email already exists" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role: "user",
            emailVerified: false,
            isActive: true,
        });

        await newUser.save();

        // Return user without password
        const safeUser = newUser.toSafeObject();

        return new Response(
            JSON.stringify({ 
                success: true, 
                user: safeUser,
                message: "Account created successfully!",
            }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return new Response(
            JSON.stringify({ 
                success: false, 
                message: "An error occurred during registration",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

// LOGIN USER
export async function loginUser(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return new Response(
                JSON.stringify({ success: false, message: "Email and password are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Find user by email
        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        });

        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: "Invalid email or password" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if user is active
        if (!user.isActive) {
            return new Response(
                JSON.stringify({ success: false, message: "Account is deactivated. Please contact support." }),
                { status: 403, headers: { "Content-Type": "application/json" } }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return new Response(
                JSON.stringify({ success: false, message: "Invalid email or password" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Return user without password
        const safeUser = user.toSafeObject();

        return new Response(
            JSON.stringify({ 
                success: true, 
                user: safeUser,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Login error:", error);
        return new Response(
            JSON.stringify({ 
                success: false, 
                message: "An error occurred during login",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

// GET USER PROFILE
export async function getUserProfile(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");

        if (!userId) {
            return new Response(
                JSON.stringify({ success: false, message: "userId is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const user = await User.findById(userId);

        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        const safeUser = user.toSafeObject();

        return new Response(
            JSON.stringify({
                success: true,
                user: safeUser,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Get user profile error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to fetch user profile",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

// UPDATE USER PROFILE
export async function updateUserProfile(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { userId, name, phone, address, avatar } = body;

        if (!userId) {
            return new Response(
                JSON.stringify({ success: false, message: "userId is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const user = await User.findById(userId);

        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Update allowed fields
        if (name) user.name = name.trim();
        if (phone !== undefined) user.phone = phone;
        if (address) user.address = address;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();

        const safeUser = user.toSafeObject();

        return new Response(
            JSON.stringify({
                success: true,
                user: safeUser,
                message: "Profile updated successfully",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Update profile error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to update profile",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

// CHANGE PASSWORD
export async function changePassword(req) {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { userId, currentPassword, newPassword } = body;

        if (!userId || !currentPassword || !newPassword) {
            return new Response(
                JSON.stringify({ success: false, message: "All fields are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        if (newPassword.length < 6) {
            return new Response(
                JSON.stringify({ success: false, message: "New password must be at least 6 characters" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const user = await User.findById(userId);

        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return new Response(
                JSON.stringify({ success: false, message: "Current password is incorrect" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        // Hash and update new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return new Response(
            JSON.stringify({
                success: true,
                message: "Password changed successfully",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Change password error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to change password",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

// GET ALL USERS (Admin only)
export async function getAllUsers(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const role = url.searchParams.get("role");
        const isActive = url.searchParams.get("isActive");
        const limit = parseInt(url.searchParams.get("limit") || "100");
        const page = parseInt(url.searchParams.get("page") || "1");

        let query = {};

        if (role) {
            query.role = role;
        }

        if (isActive !== null && isActive !== undefined) {
            query.isActive = isActive === "true";
        }

        const skip = (page - 1) * limit;

        const users = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean();

        const totalUsers = await User.countDocuments(query);

        return new Response(
            JSON.stringify({
                success: true,
                users: users,
                pagination: {
                    page,
                    limit,
                    total: totalUsers,
                    pages: Math.ceil(totalUsers / limit),
                },
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Get all users error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to fetch users",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

// UPDATE USER (Admin only)
export async function updateUser(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const userId = url.pathname.split("/").pop();
        const body = await req.json();

        if (!userId) {
            return new Response(
                JSON.stringify({ success: false, message: "userId is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const user = await User.findById(userId);

        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Admin can update more fields
        const allowedUpdates = ["name", "email", "phone", "address", "role", "isActive", "avatar"];

        allowedUpdates.forEach((field) => {
            if (body[field] !== undefined) {
                if (field === "email") {
                    user[field] = body[field].trim().toLowerCase();
                } else {
                    user[field] = body[field];
                }
            }
        });

        await user.save();

        const safeUser = user.toSafeObject();

        return new Response(
            JSON.stringify({
                success: true,
                user: safeUser,
                message: "User updated successfully",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Update user error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to update user",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

// DELETE USER (Admin only)
export async function deleteUser(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const userId = url.pathname.split("/").pop();

        if (!userId) {
            return new Response(
                JSON.stringify({ success: false, message: "userId is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "User deleted successfully",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Delete user error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to delete user",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
