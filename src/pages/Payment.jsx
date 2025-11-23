import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CreditCard, Lock } from "lucide-react";
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

        const orderDetails = {
            paymentMethod: "Credit Card",
            shippingAddress: "123 Main St" // Ideally passed from Checkout page via state
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
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50/50" ref={containerRef}>
            <Card className="w-full max-w-md payment-fade-in">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-6 h-6" />
                        Payment Details
                    </CardTitle>
                    <CardDescription>
                        Complete your purchase of ${total.toFixed(2)}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="payment-form" onSubmit={handlePayment} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="cardName">Cardholder Name</Label>
                            <Input
                                id="cardName"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <div className="relative">
                                <Input
                                    id="cardNumber"
                                    placeholder="0000 0000 0000 0000"
                                    required
                                    maxLength={19}
                                />
                                <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input
                                    id="expiry"
                                    placeholder="MM/YY"
                                    required
                                    maxLength={5}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvc">CVC</Label>
                                <Input
                                    id="cvc"
                                    placeholder="123"
                                    required
                                    maxLength={3}
                                    type="password"
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        size="lg"
                        type="submit"
                        form="payment-form"
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Payment;
