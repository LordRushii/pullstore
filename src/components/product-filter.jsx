import { XCircleIcon } from "lucide-react";
import { useCallback, useMemo, useState, useEffect } from "react";
import { FlipReveal, FlipRevealItem } from "@/components/gsap/flip-reveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dataLayer } from "@/lib/apiService";
import ProductCard from "./product-card";
import { Button } from "./ui/button";

const ProductFilter = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    search: "",
    category: "",
  });

  useEffect(() => {
    const loadProducts = async () => {
      const data = await dataLayer.getProducts();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const categories = useMemo(() => [...new Set(products.map((item) => item.category))], [products]);

  const isEligible = useCallback(
    (product) => {
      const search = filter.search?.toLowerCase() ?? "";
      const category = filter.category;
      const matchesSearch = search.length === 0 || product.name.toLowerCase().includes(search);
      const matchesCategory = !category || product.category === category;

      return matchesSearch && matchesCategory;
    },
    [filter],
  );

  const visibleProductKeys = useMemo(() => {
    if (loading) return [];
    if (!filter.search && !filter.category) return ["all"];
    return products.filter(isEligible).map((product) => product.sku);
  }, [filter.category, filter.search, isEligible, products, loading]);

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 border-b-2 border-border pb-8">
        <div>
          <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter mb-2">
            Catalog
          </h2>
          <p className="text-muted-foreground uppercase tracking-widest text-sm">
            {products.length} Items Available
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-end" role="search" aria-label="Product filters">
          <div className="w-full sm:w-64">
            <Label htmlFor="product-search" className="uppercase font-bold text-xs tracking-widest mb-2 block">Search</Label>
            <Input
              id="product-search"
              placeholder="SEARCH PRODUCTS..."
              value={filter.search}
              className="w-full rounded-none border-2 border-border bg-background h-12 px-4 font-bold uppercase placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-accent transition-colors"
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              aria-label="Search products"
            />
          </div>
          <div className="w-full sm:w-48">
            <Label htmlFor="category-select" className="uppercase font-bold text-xs tracking-widest mb-2 block">Category</Label>
            <Select value={filter.category} onValueChange={(e) => setFilter({ ...filter, category: e })}>
              <SelectTrigger id="category-select" className="w-full rounded-none border-2 border-border bg-background h-12 px-4 font-bold uppercase focus:ring-0 focus:border-accent" aria-label="Select category">
                <SelectValue placeholder="ALL CATEGORIES" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-2 border-border">
                <SelectGroup>
                  <SelectLabel className="uppercase font-bold text-xs tracking-widest">Category</SelectLabel>
                  {categories.map((item, index) => (
                    <SelectItem value={item} key={index} className="uppercase font-bold focus:bg-accent focus:text-accent-foreground rounded-none cursor-pointer">
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {(filter.search || filter.category) && (
            <Button
              variant="outline"
              onClick={() => setFilter({ search: "", category: "" })}
              className="h-12 rounded-none border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground uppercase font-bold"
              aria-label="Clear filters"
            >
              <XCircleIcon className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8" aria-live="polite">
        {loading ? (
          <div className="text-center py-20 text-2xl font-heading font-bold uppercase animate-pulse">Loading Inventory...</div>
        ) : (
          <>
            {visibleProductKeys[0] === "all" || visibleProductKeys.length > 0 ? (
              <FlipReveal
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
                keys={visibleProductKeys}
                showClass="block"
                hideClass="hidden">
                {products.map((product) => (
                  <FlipRevealItem flipKey={product.sku} key={product.sku}>
                    <ProductCard product={product} />
                  </FlipRevealItem>
                ))}
              </FlipReveal>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-2xl font-heading font-bold uppercase mb-4">No Matches Found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductFilter;