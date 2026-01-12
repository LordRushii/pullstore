import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import gsap from "gsap";

const Payment = () => {
    const navigate = useNavigate();
    const { cartTotal, checkout } = useCart();
    const containerRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Mock shipping cost (should match Checkout)
    const shipping = 10;
    const total = cartTotal + shipping;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".payment-fade-in", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Get shipping address from localStorage or use default
        const savedAddress = localStorage.getItem("checkout_address");
        let shippingAddress = {};
        
        if (savedAddress) {
            try {
                shippingAddress = JSON.parse(savedAddress);
            } catch (e) {
                // If parsing fails, use empty object
                shippingAddress = {};
            }
        }

        const orderDetails = {
            paymentMethod: "Credit Card",
            shippingAddress: shippingAddress
        };

        const result = await checkout(orderDetails);

        setIsProcessing(false);

        if (result.success) {
            navigate("/order-confirmation");
        } else {
            alert("Order failed: " + result.message);
        }
    };

    return (
        <div className="min-h-screen bg-background py-12 flex items-center justify-center" ref={containerRef}>
            <div className="w-full max-w-2xl px-4">
                <div className="border-2 border-border bg-background p-8 md:p-12 payment-fade-in relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-foreground" />

                    <div className="flex items-center justify-between mb-12">
                        <h1 className="text-4xl font-heading font-bold uppercase tracking-tighter">Payment</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Lock className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-widest">Secure</span>
                        </div>
                    </div>

                    <div className="mb-8 p-6 bg-secondary/10 border-2 border-border flex justify-between items-center">
                        <span className="font-bold uppercase text-sm tracking-widest text-muted-foreground">Total Amount</span>
                        <span className="font-heading font-bold text-3xl">${total.toFixed(2)}</span>
                    </div>

                    <form id="payment-form" onSubmit={handlePayment} className="space-y-8">
                        <div className="space-y-2">
                            <Label htmlFor="cardName" className="uppercase font-bold text-xs tracking-widest">Cardholder Name</Label>
                            <Input
                                id="cardName"
                                placeholder="JOHN DOE"
                                required
                                className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cardNumber" className="uppercase font-bold text-xs tracking-widest">Card Number</Label>
                            <div className="relative">
                                <Input
                                    id="cardNumber"
                                    placeholder="0000 0000 0000 0000"
                                    required
                                    maxLength={19}
                                    className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground pr-10"
                                />
                                <CreditCard className="w-5 h-5 text-muted-foreground absolute right-4 top-3.5" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="expiry" className="uppercase font-bold text-xs tracking-widest">Expiry Date</Label>
                                <Input
                                    id="expiry"
                                    placeholder="MM/YY"
                                    required
                                    maxLength={5}
                                    className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvc" className="uppercase font-bold text-xs tracking-widest">CVC</Label>
                                <Input
                                    id="cvc"
                                    placeholder="123"
                                    required
                                    maxLength={3}
                                    type="password"
                                    className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-16 text-lg mt-4"
                            size="lg"
                            type="submit"
                            variant="brutalist"
                            disabled={isProcessing}
                        >
                            {isProcessing ? "PROCESSING..." : `PAY $${total.toFixed(2)}`}
                        </Button>
                    </form>

                    <div className="mt-8 flex justify-center items-center gap-2 text-muted-foreground">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Encrypted Transaction</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
