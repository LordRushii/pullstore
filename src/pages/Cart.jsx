import { Trash2, ShoppingBag, Minus, Plus, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

    const shipping = cartItems.length > 0 ? 10 : 0;
    const subtotal = cartTotal;
    const total = subtotal + shipping;

    const handleCheckout = () => {
        navigate("/checkout");
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-background">
                <div className="text-center">
                    <div className="w-24 h-24 border-2 border-border rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-4xl font-heading font-bold uppercase mb-4">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Looks like you haven't added anything to your cart yet.
                    </p>
                    <Link to="/shop">
                        <Button size="lg" className="text-lg px-8">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container-wide">
                <h1 className="text-5xl md:text-7xl font-heading font-bold uppercase tracking-tighter mb-12 border-b-2 border-border pb-6">
                    Shopping Cart <span className="text-2xl text-muted-foreground align-top ml-2">({cartItems.length})</span>
                </h1>

                <div className="grid lg:grid-cols-3 gap-12 lg:gap-24">
                    <div className="lg:col-span-2 space-y-8">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-border last:border-0"
                            >
                                <div className="w-full sm:w-40 aspect-[3/4] bg-secondary/20 border border-border overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="font-heading font-bold text-2xl uppercase mb-2">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mb-1">
                                                {item.size && `Size: ${item.size}`} {item.color && `| ${item.color}`}
                                            </p>
                                            <p className="text-sm text-muted-foreground font-mono uppercase">
                                                SKU: {item.sku || 'N/A'}
                                            </p>
                                        </div>
                                        <p className="font-bold text-xl">${item.price}</p>
                                    </div>

                                    <div className="flex justify-between items-end mt-6">
                                        <div className="flex items-center border-2 border-border">
                                            <button
                                                className="w-10 h-10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-12 text-center font-bold text-lg">
                                                {item.quantity}
                                            </span>
                                            <button
                                                className="w-10 h-10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2 uppercase font-bold text-xs tracking-widest"
                                        >
                                            <Trash2 className="w-4 h-4" /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-secondary/10 border-2 border-border p-8 sticky top-24">
                            <h2 className="text-2xl font-heading font-bold uppercase mb-8">Order Summary</h2>

                            <div className="space-y-4 mb-8 text-lg">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-foreground">${subtotal.toFixed(2)}</span>
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
                                onClick={handleCheckout}
                                variant="brutalist"
                            >
                                Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>

                            <div className="mt-6 text-xs text-center text-muted-foreground uppercase tracking-widest">
                                Secure Checkout • Free Returns
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
