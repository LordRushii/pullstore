import { createContext, useContext, useState, useEffect } from "react";
import { users } from "../data/mockData";

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

    const login = (email, password) => {
        const foundUser = users.find(
            (u) => u.email === email && u.password === password
        );
        if (foundUser) {
            setUser(foundUser);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(foundUser));
            return { success: true };
        }
        return { success: false, message: "Invalid credentials" };
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
