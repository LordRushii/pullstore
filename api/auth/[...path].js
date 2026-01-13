import { route } from "../_router-utils.js";
import { handleAuthRequest } from "../../src/api/auth.js";

export default async function handler(req, res) {
  await route(req, res, async ({ request }) => {
    return handleAuthRequest(request);
  });
}
