import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Check, Heart, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
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
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    // For desktop main image
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const containerRef = useRef(null);
    const detailsRef = useRef(null);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    const scrollPrev = () => {
        if (emblaApi) emblaApi.scrollPrev();
    };

    const scrollNext = () => {
        if (emblaApi) emblaApi.scrollNext();
    };

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

    const sliderRef = useRef(null);

    useGSAP(() => {
        if (sliderRef.current) {
            gsap.to(sliderRef.current, {
                xPercent: -100 * currentImageIndex,
                duration: 0.5,
                ease: "power2.out"
            });
        }
    }, [currentImageIndex]);

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
            addToCart(product, selectedSize, selectedColor, quantity);
        }, 1000);
    };

    // Mock images for gallery (using the same image for now)
    const galleryImages = [product.image, product.image, product.image, product.image];

    // Mock data for display
    const rating = 4.8;
    const reviewCount = 124;
    const originalPrice = Math.round(product.price * 1.2); // 20% higher
    const discount = 20;

    return (
        <div className="min-h-screen bg-background" ref={containerRef}>
            {/* Mobile Layout (< 1024px) - Preserved exactly as requested */}
            <div className="lg:hidden grid grid-cols-1 min-h-screen">
                {/* Image Gallery (Carousel) */}
                <div className="order-1 bg-secondary/20 relative group">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>

                    <div className="overflow-hidden aspect-[3/4] touch-pan-y" ref={emblaRef}>
                        <div className="flex h-full">
                            {galleryImages.map((img, index) => (
                                <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
                                    <div className="absolute inset-0">
                                        <img
                                            src={img}
                                            alt={`${product.name} view ${index + 1}`}
                                            className="w-full h-full object-cover select-none"
                                            draggable={false}
                                            onMouseDown={(e) => e.preventDefault()}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Navigation Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {galleryImages.slice(0, 3).map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full bg-background/50" />
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div className="order-2 p-8 flex flex-col justify-center border-t-2 border-border" ref={detailsRef}>
                    <div className="mb-8">
                        <p className="text-sm text-muted-foreground font-bold mb-2 uppercase tracking-widest">{product.category}</p>
                        <h1 className="text-5xl font-heading font-bold uppercase tracking-tighter mb-6 leading-[0.9]">{product.name}</h1>
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
                </div>
            </div>

            {/* Desktop Layout (>= 1024px) - New 3-Column Structure */}
            <div className="hidden lg:grid grid-cols-12 gap-8 px-8 py-12 max-w-[1800px] mx-auto min-h-screen">

                {/* Left Column: Vertical Thumbnail Gallery (col-span-1 or 2) */}
                <div className="col-span-1 flex flex-col gap-4 sticky top-24 h-fit">
                    {galleryImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative aspect-square w-full overflow-hidden border-2 transition-all ${currentImageIndex === index ? "border-foreground opacity-100" : "border-transparent opacity-70 hover:opacity-100"
                                }`}
                        >
                            <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>

                {/* Center Column: Main Image (col-span-7) */}
                <div className="col-span-7 relative bg-secondary/10 h-[calc(100vh-6rem)] sticky top-24 overflow-hidden group">
                    <div ref={sliderRef} className="flex h-full w-full">
                        {galleryImages.map((img, index) => (
                            <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
                                <img
                                    src={img}
                                    alt={`${product.name} view ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Overlay Arrows */}
                    <button
                        onClick={() => setCurrentImageIndex(prev => prev === 0 ? galleryImages.length - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setCurrentImageIndex(prev => prev === galleryImages.length - 1 ? 0 : prev + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Right Column: Product Details (col-span-4) */}
                <div className="col-span-4 sticky top-24 h-fit pl-8">
                    {/* Breadcrumbs */}
                    <nav className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-6">
                        Home / {product.category} / {product.name}
                    </nav>

                    {/* Title */}
                    <h1 className="text-5xl font-heading font-bold uppercase tracking-tighter mb-4 leading-none">
                        {product.name}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-current" : "text-gray-300"}`} viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-sm font-bold text-muted-foreground">{rating} ({reviewCount} reviews)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-4xl font-bold">${product.price}</span>
                        <span className="text-xl text-muted-foreground line-through">${originalPrice}</span>
                        <span className="bg-red-100 text-red-600 px-2 py-1 text-xs font-bold rounded uppercase">
                            {discount}% OFF
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-8">
                        {product.description || "Elevate your living space with our Premium Comfort Lounge Chair. Crafted with meticulous attention to detail, this chair combines timeless design with exceptional comfort."}
                    </p>

                    {/* Color Selector */}
                    {product.colors && (
                        <div className="mb-8">
                            <div className="flex justify-between mb-3">
                                <label className="text-sm font-bold uppercase tracking-widest">Color</label>
                                <span className="text-sm text-muted-foreground">{selectedColor}</span>
                            </div>
                            <div className="flex gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color ? "ring-2 ring-offset-2 ring-foreground border-transparent" : "border-border hover:border-foreground"
                                            }`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        title={color}
                                        aria-label={`Select color ${color}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size Selector */}
                    {product.sizes && (
                        <div className="mb-8">
                            <div className="flex justify-between mb-3">
                                <label className="text-sm font-bold uppercase tracking-widest">Size</label>
                                <button className="text-sm underline text-muted-foreground hover:text-foreground">Size Guide</button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-6 py-3 border-2 text-sm font-bold transition-all ${selectedSize === size
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

                    {/* Quantity */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold uppercase tracking-widest mb-3">Quantity</label>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border-2 border-border rounded-md">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 hover:bg-secondary/50 transition-colors"
                                >-</button>
                                <span className="px-4 py-2 font-bold min-w-[3rem] text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-2 hover:bg-secondary/50 transition-colors"
                                >+</button>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {product.inStock ? "In stock - ships within 2-3 days" : "Out of stock"}
                            </span>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <Button
                        onClick={handleAddToCart}
                        disabled={!product.inStock || isAdding}
                        size="lg"
                        className="w-full h-14 text-lg mb-8"
                        variant="brutalist"
                    >
                        {isAdding ? "Adding..." : !product.inStock ? "Out of Stock" : `Add to Cart`}
                    </Button>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-4 text-xs font-bold text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-orange-500" /> Free Shipping
                        </div>
                        <div className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4 text-blue-500" /> 30-Day Returns
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-green-500" /> 5-Year Warranty
                        </div>
                        <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-500" /> 24/7 Support
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
