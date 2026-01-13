import { route, methodNotAllowed } from "../_router-utils.js";
import {
  getCategories,
  createCategory,
} from "../../src/api/categories.js";

export default async function handler(req, res) {
  await route(req, res, async ({ request, method }) => {
    // /api/categories (base route)
    if (method === "GET") return getCategories(request);
    if (method === "POST") return createCategory(request);
    return methodNotAllowed();
  });
}
