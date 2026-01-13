import { getCategories, createCategory, updateCategory, deleteCategory } from "../../src/api/categories.js";
import { createRequest, sendResponse } from "../_helpers.js";

export default async function handler(req, res) {
    try {
        const request = await createRequest(req);
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        const categoryId = pathSegments.length === 3 && pathSegments[1] === 'categories' ? pathSegments[2] : null;
        
        let response;
        
        if (req.method === "GET") {
            // GET /api/categories - list all categories
            if (pathSegments.length === 2 && pathSegments[1] === 'categories') {
                response = await getCategories(request);
            } else {
                response = new Response(
                    JSON.stringify({ success: false, message: "Not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
        } else if (req.method === "POST") {
            // POST /api/categories - create category
            if (pathSegments.length === 2 && pathSegments[1] === 'categories') {
                response = await createCategory(request);
            } else {
                response = new Response(
                    JSON.stringify({ success: false, message: "Not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
        } else if (req.method === "PUT") {
            // PUT /api/categories/[id] - update category
            if (categoryId && pathSegments.length === 3) {
                response = await updateCategory(request);
            } else {
                response = new Response(
                    JSON.stringify({ success: false, message: "Not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
        } else if (req.method === "DELETE") {
            // DELETE /api/categories/[id] - delete category
            if (categoryId && pathSegments.length === 3) {
                response = await deleteCategory(request);
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
        console.error("Categories API handler error:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}
