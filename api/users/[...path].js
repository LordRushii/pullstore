import { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile, 
    changePassword,
    getAllUsers,
    updateUser,
    deleteUser
} from "../../src/api/users.js";
import { createRequest, sendResponse } from "../_helpers.js";

export default async function handler(req, res) {
    try {
        const request = await createRequest(req);
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        const action = pathSegments[2]; // e.g., 'login', 'register', 'profile', 'all', 'change-password', or userId
        const userId = pathSegments.length === 3 && pathSegments[1] === 'users' ? pathSegments[2] : null;
        
        let response;
        
        if (req.method === "POST") {
            if (action === 'login') {
                response = await loginUser(request);
            } else if (action === 'register') {
                response = await registerUser(request);
            } else {
                response = new Response(
                    JSON.stringify({ success: false, message: "Not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
        } else if (req.method === "GET") {
            if (action === 'profile') {
                response = await getUserProfile(request);
            } else if (action === 'all') {
                response = await getAllUsers(request);
            } else {
                response = new Response(
                    JSON.stringify({ success: false, message: "Not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
        } else if (req.method === "PUT") {
            if (action === 'profile') {
                response = await updateUserProfile(request);
            } else if (action === 'change-password') {
                response = await changePassword(request);
            } else if (userId && pathSegments.length === 3) {
                // PUT /api/users/[userId] - update user (admin)
                response = await updateUser(request);
            } else {
                response = new Response(
                    JSON.stringify({ success: false, message: "Not found" }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
        } else if (req.method === "DELETE") {
            if (userId && pathSegments.length === 3) {
                // DELETE /api/users/[userId] - delete user (admin)
                response = await deleteUser(request);
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
        console.error("Users API handler error:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}
