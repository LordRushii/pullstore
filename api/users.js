import { route, notFound } from "./_router-utils.js";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../src/api/users.js";

export default async function handler(req, res) {
  await route(req, res, async ({ request, method, segments, action }) => {
    // /api/users/login, /api/users/register
    if (method === "POST") {
      if (action === "login") return loginUser(request);
      if (action === "register") return registerUser(request);
    }

    // /api/users/profile, /api/users/all
    if (method === "GET") {
      if (action === "profile") return getUserProfile(request);
      if (action === "all") return getAllUsers(request);
    }

    // /api/users/profile, /api/users/change-password, /api/users/[userId]
    if (method === "PUT") {
      if (action === "profile") return updateUserProfile(request);
      if (action === "change-password") return changePassword(request);
      // /api/users/[userId] (admin update)
      if (segments.length === 3 && action && action !== "profile" && action !== "change-password" && action !== "all") {
        return updateUser(request);
      }
    }

    // /api/users/[userId] (admin delete)
    if (method === "DELETE" && segments.length === 3 && action) {
      return deleteUser(request);
    }

    return notFound();
  });
}

