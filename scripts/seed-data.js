/**
 * Database Seed Script
 * Seeds the database with initial products and categories
 * 
 * Usage: npm run seed:data
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

// Complete product catalog
const products = [
    {
        sku: "TEE-WHT-CLSC",
        image: "https://images.unsplash.com/photo-1696086152504-4843b2106ab4?q=80&w=300",
        name: "Classic White Tee",
        category: "Apparel",
        price: 20,
        description: "A timeless classic. This white tee is made from 100% organic cotton, ensuring breathability and comfort all day long. Perfect for layering or wearing on its own.",
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
        description: "Step back in time with these retro-inspired white shades. UV400 protection keeps your eyes safe while you look cool.",
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
        description: "Versatile tan strap sneakers that go with everything. Durable rubber sole and comfortable insole for all-day wear.",
        sizes: ["7", "8", "9", "10", "11"],
        colors: ["Tan"],
        stock: 25,
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        sku: "GLS-AVIATOR",
        image: "https://images.unsplash.com/photo-1632168844625-b22d7b1053c0?q=80&w=300",
        name: "Aviator Style Sunglasses",
        category: "Eyewear",
        price: 40,
        description: "Classic aviator sunglasses with gold frames. A must-have accessory for any sunny day.",
        sizes: ["One Size"],
        colors: ["Gold", "Silver"],
        stock: 40,
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        sku: "TEE-BLK-JET",
        image: "https://images.unsplash.com/photo-1583656346517-4716a62e27b7?q=80&w=300",
        name: "Jet Black Tee",
        category: "Apparel",
        price: 22,
        description: "Sleek and stylish jet black tee. Fade-resistant fabric keeps it looking new wash after wash.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black"],
        stock: 55,
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        sku: "RUN-WHT-SLEEK",
        image: "https://images.unsplash.com/photo-1596480370804-cff0eed14888?q=80&w=300",
        name: "Sleek White Runners",
        category: "Footwear",
        price: 75,
        description: "Performance running shoes designed for speed and comfort. Lightweight construction with responsive cushioning.",
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["White", "Black/White"],
        stock: 0,
        inStock: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        sku: "SHIRT-BLU-CASL",
        image: "https://images.unsplash.com/photo-1740711152088-88a009e877bb?q=80&w=300",
        name: "Casual Blue Shirt",
        category: "Apparel",
        price: 28,
        description: "Relaxed fit blue shirt, perfect for casual Fridays or weekend outings. Soft linen blend.",
        sizes: ["M", "L", "XL"],
        colors: ["Blue"],
        stock: 35,
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        sku: "SNKRS-EVRDY",
        image: "https://images.unsplash.com/photo-1696086152508-1711cc7bcc9d?q=80&w=300",
        name: "Everyday Sneakers",
        category: "Footwear",
        price: 60,
        description: "Your go-to sneakers for everyday activities. Simple design, maximum comfort.",
        sizes: ["6", "7", "8", "9", "10"],
        colors: ["Gray", "Navy"],
        stock: 45,
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        sku: "GLS-CRYSTAL",
        image: "https://images.unsplash.com/photo-1684790369514-f292d2dffc11?q=80&w=300",
        name: "Crystal Frame Glasses",
        category: "Eyewear",
        price: 35,
        description: "Trendy crystal clear frames. Lightweight and durable.",
        sizes: ["One Size"],
        colors: ["Clear"],
        stock: 25,
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        sku: "DRS-RED-ELEGNT",
        image: "https://images.unsplash.com/photo-1589810635657-232948472d98?q=80&w=300",
        name: "Elegant Red Dress",
        category: "Apparel",
        price: 50,
        description: "Stunning red dress for special occasions. Flattering silhouette and premium fabric.",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Red"],
        stock: 20,
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        sku: "LGG-RED-YOGA",
        image: "https://images.unsplash.com/photo-1590159983013-d4ff5fc71c1d?q=80&w=300",
        name: "Red Yoga Leggings",
        category: "Activewear",
        price: 35,
        description: "High-waisted yoga leggings in vibrant red. Moisture-wicking fabric keeps you dry during workouts.",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Red", "Black"],
        stock: 60,
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        sku: "HPHN-PNK-BLSH",
        image: "https://images.unsplash.com/photo-1617460237920-ea0b1bad4b0a?q=80&w=300",
        name: "Blush Pink Headphones",
        category: "Audio",
        price: 90,
        description: "Premium wireless headphones in a beautiful blush pink. Noise-cancelling technology for immersive sound.",
        sizes: ["One Size"],
        colors: ["Pink", "Black", "White"],
        stock: 15,
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        sku: "EARBDS-WIRELS",
        image: "https://images.unsplash.com/photo-1614288064424-11d2d386c474?q=80&w=300",
        name: "Wireless Earbuds",
        category: "Audio",
        price: 60,
        description: "Compact wireless earbuds with charging case. Great sound quality and long battery life.",
        sizes: ["One Size"],
        colors: ["White", "Black"],
        stock: 50,
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        sku: "WTCH-BRN-ANLG",
        image: "https://images.unsplash.com/photo-1650779456233-fc579766337c?q=80&w=300",
        name: "Analog Leather Watch",
        category: "Accessories",
        price: 110,
        description: "Sophisticated analog watch with a genuine brown leather strap. Water-resistant.",
        sizes: ["One Size"],
        colors: ["Brown"],
        stock: 18,
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        sku: "WTCH-APL-SMRT",
        image: "https://images.unsplash.com/photo-1704942968209-6c1e05ef3f95?q=80&w=300",
        name: "Smart Fitness Watch",
        category: "Accessories",
        price: 150,
        description: "Track your fitness goals with this advanced smart watch. Heart rate monitor, GPS, and more.",
        sizes: ["One Size"],
        colors: ["Black", "Silver"],
        stock: 22,
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
    {
        name: "Audio",
        slug: "audio",
        description: "Headphones and audio equipment",
        createdAt: new Date(),
    },
    {
        name: "Activewear",
        slug: "activewear",
        description: "Workout and athletic clothing",
        createdAt: new Date(),
    },
];

async function seedData() {
    if (!MONGO_URI) {
        console.error("❌ Error: VITE_MONGO_URI not found in environment variables");
        process.exit(1);
    }

    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);

        // Seed products
        const productsCollection = db.collection("products");
        
        const existingProducts = await productsCollection.countDocuments();
        if (existingProducts > 0) {
            await productsCollection.deleteMany({});
        }
        
        await productsCollection.insertMany(products);

        // Seed categories
        const categoriesCollection = db.collection("categories");
        
        const existingCategories = await categoriesCollection.countDocuments();
        if (existingCategories > 0) {
            await categoriesCollection.deleteMany({});
        }
        
        await categoriesCollection.insertMany(categories);

        // Create indexes
        await productsCollection.createIndex({ sku: 1 }, { unique: true });
        await productsCollection.createIndex({ category: 1 });
        await productsCollection.createIndex({ name: "text", description: "text" });

        await categoriesCollection.createIndex({ slug: 1 }, { unique: true });
        await categoriesCollection.createIndex({ name: 1 }, { unique: true });

        console.log(`Database seeded: ${products.length} products, ${categories.length} categories`);

    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

seedData()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error("Seed script failed:", error);
        process.exit(1);
    });
