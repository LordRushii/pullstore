import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Check, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { dataLayer } from "../lib/dataLayer";

const ProductDetail = () => {
    const { sku } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            const p = await dataLayer.getProductBySku(sku);
            setProduct(p);
            if (p) {
                setSelectedSize(p.sizes?.[0]);
                setSelectedColor(p.colors?.[0]);
            }
            setLoading(false);
        };
        loadProduct();
    }, [sku]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Product not found</h2>
                <button onClick={() => navigate("/shop")} className="text-primary hover:underline">
                    Back to Shop
                </button>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: location } });
            return;
        }

        setIsAdding(true);
        setTimeout(() => {
            setIsAdding(false);
            addToCart(product, selectedSize, selectedColor);
            // alert("Added to cart!"); // Optional: replace with toast
        }, 1000);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-black/10 transition-all">
                                <img
                                    src={product.image}
                                    alt={`${product.name} view ${i}`}
                                    className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <div className="mb-8">
                        <p className="text-sm text-gray-500 font-medium mb-2 uppercase tracking-wider">{product.category}</p>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
                        <p className="text-3xl font-semibold">${product.price}</p>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-8">
                        {product.description || "Experience premium quality and style with this exceptional piece. Designed for comfort and durability, it's the perfect addition to your collection."}
                    </p>

                    <div className="space-y-6 mb-8">
                        {/* Sizes */}
                        {product.sizes && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Select Size</label>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedSize === size
                                                ? "border-black bg-black text-white"
                                                : "border-gray-200 hover:border-gray-300 text-gray-700"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Colors */}
                        {product.colors && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Select Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedColor === color
                                                ? "border-black bg-black text-white"
                                                : "border-gray-200 hover:border-gray-300 text-gray-700"
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={!product.inStock || isAdding}
                            className="flex-1 bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAdding ? (
                                <>Adding...</>
                            ) : !product.inStock ? (
                                "Out of Stock"
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </>
                            )}
                        </button>
                        <button className="px-6 py-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                            <span className="sr-only">Save for later</span>
                            <Heart className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" /> Free Shipping
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" /> 30-Day Returns
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" /> Secure Checkout
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" /> Authentic Products
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
