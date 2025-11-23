import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dataLayer } from "../../lib/dataLayer";
import { Loader2, Plus } from "lucide-react";

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        sku: "",
        name: "",
        category: "",
        price: "",
        description: "",
        image: "",
        inStock: true,
        sizes: "S, M, L, XL",
        colors: "Default",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Parse sizes and colors from comma-separated strings
            const sizes = formData.sizes.split(",").map(s => s.trim()).filter(Boolean);
            const colors = formData.colors.split(",").map(c => c.trim()).filter(Boolean);

            const productData = {
                sku: formData.sku.toUpperCase(),
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                description: formData.description,
                image: formData.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300",
                sizes,
                colors,
                inStock: formData.inStock,
            };

            const result = await dataLayer.createProduct(productData);

            if (result.success) {
                navigate("/admin/products");
            } else {
                setError(result.message);
                setLoading(false);
            }
        } catch (err) {
            setError("An error occurred while adding the product");
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Add New Product</h1>
                    <p className="text-gray-500 mt-1">Create a new product for your store</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* SKU */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                SKU <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                placeholder="e.g., TEE-BLK-001"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Unique identifier for the product</p>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Classic Black Tee"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select a category</option>
                                <option value="Apparel">Apparel</option>
                                <option value="Footwear">Footwear</option>
                                <option value="Eyewear">Eyewear</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Audio">Audio</option>
                                <option value="Activewear">Activewear</option>
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price ($) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="e.g., 25.99"
                                step="0.01"
                                min="0"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Sizes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Available Sizes
                            </label>
                            <input
                                type="text"
                                name="sizes"
                                value={formData.sizes}
                                onChange={handleChange}
                                placeholder="e.g., S, M, L, XL"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Comma-separated list</p>
                        </div>

                        {/* Colors */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Available Colors
                            </label>
                            <input
                                type="text"
                                name="colors"
                                value={formData.colors}
                                onChange={handleChange}
                                placeholder="e.g., Black, White, Gray"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Comma-separated list</p>
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image URL
                        </label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty for default placeholder image</p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter product description..."
                            rows="4"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            required
                        />
                    </div>

                    {/* In Stock */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="inStock"
                            checked={formData.inStock}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Product is in stock
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4 border-t">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Adding Product...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Add Product
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/products")}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
