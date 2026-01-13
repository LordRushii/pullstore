import { getProducts, getProductBySku, createProduct, updateProduct, deleteProduct } from "../../src/api/products.js";
import { createRequest, sendResponse } from "../_helpers.js";

export default async function handler(req, res) {
    try {
        const request = await createRequest(req);
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        const sku = pathSegments[pathSegments.length - 1]; // Last segment is SKU for dynamic routes
        
        let response;
        
        if (req.method === "GET") {
            // GET /api/products - list all products
            if (pathSegments.length === 2 && pathSegments[1] === 'products') {
                response = await getProducts(request);
            }
            // GET /api/products/[sku] - get single product
            else if (pathSegments.length === 3 && pathSegments[1] === 'products') {
                response = await getProductBySku(request);
            } else {
                response = new Response(
                    JSON.stringify({ success: false, message: "Not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
        } else if (req.method === "POST") {
            // POST /api/products - create product
            if (pathSegments.length === 2 && pathSegments[1] === 'products') {
                response = await createProduct(request);
            } else {
                response = new Response(
                    JSON.stringify({ success: false, message: "Method not allowed" }),
                    { status: 405, headers: { "Content-Type": "application/json" } }
                );
            }
        } else if (req.method === "PUT") {
            // PUT /api/products/[sku] - update product
            if (pathSegments.length === 3 && pathSegments[1] === 'products') {
                response = await updateProduct(request);
            } else {
                response = new Response(
                    JSON.stringify({ success: false, message: "Method not allowed" }),
                    { status: 405, headers: { "Content-Type": "application/json" } }
                );
            }
        } else if (req.method === "DELETE") {
            // DELETE /api/products/[sku] - delete product
            if (pathSegments.length === 3 && pathSegments[1] === 'products') {
                response = await deleteProduct(request);
            } else {
                response = new Response(
                    JSON.stringify({ success: false, message: "Method not allowed" }),
                    { status: 405, headers: { "Content-Type": "application/json" } }
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
        console.error("Products API handler error:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}
