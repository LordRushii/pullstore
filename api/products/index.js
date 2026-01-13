import { route, methodNotAllowed } from "../_router-utils.js";
import {
  getProducts,
  createProduct,
} from "../../src/api/products.js";

export default async function handler(req, res) {
  await route(req, res, async ({ request, method }) => {
    // /api/products (base route)
    if (method === "GET") return getProducts(request);
    if (method === "POST") return createProduct(request);
    return methodNotAllowed();
  });
}
