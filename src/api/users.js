import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config();

const MONGO_URI = process.env.VITE_MONGO_URI;
const DB_NAME = "pullstore_db";

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db(DB_NAME);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
}

export async function registerUser(req) {
    try {
        const body = await req.json();
        const { name, email, password } = body;
        if (!name || name.trim().length < 2) {
            return new Response(
                JSON.stringify({ success: false, message: "Name must be at least 2 characters" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!email || !email.includes('@')) {
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

        const { db } = await connectToDatabase();
        const usersCollection = db.collection("user");

        const existingUser = await usersCollection.findOne({ 
            email: email.trim().toLowerCase() 
        });

        if (existingUser) {
            return new Response(
                JSON.stringify({ success: false, message: "An account with this email already exists" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role: "user",
            emailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);

        const { password: _, ...safeUser } = newUser;
        safeUser._id = result.insertedId;

        return new Response(
            JSON.stringify({ 
                success: true, 
                user: safeUser,
                message: "Account created successfully!" 
            }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Registration error:", error);
        return new Response(
            JSON.stringify({ 
                success: false, 
                message: "An error occurred during registration" 
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

export async function loginUser(req) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return new Response(
                JSON.stringify({ success: false, message: "Email and password are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { db } = await connectToDatabase();
        const usersCollection = db.collection("user");

        const user = await usersCollection.findOne({ 
            email: email.trim().toLowerCase() 
        });

        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: "Invalid email or password" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return new Response(
                JSON.stringify({ success: false, message: "Invalid email or password" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const { password: _, ...safeUser } = user;

        return new Response(
            JSON.stringify({ 
                success: true, 
                user: safeUser 
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Login error:", error);
        return new Response(
            JSON.stringify({ 
                success: false, 
                message: "An error occurred during login" 
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
