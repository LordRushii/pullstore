import { createRequest, sendResponse } from "./_helpers.js";

export async function route(req, res, handlers) {
  try {
    const request = await createRequest(req);
    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean); // ["api","products"] or ["api","products","ABC123"]
    const action = segments[2] || null;
    
    // Debug logging (remove after fixing)
    console.log(`[API Route] ${req.method} ${req.url} -> segments:`, segments, "action:", action);
    
    const response = await handlers({ request, method: req.method, segments, action });
    
    if (!response) {
      console.error(`[API Route] No response returned for ${req.method} ${req.url}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error: No response from handler",
      });
    }
    
    await sendResponse(response, res);
  } catch (error) {
    console.error("API router error:", error);
    console.error("Error stack:", error.stack);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
}

export function notFound() {
  return new Response(
    JSON.stringify({ success: false, message: "Not found" }),
    { status: 404, headers: { "Content-Type": "application/json" } },
  );
}

export function methodNotAllowed() {
  return new Response(
    JSON.stringify({ success: false, message: "Method not allowed" }),
    { status: 405, headers: { "Content-Type": "application/json" } },
  );
}

