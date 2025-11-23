import { createContext, useContext, useState, useEffect } from "react";
import { dataLayer } from "../lib/dataLayer";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await dataLayer.login(email, password);
            if (response.success) {
                setUser(response.user);
                setIsAuthenticated(true);
                localStorage.setItem("user", JSON.stringify(response.user));
                return response;
            }
            return response;
        } catch (error) {
            return { success: false, message: "An error occurred during login" };
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
