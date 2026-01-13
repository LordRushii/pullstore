import { 
    createOrder, 
    getUserOrders, 
    getAllOrders, 
    updateOrderStatus, 
    getOrderById 
} from "../../src/api/orders.js";
import { createRequest, sendResponse } from "../_helpers.js";

export default async function handler(req, res) {
    try {
        const request = await createRequest(req);
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        const action = pathSegments[2]; // e.g., 'user', 'all', 'status', or orderId
        const orderId = pathSegments.length === 3 && pathSegments[1] === 'orders' ? pathSegments[2] : null;
        
        let response;
        
        if (req.method === "POST") {
            // POST /api/orders - create order
            if (pathSegments.length === 2 && pathSegments[1] === 'orders') {
                response = await createOrder(request);
            } else {
                response = new Response(
                    JSON.stringify({ success: false, message: "Not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
        } else if (req.method === "GET") {
            if (action === 'user') {
                // GET /api/orders/user?userId=... - get user orders
                response = await getUserOrders(request);
            } else if (action === 'all') {
                // GET /api/orders/all - get all orders (admin)
                response = await getAllOrders(request);
            } else if (orderId && pathSegments.length === 3) {
                // GET /api/orders/[orderId] - get order by ID
                response = await getOrderById(request);
            } else {
                response = new Response(
                    JSON.stringify({ success: false, message: "Not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
        } else if (req.method === "PUT") {
            if (action === 'status') {
                // PUT /api/orders/status - update order status
                response = await updateOrderStatus(request);
            } else {
                response = new Response(
                    JSON.stringify({ success: false, message: "Not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
        } else {
            response = new Response(
                JSON.stringify({ success: false, message: "Method not allowed" }),
                { status: 405, headers: { "Content-Type": "application/json" } }
            );
        }

        await sendResponse(response, res);
    } catch (error) {
        console.error("Orders API handler error:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}
