import { useState, useEffect } from "react";
import { dataLayer } from "../../lib/dataLayer";
import { Eye, Truck, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);

    const loadOrders = async () => {
        const data = await dataLayer.getAllOrders();
        setOrders(data);
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        // Optimistic update
        setOrders(
            orders.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
        await dataLayer.updateOrderStatus(orderId, newStatus);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "text-green-600 border-green-600 bg-green-50";
            case "Shipped":
                return "text-blue-600 border-blue-600 bg-blue-50";
            case "Pending":
                return "text-orange-600 border-orange-600 bg-orange-50";
            case "Cancelled":
                return "text-red-600 border-red-600 bg-red-50";
            default:
                return "text-gray-600 border-gray-600 bg-gray-50";
        }
    };

    return (
        <div className="p-6 md:p-12 min-h-screen bg-background">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-5xl font-heading font-bold uppercase tracking-tighter">Orders</h1>
                <Button onClick={loadOrders} variant="outline" size="lg" className="gap-2 uppercase font-bold border-2">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </Button>
            </div>

            <div className="bg-background border-2 border-border">
                <Table>
                    <TableHeader className="bg-secondary/10">
                        <TableRow className="border-b-2 border-border hover:bg-transparent">
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground h-12">Order ID</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground">Date</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground">Customer</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground">Total</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground">Status</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} className="border-b border-border hover:bg-secondary/5 group">
                                <TableCell className="font-mono font-bold">{order.id}</TableCell>
                                <TableCell className="font-mono text-sm text-muted-foreground">{order.date}</TableCell>
                                <TableCell className="font-bold uppercase">{order.userId}</TableCell>
                                <TableCell className="font-mono font-bold">${order.total}</TableCell>
                                <TableCell>
                                    <span
                                        className={`px-3 py-1 border-2 text-xs font-bold uppercase tracking-wider ${getStatusColor(
                                            order.status
                                        )}`}
                                    >
                                        {order.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Select
                                            defaultValue={order.status}
                                            onValueChange={(value) =>
                                                handleStatusChange(order.id, value)
                                            }
                                        >
                                            <SelectTrigger className="w-[140px] h-10 rounded-none border-2 border-border font-bold uppercase focus:ring-0 focus:border-foreground">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-none border-2 border-border">
                                                <SelectItem value="Pending" className="font-bold uppercase focus:bg-accent focus:text-accent-foreground">Pending</SelectItem>
                                                <SelectItem value="Shipped" className="font-bold uppercase focus:bg-accent focus:text-accent-foreground">Shipped</SelectItem>
                                                <SelectItem value="Delivered" className="font-bold uppercase focus:bg-accent focus:text-accent-foreground">Delivered</SelectItem>
                                                <SelectItem value="Cancelled" className="font-bold uppercase focus:bg-accent focus:text-accent-foreground">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminOrders;
