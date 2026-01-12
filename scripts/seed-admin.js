/**
 * Admin User Seed Script
 * Run this script once to create the initial admin user
 * 
 * Usage: npm run seed:admin
 */

import mongoose from "mongoose";
import * as bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: join(__dirname, "../.env") });

const MONGO_URI = process.env.VITE_MONGO_URI;
const DB_NAME = "pullstore_db";

// Admin user configuration
const ADMIN_USER = {
    name: "Admin User",
    email: "admin@pullstore.com",
    password: "admin123456", // Change this to a secure password
    role: "admin",
    emailVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};

// User schema (inline for seeding)
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        emailVerified: { type: Boolean, default: false },
        phone: String,
        address: Object,
        avatar: String,
        isActive: { type: Boolean, default: true },
        lastLogin: Date,
    },
    { 
        timestamps: true,
        collection: "user" // Use singular 'user' collection name
    }
);

async function seedAdmin() {
    if (!MONGO_URI) {
        console.error("❌ Error: VITE_MONGO_URI not found in environment variables");
        console.log("Please create a .env file with your MongoDB connection string");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI, {
            dbName: DB_NAME,
        });

        const User = mongoose.models.User || mongoose.model("User", userSchema);

        // Check if admin already exists
        const existingAdmin = await User.findOne({
            email: ADMIN_USER.email,
        });

        if (existingAdmin) {
            console.log("Admin user already exists. Email:", existingAdmin.email);
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(ADMIN_USER.password, 10);

        // Create admin user
        const adminUser = new User({
            ...ADMIN_USER,
            password: hashedPassword,
        });

        await adminUser.save();

        console.log("Admin user created successfully!");
        console.log("Email:", ADMIN_USER.email);
        console.log("Password:", ADMIN_USER.password);
    } catch (error) {
        console.error("❌ Error seeding admin user:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

seedAdmin()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error("Seed script failed:", error);
        process.exit(1);
    });
