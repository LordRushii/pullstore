import { useState, useEffect } from "react";
import { Check, AlertCircle } from "lucide-react";
import gsap from "gsap";

export const Toast = ({ message, show, onClose, type = "success" }) => {
    useEffect(() => {
        if (show) {
            gsap.fromTo(".toast-notification",
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.4, ease: "power4.out" }
            );

            const timer = setTimeout(() => {
                gsap.to(".toast-notification", {
                    x: 100,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power4.in",
                    onComplete: onClose
                });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    const isSuccess = type === "success";

    return (
        <div className="fixed top-24 right-4 z-50 toast-notification">
            <div className={`
                border-2 border-black px-6 py-4 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                ${isSuccess ? "bg-white text-black" : "bg-red-600 text-white"}
            `}>
                {isSuccess ? (
                    <Check className="w-6 h-6 stroke-[3]" />
                ) : (
                    <AlertCircle className="w-6 h-6 stroke-[3]" />
                )}
                <span className="font-bold uppercase tracking-wider text-sm">{message}</span>
            </div>
        </div>
    );
};
