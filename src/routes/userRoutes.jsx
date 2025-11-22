import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import UserProfile from "../pages/UserProfile";

const userRoutes = (
    <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
            <Route path="/profile" element={<UserProfile />} />
        </Route>
    </Route>
);

export default userRoutes;
