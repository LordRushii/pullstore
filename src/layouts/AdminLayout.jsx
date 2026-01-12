import { Link, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Package, Tags, ShoppingBag, PlusCircle, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            <aside className="w-64 bg-white border-r hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b">
                    <Link to="/" className="text-xl font-bold uppercase tracking-widest">
                        Admin<span className="text-red-600">Panel</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link
                        to="/admin/products"
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                        <Package className="w-5 h-5" />
                        <span className="font-medium">Products</span>
                    </Link>
                    <Link
                        to="/admin/add-product"
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span className="font-medium">Add Product</span>
                    </Link>
                    <Link
                        to="/admin/categories"
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                        <Tags className="w-5 h-5" />
                        <span className="font-medium">Categories</span>
                    </Link>
                    <Link
                        to="/admin/orders"
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        <span className="font-medium">Orders</span>
                    </Link>
                    <Link
                        to="/admin/users"
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Users</span>
                    </Link>
                </nav>

                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
