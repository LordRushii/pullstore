import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        phone: {
            type: String,
            trim: true,
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
        },
        avatar: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
        },
    },
    {
        timestamps: true,
        collection: "user", // Explicitly set collection name to match existing data
    }
);

// Index for faster lookups
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Method to get user without password
userSchema.methods.toSafeObject = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
