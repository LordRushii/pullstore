import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            sku: "TEE-WHT-CLSC",
            name: "Classic White Tee",
            price: 20,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1696086152504-4843b2106ab4?q=80&w=300",
            size: "M",
            color: "White",
        },
        {
            id: 2,
            sku: "SHO-TAN-STRAP",
            name: "Tan Strap Sneakers",
            price: 65,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1631984564919-1f6b2313a71c?q=80&w=300",
            size: "9",
            color: "Tan",
        },
    ]);

    const updateQuantity = (id, change) => {
        setCartItems(
            cartItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const shipping = 10;
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">
                        Looks like you haven't added anything to your cart yet.
                    </p>
                    <Link
                        to="/shop"
                        className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex gap-6 p-6 bg-white rounded-xl border border-gray-100 shadow-sm"
                        >
                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-lg">{item.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            Size: {item.size} | Color: {item.color}
                                        </p>
                                    </div>
                                    <p className="font-semibold">${item.price}</p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center border rounded-lg">
                                        <button
                                            className="px-3 py-2 hover:bg-gray-50 transition"
                                            onClick={() => updateQuantity(item.id, -1)}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-4 py-2 text-sm font-medium border-x">
                                            {item.quantity}
                                        </span>
                                        <button
                                            className="px-3 py-2 hover:bg-gray-50 transition"
                                            onClick={() => updateQuantity(item.id, 1)}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500 hover:text-red-700 p-2 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${subtotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>${shipping}</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${total}</span>
                            </div>
                        </div>

                        <button
                            className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors mt-6"
                            onClick={() => {
                                alert("Checkout successful! Redirecting to your profile...");
                                navigate("/profile");
                            }}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
