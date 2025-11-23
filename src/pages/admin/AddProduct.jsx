import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dataLayer } from "../../lib/dataLayer";
import { Loader2, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        <div className="p-6 md:p-12 min-h-screen bg-background">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/admin/products")}
                        className="mb-6 pl-0 hover:bg-transparent hover:text-muted-foreground uppercase font-bold text-xs tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Inventory
                    </Button>
                    <h1 className="text-5xl font-heading font-bold uppercase tracking-tighter mb-2">Add Product</h1>
                    <p className="text-muted-foreground uppercase tracking-widest text-sm font-bold">Create a new item for your store</p>
                </div>

                {error && (
                    <div className="bg-destructive/10 border-2 border-destructive text-destructive p-4 mb-8 font-bold uppercase text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="border-2 border-border bg-background p-8 md:p-12 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* SKU */}
                        <div className="space-y-2">
                            <Label className="uppercase font-bold text-xs tracking-widest">
                                SKU <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                placeholder="TEE-BLK-001"
                                className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                required
                            />
                            <p className="text-xs text-muted-foreground font-mono uppercase">Unique identifier</p>
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                            <Label className="uppercase font-bold text-xs tracking-widest">
                                Product Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="CLASSIC BLACK TEE"
                                className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label className="uppercase font-bold text-xs tracking-widest">
                                Category <span className="text-destructive">*</span>
                            </Label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full h-12 px-4 border-2 border-border bg-background rounded-none font-bold uppercase focus:outline-none focus:border-foreground appearance-none"
                                required
                            >
                                <option value="">SELECT CATEGORY</option>
                                <option value="Apparel">APPAREL</option>
                                <option value="Footwear">FOOTWEAR</option>
                                <option value="Eyewear">EYEWEAR</option>
                                <option value="Accessories">ACCESSORIES</option>
                                <option value="Audio">AUDIO</option>
                                <option value="Activewear">ACTIVEWEAR</option>
                            </select>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <Label className="uppercase font-bold text-xs tracking-widest">
                                Price ($) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="25.99"
                                step="0.01"
                                min="0"
                                className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                required
                            />
                        </div>

                        {/* Sizes */}
                        <div className="space-y-2">
                            <Label className="uppercase font-bold text-xs tracking-widest">
                                Available Sizes
                            </Label>
                            <Input
                                type="text"
                                name="sizes"
                                value={formData.sizes}
                                onChange={handleChange}
                                placeholder="S, M, L, XL"
                                className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                            />
                            <p className="text-xs text-muted-foreground font-mono uppercase">Comma-separated list</p>
                        </div>

                        {/* Colors */}
                        <div className="space-y-2">
                            <Label className="uppercase font-bold text-xs tracking-widest">
                                Available Colors
                            </Label>
                            <Input
                                type="text"
                                name="colors"
                                value={formData.colors}
                                onChange={handleChange}
                                placeholder="BLACK, WHITE, GRAY"
                                className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                            />
                            <p className="text-xs text-muted-foreground font-mono uppercase">Comma-separated list</p>
                        </div>
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                        <Label className="uppercase font-bold text-xs tracking-widest">
                            Image URL
                        </Label>
                        <Input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="HTTPS://IMAGES.UNSPLASH.COM/..."
                            className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                        />
                        <p className="text-xs text-muted-foreground font-mono uppercase">Leave empty for default placeholder</p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label className="uppercase font-bold text-xs tracking-widest">
                            Description <span className="text-destructive">*</span>
                        </Label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="ENTER PRODUCT DESCRIPTION..."
                            rows="4"
                            className="w-full px-4 py-3 border-2 border-border bg-background rounded-none font-medium focus:outline-none focus:border-foreground resize-none uppercase placeholder:normal-case"
                            required
                        />
                    </div>

                    {/* In Stock */}
                    <div className="flex items-center gap-3 border-2 border-border p-4 bg-secondary/5">
                        <input
                            type="checkbox"
                            name="inStock"
                            checked={formData.inStock}
                            onChange={handleChange}
                            className="w-5 h-5 accent-foreground rounded-none cursor-pointer"
                        />
                        <label className="uppercase font-bold text-xs tracking-widest cursor-pointer">
                            Product is in stock
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-6 border-t-2 border-border">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/admin/products")}
                            className="flex-1 h-14 uppercase font-bold border-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            variant="brutalist"
                            className="flex-1 h-14"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    ADDING...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5 mr-2" />
                                    ADD PRODUCT
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
