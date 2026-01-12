/**
 * Database Cleanup Script
 * Removes duplicate collections and consolidates to 'user' collection
 * 
 * Usage: node scripts/cleanup-db.js
 */

import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env") });

const MONGO_URI = process.env.VITE_MONGO_URI;
const DB_NAME = "pullstore_db";

async function cleanupDatabase() {
    if (!MONGO_URI) {
        console.error("❌ Error: VITE_MONGO_URI not found in environment variables");
        process.exit(1);
    }

    console.log("🧹 Starting database cleanup...\n");
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db(DB_NAME);

        // Get all collections
        const collections = await db.listCollections().toArray();
        console.log("\n📋 Current collections:");
        collections.forEach(col => console.log(`   - ${col.name}`));

        // Drop the duplicate 'users' collection if it exists
        const usersExists = collections.some(col => col.name === "users");
        if (usersExists) {
            console.log("\n🗑️  Dropping duplicate 'users' collection...");
            await db.collection("users").drop();
            console.log("✅ Dropped 'users' collection");
        }

        // Ensure 'user' collection exists (will be created on first insert)
        const userCollection = db.collection("user");
        const userCount = await userCollection.countDocuments();
        console.log(`\n✅ Using 'user' collection (${userCount} documents)`);

        console.log("\n✅ Database cleanup completed!");
        console.log("\n📊 Final structure:");
        console.log("   - user (for all users and admins)");
        console.log("   - products");
        console.log("   - categories");
        console.log("   - carts (will be created when needed)");
        console.log("   - orders (will be created when needed)");

    } catch (error) {
        console.error("❌ Error during cleanup:", error);
        process.exit(1);
    } finally {
        await client.close();
        console.log("\n🔌 Disconnected from MongoDB");
    }
}

console.log("🧹 Database Cleanup Script\n");
cleanupDatabase()
    .then(() => {
        console.log("\n✨ Cleanup completed!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Cleanup failed:", error);
        process.exit(1);
    });
