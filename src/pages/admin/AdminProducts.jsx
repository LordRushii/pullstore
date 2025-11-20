import { useState } from "react";
import { products as initialProducts } from "../../data/mockData";
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
    const [products, setProducts] = useState(initialProducts);
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

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (sku) => {
        if (confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter((p) => p.sku !== sku));
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const productData = {
            ...formData,
            price: Number(formData.price),
            sizes: ["S", "M", "L", "XL"],
            colors: ["Default"],
        };

        if (editingProduct) {
            // Update existing product
            setProducts(
                products.map((p) => (p.sku === editingProduct.sku ? productData : p))
            );
        } else {
            // Add new product
            setProducts([...products, productData]);
        }

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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <Button onClick={handleAdd} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Product
                </Button>
            </div>

            <div className="mb-6">
                <div className="relative max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search products..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.sku}>
                                <TableCell>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-10 h-10 rounded-md object-cover"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.sku}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(product)}
                                        >
                                            <Pencil className="w-4 h-4 text-blue-500" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(product.sku)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {editingProduct ? "Edit Product" : "Add Product"}
                            </h2>
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="sku">SKU</Label>
                                <Input
                                    id="sku"
                                    value={formData.sku}
                                    onChange={(e) =>
                                        setFormData({ ...formData, sku: e.target.value })
                                    }
                                    required
                                    disabled={!!editingProduct}
                                />
                            </div>

                            <div>
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({ ...formData, price: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="image">Image URL</Label>
                                <Input
                                    id="image"
                                    value={formData.image}
                                    onChange={(e) =>
                                        setFormData({ ...formData, image: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="3"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="inStock"
                                    checked={formData.inStock}
                                    onChange={(e) =>
                                        setFormData({ ...formData, inStock: e.target.checked })
                                    }
                                    className="w-4 h-4"
                                />
                                <Label htmlFor="inStock">In Stock</Label>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1">
                                    {editingProduct ? "Update" : "Create"}
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
