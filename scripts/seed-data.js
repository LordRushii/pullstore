/**
 * Database Seed Script
 * Seeds the database with initial products and categories
 * 
 * Usage: node scripts/seed-data.js
 */

import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../.env") });

const MONGO_URI = process.env.VITE_MONGO_URI;
const DB_NAME = "pullstore_db";

// Sample products
const products = [
    {
        sku: "TEE-WHT-CLSC",
        image: "https://images.unsplash.com/photo-1696086152504-4843b2106ab4?q=80&w=300",
        name: "Classic White Tee",
        category: "Apparel",
        price: 20,
        description: "A timeless classic. This white tee is made from 100% organic cotton, ensuring breathability and comfort all day long.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Black", "Gray"],
        stock: 50,
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        sku: "GLS-WHT-RETRO",
        image: "https://images.unsplash.com/photo-1648688135643-2716ec8f4b24?q=80&w=300",
        name: "Retro White Shades",
        category: "Eyewear",
        price: 30,
        description: "Step back in time with these retro-inspired white shades. UV400 protection keeps your eyes safe.",
        sizes: ["One Size"],
        colors: ["White"],
        stock: 30,
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        sku: "SHO-TAN-STRAP",
        image: "https://images.unsplash.com/photo-1631984564919-1f6b2313a71c?q=80&w=300",
        name: "Tan Strap Sneakers",
        category: "Footwear",
        price: 65,
        description: "Versatile tan strap sneakers that go with everything. Durable rubber sole and comfortable insole.",
        sizes: ["7", "8", "9", "10", "11"],
        colors: ["Tan"],
        stock: 25,
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// Categories
const categories = [
    {
        name: "Apparel",
        slug: "apparel",
        description: "Clothing and fashion items",
        createdAt: new Date(),
    },
    {
        name: "Footwear",
        slug: "footwear",
        description: "Shoes and sneakers",
        createdAt: new Date(),
    },
    {
        name: "Eyewear",
        slug: "eyewear",
        description: "Sunglasses and glasses",
        createdAt: new Date(),
    },
    {
        name: "Accessories",
        slug: "accessories",
        description: "Watches, bags, and more",
        createdAt: new Date(),
    },
];

async function seedData() {
    if (!MONGO_URI) {
        console.error("❌ Error: VITE_MONGO_URI not found in environment variables");
        process.exit(1);
    }

    console.log("🔌 Connecting to MongoDB...");
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db(DB_NAME);

        // Seed products
        console.log("\n📦 Seeding products...");
        const productsCollection = db.collection("products");
        
        const existingProducts = await productsCollection.countDocuments();
        if (existingProducts > 0) {
            console.log(`⚠️  ${existingProducts} products already exist. Skipping product seeding.`);
        } else {
            await productsCollection.insertMany(products);
            console.log(`✅ Inserted ${products.length} products`);
        }

        // Seed categories
        console.log("\n🏷️  Seeding categories...");
        const categoriesCollection = db.collection("categories");
        
        const existingCategories = await categoriesCollection.countDocuments();
        if (existingCategories > 0) {
            console.log(`⚠️  ${existingCategories} categories already exist. Skipping category seeding.`);
        } else {
            await categoriesCollection.insertMany(categories);
            console.log(`✅ Inserted ${categories.length} categories`);
        }

        console.log("\n✅ Database seeded successfully!");

    } catch (error) {
        console.error("❌ Error seeding data:", error);
        process.exit(1);
    } finally {
        await client.close();
        console.log("\n🔌 Disconnected from MongoDB");
    }
}

console.log("🌱 Starting database seed script...\n");
seedData()
    .then(() => {
        console.log("\n✨ Seed script completed!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Seed script failed:", error);
        process.exit(1);
    });
