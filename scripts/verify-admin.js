/**
 * Verify Admin User Script
 * Checks if admin exists in the database
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

async function verifyAdmin() {
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const userCollection = db.collection("user");

        console.log("🔍 Checking database for users...\n");

        const allUsers = await userCollection.find({}).toArray();
        
        console.log(`📊 Total users in database: ${allUsers.length}\n`);

        allUsers.forEach((user, index) => {
            console.log(`👤 User ${index + 1}:`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Active: ${user.isActive}`);
            console.log(`   ID: ${user._id}`);
            console.log('');
        });

        const admin = allUsers.find(u => u.role === "admin");
        if (admin) {
            console.log("✅ Admin user found!");
            console.log("🔐 You can login with:");
            console.log(`   Email: ${admin.email}`);
            console.log(`   Password: admin123456`);
        } else {
            console.log("⚠️  No admin user found. Run: npm run seed:admin");
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await client.close();
    }
}

verifyAdmin();
