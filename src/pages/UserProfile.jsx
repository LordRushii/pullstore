import { useAuth } from "../context/AuthContext";
import { dataLayer } from "../lib/dataLayer";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const UserProfile = () => {
    const { user } = useAuth();
    const [userOrders, setUserOrders] = useState([]);

    useEffect(() => {
        const loadOrders = async () => {
            if (user?.id) {
                const orders = await dataLayer.getOrders(user.id);
                setUserOrders(orders);
            }
        };
        loadOrders();
    }, [user]);

    const getStatusIcon = (status) => {
        switch (status) {
            case "Delivered":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "Shipped":
                return <Truck className="w-5 h-5 text-blue-500" />;
            case "Pending":
                return <Clock className="w-5 h-5 text-orange-500" />;
            default:
                return <Package className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-50 text-green-700 border-green-100";
            case "Shipped":
                return "bg-blue-50 text-blue-700 border-blue-100";
            case "Pending":
                return "bg-orange-50 text-orange-700 border-orange-100";
            default:
                return "bg-gray-50 text-gray-700 border-gray-100";
        }
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                            <p className="text-gray-500">{user.email}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                            <p className="text-2xl font-bold">{userOrders.length}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500 mb-1">Member Since</p>
                            <p className="text-2xl font-bold">2023</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500 mb-1">Status</p>
                            <p className="text-2xl font-bold text-primary">Gold</p>
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-6">Order History</h2>
                <div className="space-y-6">
                    {userOrders.length > 0 ? (
                        userOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Order ID</p>
                                        <p className="font-medium">{order.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Date</p>
                                        <p className="font-medium">{order.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                        <p className="font-medium">${order.total}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full border flex items-center gap-2 text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium">{item.name}</h3>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-medium">${item.price}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {order.status === "Shipped" && (
                                        <div className="mt-6 pt-6 border-t border-gray-50">
                                            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                                                <Truck className="w-4 h-4" />
                                                <span>Your order is on the way! Expected delivery: Tomorrow</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                            <p className="text-gray-500">Start shopping to see your orders here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
