import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_BASE = import.meta.env.VITE_APP_URL || window.location.origin;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("auth_user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Error parsing stored user:", error);
                localStorage.removeItem("auth_user");
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email.trim(), 
                    password: password.trim() 
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                return {
                    success: false,
                    message: data.message || 'Login failed'
                };
            }

            // Store user data
            setUser(data.user);
            setIsAuthenticated(true);
            localStorage.setItem("auth_user", JSON.stringify(data.user));

            return { 
                success: true, 
                user: data.user 
            };

        } catch (error) {
            console.error("Login error:", error);
            return { 
                success: false, 
                message: error.message || "Network error. Please try again." 
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await fetch(`${API_BASE}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name: name.trim(), 
                    email: email.trim(), 
                    password: password.trim() 
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                return {
                    success: false,
                    message: data.message || 'Registration failed'
                };
            }

            // Auto-login after registration
            setUser(data.user);
            setIsAuthenticated(true);
            localStorage.setItem("auth_user", JSON.stringify(data.user));

            return { 
                success: true, 
                user: data.user 
            };

        } catch (error) {
            console.error("Registration error:", error);
            return { 
                success: false, 
                message: error.message || "Network error. Please try again." 
            };
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("auth_user");
    };

    const checkSession = () => {
        const storedUser = localStorage.getItem("auth_user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (error) {
                setUser(null);
                setIsAuthenticated(false);
            }
        }
    };

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                isAuthenticated, 
                loading,
                login, 
                register,
                logout,
                checkSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
