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
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-background">
                <h2 className="text-4xl font-heading font-bold uppercase mb-4">Your cart is empty</h2>
                <Button onClick={() => navigate("/shop")} size="lg">Continue Shopping</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12" ref={containerRef}>
            <div className="container-wide">
                <h1 className="text-5xl md:text-7xl font-heading font-bold uppercase tracking-tighter mb-12 border-b-2 border-border pb-6 checkout-fade-in">
                    Checkout
                </h1>

                <div className="grid lg:grid-cols-3 gap-12 lg:gap-24">
                    <div className="lg:col-span-2 checkout-fade-in">
                        <div className="border-2 border-border bg-background p-8">
                            <h2 className="text-2xl font-heading font-bold uppercase mb-8">Shipping Information</h2>
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="uppercase font-bold text-xs tracking-widest">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="JOHN"
                                            className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="uppercase font-bold text-xs tracking-widest">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="DOE"
                                            className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="uppercase font-bold text-xs tracking-widest">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="JOHN@EXAMPLE.COM"
                                        className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address" className="uppercase font-bold text-xs tracking-widest">Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="123 MAIN ST"
                                        className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="city" className="uppercase font-bold text-xs tracking-widest">City</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="NEW YORK"
                                            className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zipCode" className="uppercase font-bold text-xs tracking-widest">ZIP Code</Label>
                                        <Input
                                            id="zipCode"
                                            name="zipCode"
                                            required
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            placeholder="10001"
                                            className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country" className="uppercase font-bold text-xs tracking-widest">Country</Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        required
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        placeholder="UNITED STATES"
                                        className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-1 checkout-fade-in">
                        <div className="border-2 border-border bg-secondary/10 p-8 sticky top-24">
                            <h2 className="text-2xl font-heading font-bold uppercase mb-8">Order Summary</h2>
                            <div className="space-y-4 mb-8">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground font-bold uppercase">
                                            {item.name} <span className="text-xs">x {item.quantity}</span>
                                        </span>
                                        <span className="font-bold">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t-2 border-border my-6"></div>

                            <div className="space-y-2 mb-8 text-lg">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-foreground">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span className="font-bold text-foreground">${shipping.toFixed(2)}</span>
                                </div>
                                <div className="border-t-2 border-border pt-4 flex justify-between font-heading font-bold text-2xl uppercase">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full h-16 text-lg"
                                size="lg"
                                type="submit"
                                form="checkout-form"
                                variant="brutalist"
                            >
                                Proceed to Payment
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
