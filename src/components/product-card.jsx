import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const ProductCard = ({ product }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);

  // Fallback if no product is passed (for dev/preview)
  if (!product) {
    product = {
      sku: "demo-1",
      name: "Classic White Tee",
      price: 29,
      image: "https://images.unsplash.com/photo-1589810635657-232948472d98?w=1000",
      category: "Apparel",
      inStock: true
    };
  }

  const { contextSafe } = useGSAP({ scope: cardRef });

  const onEnter = contextSafe(() => {
    gsap.to(imageRef.current, { scale: 1.1, filter: "grayscale(0%)", duration: 0.5, ease: "power2.out" });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" });
  });

  const onLeave = contextSafe(() => {
    gsap.to(imageRef.current, { scale: 1, filter: "grayscale(100%)", duration: 0.5, ease: "power2.out" });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
  });

  return (
    <Link
      to={`/product/${product.sku}`}
      className="group block relative"
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={`View details for ${product.name}`}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4] border-2 border-transparent group-hover:border-border transition-all duration-300">
        <img
          ref={imageRef}
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover grayscale scale-100"
        />

        {/* Overlay Actions */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0"
        >
          <Button variant="brutalist" size="icon" className="rounded-full" aria-label="Add to cart">
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>

        {/* Badges */}
        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-bold uppercase px-2 py-1 border border-destructive-foreground">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-4 flex justify-between items-start">
        <div>
          <h3 className="font-heading font-bold text-lg uppercase tracking-tight group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            {product.category}
          </p>
        </div>
        <p className="font-bold text-lg">
          ${product.price}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;