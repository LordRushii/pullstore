import { useAuth } from "../context/AuthContext";
import { dataLayer } from "../lib/apiService";
import { Package, Truck, CheckCircle, Clock, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const UserProfile = () => {
    const { user } = useAuth();
    const [userOrders, setUserOrders] = useState([]);

    useEffect(() => {
        const loadOrders = async () => {
            if (user?._id || user?.id) {
                const userId = user._id || user.id;
                const orders = await dataLayer.getOrders(userId);
                setUserOrders(orders);
            }
        };
        loadOrders();
    }, [user]);

    const getStatusIcon = (status) => {
        switch (status) {
            case "Delivered":
                return <CheckCircle className="w-5 h-5" />;
            case "Shipped":
                return <Truck className="w-5 h-5" />;
            case "Pending":
                return <Clock className="w-5 h-5" />;
            default:
                return <Package className="w-5 h-5" />;
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container-wide">
                <h1 className="text-5xl md:text-7xl font-heading font-bold uppercase tracking-tighter mb-12 border-b-2 border-border pb-6">
                    Profile
                </h1>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* User Info Card */}
                    <div className="lg:col-span-1">
                        <div className="border-2 border-border bg-background p-8 sticky top-24">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-20 h-20 border-2 border-foreground rounded-full flex items-center justify-center text-3xl font-heading font-bold uppercase bg-accent text-accent-foreground">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-heading font-bold uppercase">{user.name}</h2>
                                    <p className="text-muted-foreground font-mono text-sm">{user.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 border-2 border-border bg-secondary/10">
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Orders</p>
                                    <p className="text-3xl font-heading font-bold">{userOrders.length}</p>
                                </div>
                                <div className="p-4 border-2 border-border bg-secondary/10">
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Member Since</p>
                                    <p className="text-3xl font-heading font-bold">2023</p>
                                </div>
                                <div className="p-4 border-2 border-border bg-secondary/10">
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                                    <p className="text-3xl font-heading font-bold text-accent">VIP</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-heading font-bold uppercase mb-8">Order History</h2>
                        <div className="space-y-8">
                            {userOrders.length > 0 ? (
                                userOrders.map((order) => (
                                    <div key={order.orderId || order._id} className="border-2 border-border bg-background p-6 transition-all hover:border-foreground group">
                                        <div className="flex flex-wrap justify-between items-start gap-4 mb-6 border-b-2 border-border pb-4">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Order ID</p>
                                                <p className="font-mono font-bold text-lg">#{order.orderId || order._id}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Date</p>
                                                <p className="font-mono font-bold text-lg">
                                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total</p>
                                                <p className="font-mono font-bold text-lg">${order.total}</p>
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 border-2 border-border font-bold uppercase text-sm">
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex items-center gap-4">
                                                    <div className="w-16 h-16 border border-border bg-secondary/20 overflow-hidden">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold uppercase text-sm">{item.name}</h3>
                                                        <p className="text-xs text-muted-foreground font-mono">QTY: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-bold font-mono">${item.price}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {order.status === "Shipped" && (
                                            <div className="mt-6 pt-4 border-t-2 border-border flex items-center gap-3 text-accent font-bold uppercase text-sm">
                                                <Truck className="w-5 h-5" />
                                                <span>In Transit • Arriving Soon</span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 border-2 border-border border-dashed">
                                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                                    <h3 className="text-2xl font-heading font-bold uppercase mb-2">No Orders Yet</h3>
                                    <p className="text-muted-foreground mb-8">Start your collection today.</p>
                                    <Button variant="outline" className="uppercase font-bold">Start Shopping</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
