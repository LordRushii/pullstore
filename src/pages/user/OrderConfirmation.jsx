import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import gsap from "gsap";

const OrderConfirmation = () => {
    const containerRef = useRef(null);
    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from(".success-icon", {
                scale: 0,
                rotation: -180,
                duration: 0.8,
                ease: "back.out(1.7)"
            })
                .from(".confirmation-text", {
                    y: 20,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.1
                }, "-=0.4");
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background text-center" ref={containerRef}>
            <div className="w-full max-w-2xl border-2 border-border bg-background p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-accent" />

                <div className="w-24 h-24 border-2 border-foreground rounded-full flex items-center justify-center mb-8 mx-auto success-icon bg-accent text-accent-foreground">
                    <CheckCircle className="w-12 h-12" />
                </div>

                <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter mb-6 confirmation-text">
                    Order Confirmed
                </h1>

                <div className="bg-secondary/10 border-2 border-border p-6 mb-8 confirmation-text">
                    <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold mb-2">Order Reference</p>
                    <p className="font-mono font-bold text-3xl tracking-widest">#{orderId}</p>
                </div>

                <p className="text-muted-foreground text-lg mb-12 max-w-md mx-auto confirmation-text">
                    Thank you for your purchase. Your order has been received and is being processed.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center confirmation-text">
                    <Link to="/profile">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 uppercase font-bold border-2">
                            <Package className="w-4 h-4" />
                            View Order
                        </Button>
                    </Link>
                    <Link to="/shop">
                        <Button variant="brutalist" size="lg" className="w-full sm:w-auto gap-2">
                            Continue Shopping
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
