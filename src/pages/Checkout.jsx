import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import gsap from "gsap";

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal } = useCart();
    const containerRef = useRef(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        zipCode: "",
        country: ""
    });

    const shipping = cartItems.length > 0 ? 10 : 0;
    const total = cartTotal + shipping;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".checkout-fade-in", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, we would save the address here
        navigate("/payment");
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12" ref={containerRef}>
            <h1 className="text-3xl font-bold mb-8 checkout-fade-in">Checkout</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 checkout-fade-in">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="123 Main St"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="New York"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zipCode">ZIP Code</Label>
                                        <Input
                                            id="zipCode"
                                            name="zipCode"
                                            required
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            placeholder="10001"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        required
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        placeholder="United States"
                                    />
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 checkout-fade-in">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            {item.name} x {item.quantity}
                                        </span>
                                        <span className="font-medium">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                size="lg"
                                type="submit"
                                form="checkout-form"
                            >
                                Proceed to Payment
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
