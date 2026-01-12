export function apiPlugin() {
    return {
        name: "custom-api-plugin",
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const url = req.url;
                const method = req.method;

                try {
                    // ===== USER AUTH ROUTES =====
                    if (url === "/api/users/register" && method === "POST") {
                        const { registerUser } = await import("./src/api/users.js");
                        return await handleApiRequest(req, res, registerUser);
                    }

                    if (url === "/api/users/login" && method === "POST") {
                        const { loginUser } = await import("./src/api/users.js");
                        return await handleApiRequest(req, res, loginUser);
                    }

                    if (url.startsWith("/api/users/profile?") && method === "GET") {
                        const { getUserProfile } = await import("./src/api/users.js");
                        return await handleApiRequest(req, res, getUserProfile);
                    }

                    if (url === "/api/users/profile" && method === "PUT") {
                        const { updateUserProfile } = await import("./src/api/users.js");
                        return await handleApiRequest(req, res, updateUserProfile);
                    }

                    if (url === "/api/users/change-password" && method === "PUT") {
                        const { changePassword } = await import("./src/api/users.js");
                        return await handleApiRequest(req, res, changePassword);
                    }

                    if (url.startsWith("/api/users/all") && method === "GET") {
                        const { getAllUsers } = await import("./src/api/users.js");
                        return await handleApiRequest(req, res, getAllUsers);
                    }

                    if (url.match(/\/api\/users\/[^\/]+$/) && method === "PUT") {
                        const { updateUser } = await import("./src/api/users.js");
                        return await handleApiRequest(req, res, updateUser);
                    }

                    if (url.match(/\/api\/users\/[^\/]+$/) && method === "DELETE") {
                        const { deleteUser } = await import("./src/api/users.js");
                        return await handleApiRequest(req, res, deleteUser);
                    }

                    // ===== PRODUCTS ROUTES =====
                    if (url.startsWith("/api/products")) {
                        if (url === "/api/products" && method === "GET") {
                            const { getProducts } = await import("./src/api/products.js");
                            return await handleApiRequest(req, res, getProducts);
                        }

                        if (url.match(/\/api\/products\/[^\/]+$/) && method === "GET") {
                            const { getProductBySku } = await import("./src/api/products.js");
                            return await handleApiRequest(req, res, getProductBySku);
                        }

                        if (url === "/api/products" && method === "POST") {
                            const { createProduct } = await import("./src/api/products.js");
                            return await handleApiRequest(req, res, createProduct);
                        }

                        if (url.match(/\/api\/products\/[^\/]+$/) && method === "PUT") {
                            const { updateProduct } = await import("./src/api/products.js");
                            return await handleApiRequest(req, res, updateProduct);
                        }

                        if (url.match(/\/api\/products\/[^\/]+$/) && method === "DELETE") {
                            const { deleteProduct } = await import("./src/api/products.js");
                            return await handleApiRequest(req, res, deleteProduct);
                        }
                    }

                    // ===== CART ROUTES =====
                    if (url.startsWith("/api/cart")) {
                        if (url.startsWith("/api/cart?") && method === "GET") {
                            const { getCart } = await import("./src/api/cart.js");
                            return await handleApiRequest(req, res, getCart);
                        }

                        if (url === "/api/cart/add" && method === "POST") {
                            const { addToCart } = await import("./src/api/cart.js");
                            return await handleApiRequest(req, res, addToCart);
                        }

                        if (url === "/api/cart/update" && method === "PUT") {
                            const { updateCartItem } = await import("./src/api/cart.js");
                            return await handleApiRequest(req, res, updateCartItem);
                        }

                        if (url === "/api/cart/remove" && method === "DELETE") {
                            const { removeFromCart } = await import("./src/api/cart.js");
                            return await handleApiRequest(req, res, removeFromCart);
                        }

                        if (url === "/api/cart/clear" && method === "DELETE") {
                            const { clearCart } = await import("./src/api/cart.js");
                            return await handleApiRequest(req, res, clearCart);
                        }
                    }

                    // ===== ORDERS ROUTES =====
                    if (url.startsWith("/api/orders")) {
                        if (url === "/api/orders" && method === "POST") {
                            const { createOrder } = await import("./src/api/orders.js");
                            return await handleApiRequest(req, res, createOrder);
                        }

                        if (url.startsWith("/api/orders/user?") && method === "GET") {
                            const { getUserOrders } = await import("./src/api/orders.js");
                            return await handleApiRequest(req, res, getUserOrders);
                        }

                        if (url.startsWith("/api/orders/all") && method === "GET") {
                            const { getAllOrders } = await import("./src/api/orders.js");
                            return await handleApiRequest(req, res, getAllOrders);
                        }

                        if (url === "/api/orders/status" && method === "PUT") {
                            const { updateOrderStatus } = await import("./src/api/orders.js");
                            return await handleApiRequest(req, res, updateOrderStatus);
                        }

                        if (url.match(/\/api\/orders\/[^\/]+$/) && method === "GET") {
                            const { getOrderById } = await import("./src/api/orders.js");
                            return await handleApiRequest(req, res, getOrderById);
                        }
                    }

                    // ===== CATEGORIES ROUTES =====
                    if (url.startsWith("/api/categories")) {
                        if (url === "/api/categories" && method === "GET") {
                            const { getCategories } = await import("./src/api/categories.js");
                            return await handleApiRequest(req, res, getCategories);
                        }

                        if (url === "/api/categories" && method === "POST") {
                            const { createCategory } = await import("./src/api/categories.js");
                            return await handleApiRequest(req, res, createCategory);
                        }

                        if (url.match(/\/api\/categories\/[^\/]+$/) && method === "PUT") {
                            const { updateCategory } = await import("./src/api/categories.js");
                            return await handleApiRequest(req, res, updateCategory);
                        }

                        if (url.match(/\/api\/categories\/[^\/]+$/) && method === "DELETE") {
                            const { deleteCategory } = await import("./src/api/categories.js");
                            return await handleApiRequest(req, res, deleteCategory);
                        }
                    }

                    next();
                } catch (error) {
                    console.error("API Plugin Error:", error);
                    res.statusCode = 500;
                    res.setHeader("Content-Type", "application/json");
                    res.end(
                        JSON.stringify({
                            success: false,
                            message: "Internal server error",
                            error: error.message,
                        })
                    );
                }
            });
        },
    };
}

// Helper function to handle API requests
async function handleApiRequest(req, res, handler) {
    try {
        const body = await getRequestBody(req);
        const request = new Request(`http://localhost${req.url}`, {
            method: req.method,
            headers: { "Content-Type": "application/json" },
            body: body || undefined,
        });

        const response = await handler(request);

        res.statusCode = response.status;
        res.setHeader("Content-Type", "application/json");
        const responseBody = await response.text();
        res.end(responseBody);
    } catch (error) {
        console.error("API Handler Error:", error);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(
            JSON.stringify({
                success: false,
                message: "Server error",
                error: error.message,
            })
        );
    }
}

// Helper function to get request body
function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        // For GET requests, there is no body by convention
        if (req.method === "GET") {
            resolve(null);
            return;
        }

        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            resolve(body || null);
        });
        req.on("error", reject);
    });
}
