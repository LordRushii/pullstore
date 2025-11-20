import { Users, DollarSign, ShoppingBag, Package, Tags } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                        <DollarSign className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-green-500 mt-1">+20.1% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Orders</h3>
                        <ShoppingBag className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold">+2350</div>
                    <p className="text-xs text-green-500 mt-1">+180.1% from last month</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Active Now</h3>
                        <Users className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-green-500 mt-1">+201 since last hour</p>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/admin/products" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Manage Products</h3>
                            <p className="text-sm text-gray-500">Add, edit or delete products</p>
                        </div>
                    </div>
                </Link>

                <Link to="/admin/categories" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-purple-500 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                            <Tags className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Manage Categories</h3>
                            <p className="text-sm text-gray-500">Organize product categories</p>
                        </div>
                    </div>
                </Link>

                <Link to="/admin/orders" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-orange-500 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                            <ShoppingBag className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Manage Orders</h3>
                            <p className="text-sm text-gray-500">Track and update orders</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
