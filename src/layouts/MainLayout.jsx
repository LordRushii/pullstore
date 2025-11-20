import { Outlet, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const MainLayout = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold tracking-tighter">
                        Luxe<span className="text-primary">Store</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link to="/" className="hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link to="/shop" className="hover:text-primary transition-colors">
                            Shop
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm font-medium hidden sm:inline-block">
                                    Hi, {user.name}
                                </span>
                                <Link
                                    to="/profile"
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                >
                                    Profile
                                </Link>
                                {user.role === "admin" && (
                                    <Link
                                        to="/admin"
                                        className="text-sm font-medium hover:text-primary transition-colors"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Login
                            </Link>
                        )}
                        <Link
                            to="/cart"
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="border-t bg-white py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} LuxeStore. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
