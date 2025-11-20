import { useRef, useState } from "react";
import { ChevronDown, Ruler, ShoppingCart } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SpringButton } from "./spring-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

const ProductCard = () => {
  const [infoVisible, setInfoVisible] = useState(false);
  const contentRef = useRef(null);
  const { contextSafe } = useGSAP();

  const toggleProductInfo = contextSafe(() => {
    const content = contentRef.current;
    if (!content) return;

    if (infoVisible) {
      // Hide
      gsap.to(content, {
        height: 0,
        opacity: 0,
        filter: "blur(4px)",
        duration: 0.6,
        ease: "circ.in",
        onComplete: () => gsap.set(content, { display: "none" }),
      });
    } else {
      // Show
      gsap.set(content, { display: "block", height: "auto" });
      const height = content.offsetHeight;
      gsap.fromTo(
        content,
        { height: 0, opacity: 0, filter: "blur(4px)" },
        {
          height,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "expo.out",
        }
      );
    }
    setInfoVisible(!infoVisible);
  });

  return (
    <div className="group w-80 cursor-pointer">
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1589810635657-232948472d98?w=1000"
          alt="Classic White Tee"
          className="w-full h-96 object-cover rounded-xl shadow-lg"
        />

        <div
          className={cn(
            "absolute inset-x-4 bottom-4 rounded-lg bg-white/60 backdrop-blur-xs transition-all",
            infoVisible && "bg-white/90"
          )}
        >
          <div
            onClick={toggleProductInfo}
            role="button"
            tabIndex={0}
            className={cn(
              "flex items-start justify-between p-4 hover:bg-white/70 transition-all rounded-lg",
              infoVisible && "rounded-t-lg"
            )}
          >
            <div>
              <p
                className={cn(
                  "font-semibold text-lg transition-all",
                  infoVisible && "text-2xl"
                )}
              >
                Classic White Tee
              </p>
              <p className="text-2xl font-bold mt-1">
                $<span className={infoVisible ? "text-3xl" : "text-2xl"}>29</span>
              </p>
            </div>
            <div className="bg-white rounded-full p-1 shadow-md">
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-gray-600 transition-transform",
                  infoVisible && "rotate-180"
                )}
              />
            </div>
          </div>

          <div ref={contentRef} className="hidden overflow-hidden">
            <div className="px-4 pb-4">
              {/* Sizes */}
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-600">Sizes</span>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Ruler className="w-4 h-4" />
                  Chart
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                {["Small", "Medium"].map((size) => (
                  <button key={size} className="px-3 py-1 border rounded text-sm hover:bg-gray-100 transition">
                    {size}
                  </button>
                ))}
                <button className="px-3 py-1 border rounded text-sm opacity-50 grayscale" disabled>
                  Large
                </button>
              </div>

              {/* Colors */}
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-600">Colors</span>
                <span className="text-xs text-gray-600 hover:underline cursor-pointer">
                  Custom color?
                </span>
              </div>

              <TooltipProvider>
                <div className="flex gap-3 mb-5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-8 h-8 rounded-full bg-red-500 shadow cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-red-500 transition" />
                    </TooltipTrigger>
                    <TooltipContent>Red</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-8 h-8 rounded-full bg-teal-500 shadow cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-teal-500 transition" />
                    </TooltipTrigger>
                    <TooltipContent>Teal</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-8 h-8 rounded-full bg-blue-400 opacity-40 shadow cursor-not-allowed" />
                    </TooltipTrigger>
                    <TooltipContent>Blue (Out of stock)</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-8 h-8 rounded-full bg-pink-500 shadow cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-pink-500 transition" />
                    </TooltipTrigger>
                    <TooltipContent>Pink</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>

              {/* Add to cart */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In stock</span>
                <SpringButton className="bg-black text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800">
                  <ShoppingCart className="w-4 h-4" />
                  Add to cart
                </SpringButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;