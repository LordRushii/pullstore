export async function handleAuthRequest(request) {
    try {
        const { auth } = await import("../lib/auth.js");
        const response = await auth.handler(request);
        return response;
    } catch (error) {
        console.error("Auth handler error:", error);
        
        const errorMessage = error.message?.includes("VITE_MONGO_URI")
            ? "MongoDB connection not configured. Please check your .env file."
            : error.message || "Authentication failed";
            
        return new Response(
            JSON.stringify({ 
                error: errorMessage,
                details: process.env.NODE_ENV === "development" ? error.stack : undefined
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
