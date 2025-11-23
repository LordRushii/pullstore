import { useState, useEffect } from "react";
import { dataLayer } from "../../lib/dataLayer";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            const products = await dataLayer.getProducts();
            const uniqueCategories = [...new Set(products.map((p) => p.category))];
            setCategories(
                uniqueCategories.map((c, i) => ({
                    id: i,
                    name: c,
                    count: products.filter((p) => p.category === c).length,
                }))
            );
        };
        loadCategories();
    }, []);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: "" });

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            setCategories(categories.filter((c) => c.id !== id));
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({ name: category.name });
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setEditingCategory(null);
        setFormData({ name: "" });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingCategory) {
            // Update existing category
            setCategories(
                categories.map((c) =>
                    c.id === editingCategory.id ? { ...c, name: formData.name } : c
                )
            );
        } else {
            // Add new category
            const newCategory = {
                id: Math.max(...categories.map((c) => c.id), 0) + 1,
                name: formData.name,
                count: 0,
            };
            setCategories([...categories, newCategory]);
        }

        setIsDialogOpen(false);
        setFormData({ name: "" });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Button onClick={handleAdd} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Category
                </Button>
            </div>

            <div className="bg-white rounded-lg border shadow-sm max-w-3xl">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Product Count</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell>{category.count}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(category)}
                                        >
                                            <Pencil className="w-4 h-4 text-blue-500" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(category.id)}
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

            {/* Category Dialog */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {editingCategory ? "Edit Category" : "Add Category"}
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
                                <Label htmlFor="name">Category Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ name: e.target.value })
                                    }
                                    required
                                    placeholder="e.g., Electronics, Apparel"
                                />
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
                                    {editingCategory ? "Update" : "Create"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
