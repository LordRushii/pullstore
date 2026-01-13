import { createRequest, sendResponse } from "./_helpers.js";

export async function route(req, res, handlers) {
  try {
    const request = await createRequest(req);
    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean); // ["api","users","login"]
    const action = segments[2] || null;
    const response = await handlers({ request, method: req.method, segments, action });
    await sendResponse(response, res);
  } catch (error) {
    console.error("API router error:", error);
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

