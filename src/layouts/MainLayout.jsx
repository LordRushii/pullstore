import { Outlet, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, User, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const MainLayout = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
            {/* Brutalist Header */}
            <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur-sm">
                <div className="container-wide h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-3xl font-heading font-bold uppercase tracking-tighter hover:text-accent transition-colors">
                        Pull<span className="text-accent">Store</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
                        <Link to="/" className="hover:text-accent hover:underline decoration-2 underline-offset-4 transition-all">
                            Home
                        </Link>
                        <Link to="/shop" className="hover:text-accent hover:underline decoration-2 underline-offset-4 transition-all">
                            Shop
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        {user ? (
                            <div className="hidden md:flex items-center gap-4">
                                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                                    {user.name}
                                </span>
                                <Link
                                    to="/profile"
                                    className="p-2 hover:bg-accent hover:text-accent-foreground border-2 border-transparent hover:border-border transition-all"
                                    title="Profile"
                                >
                                    <User className="w-5 h-5" />
                                </Link>
                                {user.role === "admin" && (
                                    <Link
                                        to="/admin"
                                        className="text-xs font-bold uppercase hover:text-accent transition-colors"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="p-2 hover:bg-destructive hover:text-destructive-foreground border-2 border-transparent transition-all"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <Button variant="brutalist" size="sm" className="hidden md:inline-flex">
                                    Login
                                </Button>
                            </Link>
                        )}

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative group p-2 border-2 border-transparent hover:border-border transition-all"
                        >
                            <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center border border-border">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t-2 border-border bg-background p-4 flex flex-col gap-4">
                        <Link to="/" className="text-lg font-bold uppercase" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        <Link to="/shop" className="text-lg font-bold uppercase" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                        {user ? (
                            <>
                                <Link to="/profile" className="text-lg font-bold uppercase" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                                <button onClick={handleLogout} className="text-lg font-bold uppercase text-left text-destructive">Logout</button>
                            </>
                        ) : (
                            <Link to="/login" className="text-lg font-bold uppercase" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                        )}
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Brutalist Footer */}
            <footer className="border-t-2 border-border bg-background py-12">
                <div className="container-wide grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-4xl font-heading font-bold uppercase mb-4">PullStore</h3>
                        <p className="text-muted-foreground max-w-md">
                            Elevating e-commerce with brutalist aesthetics and premium quality.
                            Designed for the bold.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold uppercase mb-4 tracking-widest">Shop</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/shop" className="hover:text-accent transition-colors">All Products</Link></li>
                            <li><Link to="/shop?category=new" className="hover:text-accent transition-colors">New Arrivals</Link></li>
                            <li><Link to="/shop?category=sale" className="hover:text-accent transition-colors">Sale</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold uppercase mb-4 tracking-widest">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-accent transition-colors">Shipping</a></li>
                        </ul>
                    </div>
                </div>
                <div className="container-wide mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase tracking-widest text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} PullStore. All rights reserved.</p>

                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
