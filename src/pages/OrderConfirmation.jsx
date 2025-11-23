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
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center" ref={containerRef}>
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 success-icon">
                <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-4xl font-bold mb-4 confirmation-text">Order Confirmed!</h1>
            <p className="text-gray-500 text-lg mb-8 max-w-md confirmation-text">
                Thank you for your purchase. Your order <span className="font-mono font-bold text-black">#{orderId}</span> has been received and is being processed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 confirmation-text">
                <Link to="/profile">
                    <Button variant="outline" className="w-full sm:w-auto gap-2">
                        <Package className="w-4 h-4" />
                        View Order
                    </Button>
                </Link>
                <Link to="/shop">
                    <Button className="w-full sm:w-auto gap-2">
                        Continue Shopping
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;
