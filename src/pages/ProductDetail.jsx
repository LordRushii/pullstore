import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Check, Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { dataLayer } from "../lib/dataLayer";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const containerRef = useRef(null);
    const detailsRef = useRef(null);

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

    useGSAP(() => {
        if (!loading && product) {
            gsap.from(detailsRef.current.children, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.2
            });
        }
    }, [loading, product]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-2xl font-heading font-bold uppercase animate-pulse" role="status">Loading Product...</div>;
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-4xl font-heading font-bold uppercase mb-4">Product not found</h2>
                <Button onClick={() => navigate("/shop")} variant="link">
                    Back to Shop
                </Button>
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
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-background" ref={containerRef}>
            <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-5rem)] overflow-hidden">
                {/* Left: Sticky Details */}
                <div className="order-2 lg:order-1 p-8 lg:p-16 h-full flex flex-col border-r-2 border-border overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" ref={detailsRef}>
                    <div className="min-h-full flex flex-col justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors uppercase font-bold text-xs tracking-widest w-fit"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>

                        <div className="mb-8 mt-4">
                            <p className="text-sm text-muted-foreground font-bold mb-2 uppercase tracking-widest">{product.category}</p>
                            <h1 className="text-5xl md:text-7xl font-heading font-bold uppercase tracking-tighter mb-6 leading-[0.9] pt-2">{product.name}</h1>
                            <p className="text-4xl font-bold" aria-label={`Price: $${product.price}`}>${product.price}</p>
                        </div>

                        <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-md">
                            {product.description || "Experience premium quality and style with this exceptional piece. Designed for comfort and durability, it's the perfect addition to your collection."}
                        </p>

                        <div className="space-y-8 mb-10">
                            {/* Sizes */}
                            {product.sizes && (
                                <div role="group" aria-label="Select Size">
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-3">Select Size</label>
                                    <div className="flex flex-wrap gap-3">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                aria-pressed={selectedSize === size}
                                                className={`w-12 h-12 flex items-center justify-center border-2 text-sm font-bold transition-all ${selectedSize === size
                                                    ? "border-foreground bg-foreground text-background"
                                                    : "border-border hover:border-foreground text-foreground"
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
                                <div role="group" aria-label="Select Color">
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-3">Select Color</label>
                                    <div className="flex flex-wrap gap-3">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                aria-pressed={selectedColor === color}
                                                className={`px-6 py-3 border-2 text-sm font-bold uppercase transition-all ${selectedColor === color
                                                    ? "border-foreground bg-foreground text-background"
                                                    : "border-border hover:border-foreground text-foreground"
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
                            <Button
                                onClick={handleAddToCart}
                                disabled={!product.inStock || isAdding}
                                size="lg"
                                className="flex-1 h-16 text-lg"
                                variant="brutalist"
                                aria-label={!product.inStock ? "Out of stock" : "Add to cart"}
                            >
                                {isAdding ? (
                                    <>Adding...</>
                                ) : !product.inStock ? (
                                    "Out of Stock"
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Add to Cart
                                    </>
                                )}
                            </Button>
                            <Button size="icon-lg" variant="outline" className="h-16 w-16 border-2" aria-label="Add to wishlist">
                                <Heart className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="mt-12 pt-8 border-t-2 border-border grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-accent" /> Free Shipping
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-accent" /> 30-Day Returns
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-accent" /> Secure Checkout
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-accent" /> Authentic
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Image Carousel */}
                <div className="order-1 lg:order-2 bg-secondary/20 h-full overflow-hidden relative group">
                    <div
                        className="flex h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        onScroll={(e) => {
                            const scrollLeft = e.currentTarget.scrollLeft;
                            const width = e.currentTarget.offsetWidth;
                            const index = Math.round(scrollLeft / width);
                            setCurrentImageIndex(index);
                        }}
                    >
                        <div className="min-w-full h-full relative snap-center border-r-2 border-border last:border-r-0">
                            <img
                                src={product.image}
                                alt={product.name}
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {[1, 2].map((i) => (
                            <div key={i} className="min-w-full h-full relative snap-center border-r-2 border-border last:border-r-0">
                                <img
                                    src={product.image}
                                    alt={`${product.name} view ${i}`}
                                    loading="lazy"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Carousel Indicators */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10 p-2 bg-background/50 backdrop-blur-sm border border-border rounded-full">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentImageIndex === i
                                        ? "bg-accent scale-125"
                                        : "bg-foreground/50 hover:bg-foreground"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
