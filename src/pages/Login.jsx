import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
    const [email, setEmail] = useState("user@example.com");
    const [password, setPassword] = useState("password");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            if (user?.role === "admin") {
                navigate("/admin", { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                if (result.user?.role === "admin") {
                    navigate("/admin", { replace: true });
                } else {
                    navigate(from, { replace: true });
                }
            } else {
                setError(result.message);
                setLoading(false);
            }
        } catch (err) {
            setError("An error occurred during login");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
            <div className="w-full max-w-md border-2 border-border bg-background p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-foreground" />

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-heading font-bold uppercase tracking-tighter mb-2">Access</h1>
                    <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Restricted Area</p>
                </div>

                {error && (
                    <div className="bg-destructive/10 border-2 border-destructive text-destructive p-4 mb-8 flex items-center gap-3 font-bold uppercase text-sm">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="uppercase font-bold text-xs tracking-widest">Email</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground transition-colors"
                            required
                            placeholder="EMAIL@ADDRESS.COM"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="uppercase font-bold text-xs tracking-widest">Password</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground transition-colors"
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 text-lg mt-4"
                        variant="brutalist"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                AUTHENTICATING...
                            </>
                        ) : (
                            "LOGIN"
                        )}
                    </Button>
                </form>

                <div className="mt-12 pt-8 border-t-2 border-border text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Demo Credentials</p>
                    <div className="space-y-2 text-sm font-mono">
                        <p>USER: user@example.com / password</p>
                        <p>ADMIN: admin@example.com / password</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
