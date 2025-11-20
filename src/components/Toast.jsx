import { useState, useEffect } from "react";
import { Check } from "lucide-react";

export const Toast = ({ message, show, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
                <Check className="w-5 h-5" />
                <span className="font-medium">{message}</span>
            </div>
        </div>
    );
};
