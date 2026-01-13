import { route, notFound, methodNotAllowed } from "../_router-utils.js";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../src/api/categories.js";

export default async function handler(req, res) {
  await route(req, res, async ({ request, method, segments }) => {
    // Only handle sub-paths: /api/categories/[id]
    // Base route /api/categories is handled by index.js

    // /api/categories/[id]
    if (segments.length === 3) {
      if (method === "PUT") return updateCategory(request);
      if (method === "DELETE") return deleteCategory(request);
      return methodNotAllowed();
    }

    return notFound();
  });
}
