/**
 * Admin User Seed Script
 * Run this script once to create the initial admin user
 * 
 * Usage: node scripts/seed-admin.js
 */

import { MongoClient } from "mongodb";
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
    createdAt: new Date(),
    updatedAt: new Date(),
};

async function seedAdmin() {
    if (!MONGO_URI) {
        console.error("❌ Error: VITE_MONGO_URI not found in environment variables");
        console.log("Please create a .env file with your MongoDB connection string");
        process.exit(1);
    }

    console.log("🔌 Connecting to MongoDB...");
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db(DB_NAME);
        const usersCollection = db.collection("user");

        // Check if admin already exists
        const existingAdmin = await usersCollection.findOne({ 
            email: ADMIN_USER.email 
        });

        if (existingAdmin) {
            console.log("⚠️  Admin user already exists!");
            console.log(`📧 Email: ${existingAdmin.email}`);
            console.log(`👤 Name: ${existingAdmin.name}`);
            console.log(`🔑 Role: ${existingAdmin.role}`);
            console.log("\nℹ️  If you want to reset the admin password, delete the user from MongoDB and run this script again.");
            return;
        }

        // Hash password
        console.log("🔐 Hashing password...");
        const hashedPassword = await bcrypt.hash(ADMIN_USER.password, 10);

        // Create admin user
        const adminUser = {
            ...ADMIN_USER,
            password: hashedPassword,
        };

        console.log("👤 Creating admin user...");
        const result = await usersCollection.insertOne(adminUser);

        console.log("\n✅ Admin user created successfully!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📧 Email:", ADMIN_USER.email);
        console.log("🔑 Password:", ADMIN_USER.password);
        console.log("🆔 User ID:", result.insertedId);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\n⚠️  IMPORTANT: Change the default password after first login!");
        console.log("💡 You can now login with these credentials at /login");

    } catch (error) {
        console.error("❌ Error seeding admin user:", error);
        process.exit(1);
    } finally {
        await client.close();
        console.log("\n🔌 Disconnected from MongoDB");
    }
}

// Run the seed script
console.log("🌱 Starting admin user seed script...\n");
seedAdmin()
    .then(() => {
        console.log("\n✨ Seed script completed!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Seed script failed:", error);
        process.exit(1);
    });
