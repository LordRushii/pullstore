import { createRequest, sendResponse } from "./_helpers.js";
import {
  getProducts,
  getProductBySku,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../src/api/products.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../src/api/cart.js";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../src/api/users.js";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
} from "../src/api/orders.js";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../src/api/categories.js";
import { handleAuthRequest } from "../src/api/auth.js";

export default async function handler(req, res) {
  try {
    const request = await createRequest(req);
    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);
    // Expect segments like ["api", "products", "..."]
    const resource = segments[1];
    const action = segments[2] || null;

    let response;

    switch (resource) {
      case "products":
        response = await handleProducts(request, req.method, segments);
        break;
      case "cart":
        response = await handleCart(request, req.method, segments);
        break;
      case "users":
        response = await handleUsers(request, req.method, segments);
        break;
      case "orders":
        response = await handleOrders(request, req.method, segments);
        break;
      case "categories":
        response = await handleCategories(request, req.method, segments);
        break;
      case "auth":
        response = await handleAuthRequest(request);
        break;
      default:
        response = new Response(
          JSON.stringify({ success: false, message: "Not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } },
        );
    }

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

async function handleProducts(request, method, segments) {
  // /api/products
  if (segments.length === 2) {
    if (method === "GET") return getProducts(request);
    if (method === "POST") return createProduct(request);
  }

  // /api/products/[sku]
  if (segments.length === 3) {
    if (method === "GET") return getProductBySku(request);
    if (method === "PUT") return updateProduct(request);
    if (method === "DELETE") return deleteProduct(request);
  }

  return methodNotAllowed();
}

async function handleCart(request, method, segments) {
  // /api/cart
  if (segments.length === 2 && method === "GET") {
    return getCart(request);
  }

  const action = segments[2] || null;

  if (method === "POST" && action === "add") {
    return addToCart(request);
  }
  if (method === "PUT" && action === "update") {
    return updateCartItem(request);
  }
  if (method === "DELETE" && action === "remove") {
    return removeFromCart(request);
  }
  if (method === "DELETE" && action === "clear") {
    return clearCart(request);
  }

  return notFound();
}

async function handleUsers(request, method, segments) {
  const action = segments[2] || null;

  if (method === "POST") {
    if (action === "login") return loginUser(request);
    if (action === "register") return registerUser(request);
  }

  if (method === "GET") {
    if (action === "profile") return getUserProfile(request);
    if (action === "all") return getAllUsers(request);
  }

  if (method === "PUT") {
    if (action === "profile") return updateUserProfile(request);
    if (action === "change-password") return changePassword(request);
    // /api/users/[userId] admin update
    if (segments.length === 3 && action && action !== "profile" &&
      action !== "change-password" && action !== "all") {
      return updateUser(request);
    }
  }

  if (method === "DELETE" && segments.length === 3 && action) {
    return deleteUser(request);
  }

  return notFound();
}

async function handleOrders(request, method, segments) {
  const action = segments[2] || null;

  // /api/orders
  if (segments.length === 2 && method === "POST") {
    return createOrder(request);
  }

  if (method === "GET") {
    if (action === "user") return getUserOrders(request);
    if (action === "all") return getAllOrders(request);
    // /api/orders/[orderId]
    if (segments.length === 3 && action && action !== "user" &&
      action !== "all" && action !== "status") {
      return getOrderById(request);
    }
  }

  if (method === "PUT" && action === "status") {
    return updateOrderStatus(request);
  }

  return notFound();
}

async function handleCategories(request, method, segments) {
  // /api/categories
  if (segments.length === 2) {
    if (method === "GET") return getCategories(request);
    if (method === "POST") return createCategory(request);
  }

  // /api/categories/[id]
  if (segments.length === 3) {
    if (method === "PUT") return updateCategory(request);
    if (method === "DELETE") return deleteCategory(request);
  }

  return methodNotAllowed();
}

function methodNotAllowed() {
  return new Response(
    JSON.stringify({ success: false, message: "Method not allowed" }),
    { status: 405, headers: { "Content-Type": "application/json" } },
  );
}

function notFound() {
  return new Response(
    JSON.stringify({ success: false, message: "Not found" }),
    { status: 404, headers: { "Content-Type": "application/json" } },
  );
}

