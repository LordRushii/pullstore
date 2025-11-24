import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { dataLayer } from "../lib/dataLayer";
import ProductCard from "../components/product-card";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const marqueeRef = useRef(null);

    useEffect(() => {
        const loadProducts = async () => {
            const products = await dataLayer.getProducts();
            setFeaturedProducts(products.slice(0, 4));
        };
        loadProducts();
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from(textRef.current.children, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power4.out"
        });

        // Marquee Animation
        gsap.to(marqueeRef.current, {
            xPercent: -50,
            repeat: -1,
            duration: 20,
            ease: "linear",
        });

        gsap.from(".featured-item", {
            scrollTrigger: {
                trigger: ".featured-section",
                start: "top 75%",
            },
            y: 60,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out"
        });

        gsap.from(".category-card", {
            scrollTrigger: {
                trigger: ".category-section",
                start: "top 80%",
            },
            scale: 0.95,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "expo.out"
        });

    }, { scope: heroRef });

    return (
        <div className="flex flex-col min-h-screen" ref={heroRef}>
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background border-b-2 border-border" aria-label="Hero Section">
                <div className="absolute inset-0 z-0" aria-hidden="true">
                    <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
                    {/* Abstract Shapes */}
                    <div className="absolute top-20 left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto" ref={textRef}>
                    <div className="mb-6 inline-flex items-center gap-2 border border-border px-4 py-1 rounded-full bg-background/50 backdrop-blur-sm">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-xs font-bold uppercase tracking-widest">New Collection 2025</span>
                    </div>
                    <h1 className="text-6xl md:text-9xl font-heading font-bold tracking-tighter mb-8 leading-[0.9]">
                        REDEFINE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/50">YOUR REALITY</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 text-muted-foreground max-w-2xl mx-auto font-light">
                        Premium apparel for the modern avant-garde.
                        Designed in Tokyo. Crafted for the world.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/shop" tabIndex="-1">
                            <Button size="lg" className="w-full sm:w-auto text-lg h-16 px-10" aria-label="Shop Collection">
                                Shop Collection
                            </Button>
                        </Link>
                        <Link to="/shop?category=new" tabIndex="-1">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-16 px-10" aria-label="View Lookbook">
                                View Lookbook
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Marquee / Ticker */}
            <div className="bg-primary text-primary-foreground py-4 overflow-hidden border-b-2 border-border" aria-hidden="true">
                <div ref={marqueeRef} className="flex gap-8 text-2xl font-heading font-bold uppercase tracking-widest w-max">
                    {/* Content duplicated for seamless loop */}
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-8 shrink-0">
                            <span>New Arrivals</span>
                            <span>•</span>
                            <span>Free Shipping Worldwide</span>
                            <span>•</span>
                            <span>Limited Edition</span>
                            <span>•</span>
                        </div>
                    ))}
                </div>
            </div>
            {/* Featured Products */}
            <section className="py-24 bg-background featured-section" aria-label="Featured Products">
                <div className="container-wide">
                    <div className="flex justify-between items-end mb-16 border-b border-border pb-6">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter mb-2">Selected Works</h2>
                            <p className="text-muted-foreground uppercase tracking-widest text-sm">Curated for the bold</p>
                        </div>
                        <Link to="/shop" aria-label="View all products">
                            <Button variant="link" className="text-lg">
                                View All <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {featuredProducts.map((product) => (
                            <div key={product.sku} className="featured-item">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories / Banners */}
            <section className="grid grid-cols-1 md:grid-cols-2 min-h-[600px] border-y-2 border-border category-section" aria-label="Categories">
                <div className="relative group overflow-hidden border-b md:border-b-0 md:border-r-2 border-border category-card">
                    <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000"
                        alt="Women's Fashion"
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        <Link to="/shop?category=women" tabIndex="-1">
                            <Button variant="brutalist" size="lg" className="text-2xl h-20 px-12" aria-label="Shop Women">
                                Women
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="relative group overflow-hidden category-card">
                    <img
                        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000"
                        alt="Men's Fashion"
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        <Link to="/shop?category=men" tabIndex="-1">
                            <Button variant="brutalist" size="lg" className="text-2xl h-20 px-12" aria-label="Shop Men">
                                Men
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-32 bg-accent text-accent-foreground" aria-label="Newsletter Signup">
                <div className="container max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-5xl md:text-7xl font-heading font-bold uppercase tracking-tighter mb-6">
                        Join the Cult
                    </h2>
                    <p className="text-xl mb-12 opacity-90 font-medium">
                        Get early access to drops and exclusive content. No spam, just aesthetics.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="ENTER YOUR EMAIL"
                            aria-label="Email address"
                            className="flex-1 px-6 py-4 bg-background text-foreground border-2 border-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 font-bold uppercase tracking-widest"
                        />
                        <Button size="lg" className="h-auto py-4 px-10 text-lg border-2 border-foreground hover:bg-foreground hover:text-background transition-colors" aria-label="Subscribe to newsletter">
                            Subscribe
                        </Button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Home;
