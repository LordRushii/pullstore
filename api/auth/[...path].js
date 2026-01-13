import { handleAuthRequest } from "../../src/api/auth.js";
import { createRequest, sendResponse } from "../_helpers.js";

export default async function handler(req, res) {
    try {
        const request = await createRequest(req);
        const response = await handleAuthRequest(request);
        await sendResponse(response, res);
    } catch (error) {
        console.error("Auth handler error:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}
