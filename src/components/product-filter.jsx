import { PlusIcon, XCircleIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
import { products } from "@/data/mockData";

const categories = [...new Set(products.map((item) => item.category))];

const ProductFilter = () => {
  const [filter, setFilter] = useState({
    search: "",
    category: "",
  });

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
    if (!filter.search && !filter.category) return ["all"];
    return products.filter(isEligible).map((product) => product.sku);
  }, [filter.category, filter.search, isEligible]);

  return (
    <div className="bg-background container min-h-280 py-8 sm:py-12 xl:py-20">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-medium sm:text-3xl lg:text-4xl">Browse Products</h2>
        <p className="text-muted-foreground mt-1 max-w-md text-center max-sm:text-sm">
          Find what you need by filtering through our selection of items across categories.
        </p>
      </div>
      <div className="mt-4 flex gap-4 rounded-md sm:mt-8 lg:mt-12">
        <div className="max-lg:w-1/2 lg:w-50">
          <Label>Search</Label>
          <Input
            placeholder="Search by name"
            value={filter.search}
            className="w-full"
            autoFocus
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
        </div>
        <div className="max-lg:w-1/2 lg:w-50">
          <Label>Category</Label>
          <Select value={filter.category} onValueChange={(e) => setFilter({ ...filter, category: e })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {categories.map((item, index) => (
                  <SelectItem value={item} key={index}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 lg:mt-6">
        <div className="flex items-center justify-between gap-2 max-sm:text-sm">
          <span className="">Here's What We Found...</span>
          {visibleProductKeys[0] !== "all" && (
            <button
              className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5"
              onClick={() => setFilter({ search: "", category: "" })}>
              <XCircleIcon className="size-3.5" />
              <span>Clear filter</span>
            </button>
          )}
        </div>
        {visibleProductKeys[0] === "all" || visibleProductKeys.length > 0 ? (
          <FlipReveal
            className="mt-3 grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
            keys={visibleProductKeys}
            showClass="flex"
            hideClass="hidden">
            {products.map((product) => (
              <FlipRevealItem flipKey={product.sku} key={product.sku}>
                <Link to={`/product/${product.sku}`} className="group relative w-full cursor-pointer block">
                  <div className="bg-muted absolute -inset-2 scale-50 rounded-md opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100"></div>
                  <div className="relative">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-32 w-full rounded-md object-cover sm:h-40 xl:h-50"
                      />
                      <div className="bg-background absolute end-1 bottom-1 z-1 flex items-center gap-0.5 rounded px-1 py-0.5 text-xs opacity-0 transition-all group-hover:opacity-100">
                        <PlusIcon className="size-3" />
                        Add Item
                      </div>
                    </div>
                    <div className="mt-3 flex items-end justify-between gap-1">
                      <div>
                        <p className="text-muted-foreground font-mono text-[10px]/none tracking-wider uppercase">
                          {product.category}
                        </p>
                        <p className="mt-1 line-clamp-1 leading-none font-medium max-sm:text-sm">
                          {product.name}
                        </p>
                      </div>
                      <p>
                        <sup className="text-muted-foreground">$</sup>
                        <span className="text-xl font-medium">{product.price}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              </FlipRevealItem>
            ))}
          </FlipReveal>
        ) : (
          <div className="text-muted-foreground mt-12 text-center">No products found</div>
        )}
      </div>
    </div>
  );
};

export default ProductFilter;