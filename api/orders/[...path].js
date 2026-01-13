import { route, notFound } from "../_router-utils.js";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
} from "../../src/api/orders.js";

export default async function handler(req, res) {
  await route(req, res, async ({ request, method, segments, action }) => {
    // Only handle sub-paths: /api/orders/user, /api/orders/all, /api/orders/status, /api/orders/[orderId]
    // Base route /api/orders is handled by index.js

    if (method === "GET") {
      if (action === "user") return getUserOrders(request);
      if (action === "all") return getAllOrders(request);
      // /api/orders/[orderId]
      if (segments.length === 3 && action && action !== "user" && action !== "all" && action !== "status") {
        return getOrderById(request);
      }
    }

    if (method === "PUT" && action === "status") {
      return updateOrderStatus(request);
    }

    return notFound();
  });
}
