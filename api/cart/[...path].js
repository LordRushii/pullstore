import { route, notFound } from "../_router-utils.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../../src/api/cart.js";

export default async function handler(req, res) {
  await route(req, res, async ({ request, method, segments, action }) => {
    // /api/cart (GET)
    if (segments.length === 2 && method === "GET") {
      return getCart(request);
    }

    // actions: add, update, remove, clear
    if (method === "POST" && action === "add") return addToCart(request);
    if (method === "PUT" && action === "update") return updateCartItem(request);
    if (method === "DELETE" && action === "remove") return removeFromCart(request);
    if (method === "DELETE" && action === "clear") return clearCart(request);

    return notFound();
  });
}
