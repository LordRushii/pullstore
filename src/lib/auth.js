import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { config } from "dotenv";

if (typeof process !== 'undefined') {
    config();
}

function getMongoURI() {
    if (typeof process !== 'undefined' && process.env?.MONGO_URI) {
        return process.env.MONGO_URI;
    }
    return null;
}

const MONGO_URI = getMongoURI();

if (!MONGO_URI) {
    throw new Error(
        "MONGO_URI is not defined in environment variables. " +
        "Please create a .env file with your MongoDB connection string."
    );
}

const mongoClient = new MongoClient(MONGO_URI);

export const auth = betterAuth({
    database: mongodbAdapter(mongoClient, {
        databaseName: "pullstore_db",
    }),
    
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
                required: false,
            },
        },
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5,
        },
    },

    socialProviders: {},

    advanced: {
        generateId: false,
    },
});
