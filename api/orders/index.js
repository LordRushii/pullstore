import { route, methodNotAllowed } from "../_router-utils.js";
import {
  createOrder,
} from "../../src/api/orders.js";

export default async function handler(req, res) {
  await route(req, res, async ({ request, method }) => {
    // /api/orders (base route - POST only)
    if (method === "POST") return createOrder(request);
    return methodNotAllowed();
  });
}
