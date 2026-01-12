import { useState, useEffect } from "react";
import { dataLayer } from "../../lib/apiService";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        sku: "",
        name: "",
        category: "",
        price: "",
        image: "",
        description: "",
        inStock: true,
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const data = await dataLayer.getProducts();
        setProducts(data);
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (sku) => {
        if (confirm("Are you sure you want to delete this product?")) {
            await dataLayer.deleteProduct(sku);
            loadProducts();
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            sku: product.sku,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            description: product.description || "",
            inStock: product.inStock,
        });
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setFormData({
            sku: "",
            name: "",
            category: "",
            price: "",
            image: "",
            description: "",
            inStock: true,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            ...formData,
            price: Number(formData.price),
            sizes: ["S", "M", "L", "XL"],
            colors: ["Default"],
        };

        if (editingProduct) {
            await dataLayer.updateProduct(editingProduct.sku, productData);
        } else {
            await dataLayer.createProduct(productData);
        }

        loadProducts();
        setIsDialogOpen(false);
        setFormData({
            sku: "",
            name: "",
            category: "",
            price: "",
            image: "",
            description: "",
            inStock: true,
        });
    };

    return (
        <div className="p-6 md:p-12 min-h-screen bg-background">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <h1 className="text-5xl font-heading font-bold uppercase tracking-tighter">Products</h1>
                <Button onClick={handleAdd} className="flex items-center gap-2 h-12 px-6" variant="brutalist">
                    <Plus className="w-5 h-5" /> ADD PRODUCT
                </Button>
            </div>

            <div className="mb-8">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="SEARCH INVENTORY..."
                        className="pl-12 h-12 rounded-none border-2 border-border font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-background border-2 border-border">
                <Table>
                    <TableHeader className="bg-secondary/10">
                        <TableRow className="border-b-2 border-border hover:bg-transparent">
                            <TableHead className="w-[100px] font-bold uppercase tracking-widest text-xs text-foreground h-12">Image</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground">Name</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground">SKU</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground">Category</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground">Price</TableHead>
                            <TableHead className="text-right font-bold uppercase tracking-widest text-xs text-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.sku} className="border-b border-border hover:bg-secondary/5 group">
                                <TableCell>
                                    <div className="w-12 h-12 border border-border overflow-hidden bg-secondary/20">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-bold uppercase">{product.name}</TableCell>
                                <TableCell className="font-mono text-sm text-muted-foreground">{product.sku}</TableCell>
                                <TableCell className="uppercase text-sm font-bold tracking-wider">{product.category}</TableCell>
                                <TableCell className="font-mono font-bold">${product.price}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(product)}
                                            className="hover:bg-accent hover:text-accent-foreground rounded-none"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(product.sku)}
                                            className="hover:bg-destructive hover:text-destructive-foreground rounded-none"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Product Dialog */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-background border-2 border-border p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-8 border-b-2 border-border pb-4">
                            <h2 className="text-2xl font-heading font-bold uppercase">
                                {editingProduct ? "Edit Product" : "Add Product"}
                            </h2>
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="p-2 hover:bg-destructive hover:text-destructive-foreground transition-colors border-2 border-transparent hover:border-destructive"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="sku" className="uppercase font-bold text-xs tracking-widest">SKU</Label>
                                    <Input
                                        id="sku"
                                        value={formData.sku}
                                        onChange={(e) =>
                                            setFormData({ ...formData, sku: e.target.value })
                                        }
                                        required
                                        disabled={!!editingProduct}
                                        className="rounded-none border-2 border-border h-10 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="uppercase font-bold text-xs tracking-widest">Price</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({ ...formData, price: e.target.value })
                                        }
                                        required
                                        className="rounded-none border-2 border-border h-10 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name" className="uppercase font-bold text-xs tracking-widest">Product Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                    className="rounded-none border-2 border-border h-10 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category" className="uppercase font-bold text-xs tracking-widest">Category</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value })
                                    }
                                    required
                                    className="rounded-none border-2 border-border h-10 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image" className="uppercase font-bold text-xs tracking-widest">Image URL</Label>
                                <Input
                                    id="image"
                                    value={formData.image}
                                    onChange={(e) =>
                                        setFormData({ ...formData, image: e.target.value })
                                    }
                                    required
                                    className="rounded-none border-2 border-border h-10 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="uppercase font-bold text-xs tracking-widest">Description</Label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border-2 border-border rounded-none font-medium focus:outline-none focus:border-foreground min-h-[100px]"
                                    rows="3"
                                />
                            </div>

                            <div className="flex items-center gap-3 border-2 border-border p-4 bg-secondary/5">
                                <input
                                    type="checkbox"
                                    id="inStock"
                                    checked={formData.inStock}
                                    onChange={(e) =>
                                        setFormData({ ...formData, inStock: e.target.checked })
                                    }
                                    className="w-5 h-5 accent-foreground rounded-none"
                                />
                                <Label htmlFor="inStock" className="uppercase font-bold text-xs tracking-widest cursor-pointer">In Stock</Label>
                            </div>

                            <div className="flex gap-4 pt-4 border-t-2 border-border">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="flex-1 h-12 uppercase font-bold border-2"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1 h-12" variant="brutalist">
                                    {editingProduct ? "Update Product" : "Create Product"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
