import { route, methodNotAllowed } from "../_router-utils.js";
import {
  getCart,
} from "../../src/api/cart.js";

export default async function handler(req, res) {
  await route(req, res, async ({ request, method }) => {
    // /api/cart (base route)
    if (method === "GET") return getCart(request);
    return methodNotAllowed();
  });
}
