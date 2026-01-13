import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../../src/api/cart.js";
import { createRequest, sendResponse } from "../_helpers.js";

export default async function handler(req, res) {
    try {
        const request = await createRequest(req);
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        const action = pathSegments[2]; // e.g., 'add', 'update', 'remove', 'clear'
        
        let response;
        
        if (req.method === "GET") {
            // GET /api/cart?userId=... - get cart
            if (pathSegments.length === 2 && pathSegments[1] === 'cart') {
                response = await getCart(request);
            } else {
                response = new Response(
                    JSON.stringify({ success: false, message: "Not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
        } else if (req.method === "POST") {
            // POST /api/cart/add - add to cart
            if (action === 'add') {
                response = await addToCart(request);
            } else {
                response = new Response(
                    JSON.stringify({ success: false, message: "Not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
        } else if (req.method === "PUT") {
            // PUT /api/cart/update - update cart item
            if (action === 'update') {
                response = await updateCartItem(request);
            } else {
                response = new Response(
                    JSON.stringify({ success: false, message: "Not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
        } else if (req.method === "DELETE") {
            // DELETE /api/cart/remove - remove item
            // DELETE /api/cart/clear - clear cart
            if (action === 'remove') {
                response = await removeFromCart(request);
            } else if (action === 'clear') {
                response = await clearCart(request);
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
        console.error("Cart API handler error:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}
