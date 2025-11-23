import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import UserProfile from "../pages/UserProfile";
import Checkout from "../pages/Checkout";
import Payment from "../pages/Payment";
import OrderConfirmation from "../pages/OrderConfirmation";

const userRoutes = (
    <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Route>
    </Route>
);

export default userRoutes;
