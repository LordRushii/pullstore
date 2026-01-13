import { getAllOrders } from "../../src/api/orders.js";
import { createRequest, sendResponse } from "../_helpers.js";

export default async function handler(req, res) {
    try {
        const request = await createRequest(req);
        
        let response;
        if (req.method === "GET") {
            response = await getAllOrders(request);
        } else {
            response = new Response(
                JSON.stringify({ success: false, message: "Method not allowed" }),
                { status: 405, headers: { "Content-Type": "application/json" } }
            );
        }

        await sendResponse(response, res);
    } catch (error) {
        console.error("API handler error:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}
