export function apiPlugin() {
    return {
        name: "custom-api-plugin",
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const url = req.url;

                if (url === "/api/users/register" && req.method === "POST") {
                    try {
                        const { registerUser } = await import("./src/api/users.js");
                        
                        const body = await getRequestBody(req);
                        const request = new Request("http://localhost/api/users/register", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: body,
                        });

                        const response = await registerUser(request);
                        
                        res.statusCode = response.status;
                        res.setHeader("Content-Type", "application/json");
                        const responseBody = await response.text();
                        res.end(responseBody);
                        return;
                    } catch (error) {
                        console.error("Registration API error:", error);
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ 
                            success: false, 
                            message: "Server error",
                            error: error.message 
                        }));
                        return;
                    }
                }

                if (url === "/api/users/login" && req.method === "POST") {
                    try {
                        const { loginUser } = await import("./src/api/users.js");
                        
                        const body = await getRequestBody(req);
                        const request = new Request("http://localhost/api/users/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: body,
                        });

                        const response = await loginUser(request);
                        
                        res.statusCode = response.status;
                        res.setHeader("Content-Type", "application/json");
                        const responseBody = await response.text();
                        res.end(responseBody);
                        return;
                    } catch (error) {
                        console.error("Login API error:", error);
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ 
                            success: false, 
                            message: "Server error",
                            error: error.message 
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
