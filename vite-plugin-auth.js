export function authPlugin() {
    return {
        name: "better-auth-plugin",
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (req.url?.startsWith("/api/auth")) {
                    try {
                        const { handleAuthRequest } = await import("./src/api/auth.js");
                        
                        const url = new URL(req.url, `http://${req.headers.host}`);
                        const request = new Request(url, {
                            method: req.method,
                            headers: req.headers,
                            body: req.method !== "GET" && req.method !== "HEAD" 
                                ? await getRequestBody(req) 
                                : undefined,
                        });

                        const response = await handleAuthRequest(request);
                        
                        res.statusCode = response.status;
                        response.headers.forEach((value, key) => {
                            res.setHeader(key, value);
                        });
                        
                        const body = await response.text();
                        res.end(body);
                        return;
                    } catch (error) {
                        console.error("Auth plugin error:", error);
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ 
                            error: "Internal server error",
                            message: error.message 
                        }));
                        return;
                    }
                }
                next();
            });
        },
    };
}

function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            resolve(body);
        });
        req.on("error", reject);
    });
}
