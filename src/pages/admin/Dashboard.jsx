import { Users, DollarSign, ShoppingBag, Package, Tags, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Dashboard = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from(".dashboard-title", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        })
            .from(".stat-card", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.4")
            .from(".quick-actions-title", {
                x: -20,
                opacity: 0,
                duration: 0.6,
                ease: "power3.out"
            }, "-=0.2")
            .from(".action-card", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.4");
    }, { scope: containerRef });

    return (
        <div className="p-6 md:p-12 min-h-screen bg-background" ref={containerRef}>
            <h1 className="text-5xl md:text-7xl font-heading font-bold uppercase tracking-tighter mb-12 border-b-2 border-border pb-6 dashboard-title">
                Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-background p-6 border-2 border-border hover:bg-accent hover:text-accent-foreground transition-colors group stat-card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold uppercase tracking-widest text-xs">Total Revenue</h3>
                        <DollarSign className="w-5 h-5" />
                    </div>
                    <div className="text-4xl font-heading font-bold mb-2">$45,231.89</div>
                    <p className="text-xs font-mono flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> +20.1% FROM LAST MONTH
                    </p>
                </div>

                <div className="bg-background p-6 border-2 border-border hover:bg-accent hover:text-accent-foreground transition-colors group stat-card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold uppercase tracking-widest text-xs">Orders</h3>
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div className="text-4xl font-heading font-bold mb-2">+2350</div>
                    <p className="text-xs font-mono flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> +180.1% FROM LAST MONTH
                    </p>
                </div>

                <div className="bg-background p-6 border-2 border-border hover:bg-accent hover:text-accent-foreground transition-colors group stat-card">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold uppercase tracking-widest text-xs">Active Now</h3>
                        <Users className="w-5 h-5" />
                    </div>
                    <div className="text-4xl font-heading font-bold mb-2">+573</div>
                    <p className="text-xs font-mono flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> +201 SINCE LAST HOUR
                    </p>
                </div>
            </div>

            <h2 className="text-3xl font-heading font-bold uppercase mb-8 quick-actions-title">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/admin/products" className="bg-background p-8 border-2 border-border hover:bg-foreground hover:text-background transition-all group relative overflow-hidden action-card">
                    <div className="relative z-10">
                        <div className="mb-6">
                            <Package className="w-10 h-10" />
                        </div>
                        <h3 className="font-heading font-bold text-2xl uppercase mb-2">Manage Products</h3>
                        <p className="text-sm font-mono uppercase opacity-70">Add, edit or delete inventory</p>
                    </div>
                </Link>

                <Link to="/admin/categories" className="bg-background p-8 border-2 border-border hover:bg-foreground hover:text-background transition-all group relative overflow-hidden action-card">
                    <div className="relative z-10">
                        <div className="mb-6">
                            <Tags className="w-10 h-10" />
                        </div>
                        <h3 className="font-heading font-bold text-2xl uppercase mb-2">Manage Categories</h3>
                        <p className="text-sm font-mono uppercase opacity-70">Organize product collections</p>
                    </div>
                </Link>

                <Link to="/admin/orders" className="bg-background p-8 border-2 border-border hover:bg-foreground hover:text-background transition-all group relative overflow-hidden action-card">
                    <div className="relative z-10">
                        <div className="mb-6">
                            <ShoppingBag className="w-10 h-10" />
                        </div>
                        <h3 className="font-heading font-bold text-2xl uppercase mb-2">Manage Orders</h3>
                        <p className="text-sm font-mono uppercase opacity-70">Track and fulfillment</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
