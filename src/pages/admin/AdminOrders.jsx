import { useState, useEffect } from "react";
import { dataLayer } from "../../lib/dataLayer";
import { Eye, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
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
                return "text-green-600 bg-green-50";
            case "Shipped":
                return "text-blue-600 bg-blue-50";
            case "Pending":
                return "text-orange-600 bg-orange-50";
            case "Cancelled":
                return "text-red-600 bg-red-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Orders</h1>
                <Button onClick={loadOrders} variant="outline" size="sm" className="gap-2">
                    <Clock className="w-4 h-4" /> Refresh
                </Button>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>{order.userId}</TableCell>
                                <TableCell>${order.total}</TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
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
                                            <SelectTrigger className="w-[130px] h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Shipped">Shipped</SelectItem>
                                                <SelectItem value="Delivered">Delivered</SelectItem>
                                                <SelectItem value="Cancelled">Cancelled</SelectItem>
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
