import { route, notFound, methodNotAllowed } from "../_router-utils.js";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../src/api/categories.js";

export default async function handler(req, res) {
  await route(req, res, async ({ request, method, segments }) => {
    // /api/categories
    if (segments.length === 2) {
      if (method === "GET") return getCategories(request);
      if (method === "POST") return createCategory(request);
      return methodNotAllowed();
    }

    // /api/categories/[id]
    if (segments.length === 3) {
      if (method === "PUT") return updateCategory(request);
      if (method === "DELETE") return deleteCategory(request);
      return methodNotAllowed();
    }

    return notFound();
  });
}
