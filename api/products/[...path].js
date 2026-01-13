import { route, notFound, methodNotAllowed } from "../_router-utils.js";
import {
  getProducts,
  getProductBySku,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../src/api/products.js";

export default async function handler(req, res) {
  await route(req, res, async ({ request, method, segments }) => {
    // /api/products
    if (segments.length === 2) {
      if (method === "GET") return getProducts(request);
      if (method === "POST") return createProduct(request);
      return methodNotAllowed();
    }

    // /api/products/[sku]
    if (segments.length === 3) {
      if (method === "GET") return getProductBySku(request);
      if (method === "PUT") return updateProduct(request);
      if (method === "DELETE") return deleteProduct(request);
      return methodNotAllowed();
    }

    return notFound();
  });
}
