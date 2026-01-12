import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster lookups
categorySchema.index({ slug: 1 });
categorySchema.index({ name: 1 });

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
