import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { dataLayer } from "../lib/dataLayer";

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            const products = await dataLayer.getProducts();
            setFeaturedProducts(products.slice(0, 4));
        };
        loadProducts();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900 text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
                        Elevate Your Style
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in-up delay-100">
                        Discover the latest trends in fashion and accessories.
                    </p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-all transform hover:scale-105 animate-fade-in-up delay-200"
                    >
                        Shop Now <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Collection</h2>
                            <p className="text-gray-500">Handpicked items just for you.</p>
                        </div>
                        <Link to="/shop" className="text-primary font-medium hover:underline flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product) => (
                            <Link key={product.sku} to={`/product/${product.sku}`} className="group">
                                <div className="relative overflow-hidden rounded-xl bg-gray-100 mb-4 aspect-[3/4]">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {!product.inStock && (
                                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            Out of Stock
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-medium text-lg group-hover:text-primary transition-colors">{product.name}</h3>
                                <p className="text-gray-500 text-sm mb-1">{product.category}</p>
                                <p className="font-semibold">${product.price}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center max-w-2xl">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Join Our Newsletter</h2>
                    <p className="text-gray-500 mb-8">
                        Sign up for exclusive offers, original stories, events and more.
                    </p>
                    <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Home;
