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
        <div className="p-6 md:p-12 min-h-screen bg-background">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-5xl font-heading font-bold uppercase tracking-tighter">Categories</h1>
                <Button onClick={handleAdd} className="flex items-center gap-2 h-12 px-6" variant="brutalist">
                    <Plus className="w-5 h-5" /> ADD CATEGORY
                </Button>
            </div>

            <div className="bg-background border-2 border-border max-w-4xl">
                <Table>
                    <TableHeader className="bg-secondary/10">
                        <TableRow className="border-b-2 border-border hover:bg-transparent">
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground h-12">Name</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground">Product Count</TableHead>
                            <TableHead className="text-right font-bold uppercase tracking-widest text-xs text-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id} className="border-b border-border hover:bg-secondary/5 group">
                                <TableCell className="font-bold uppercase text-lg">{category.name}</TableCell>
                                <TableCell className="font-mono font-bold">{category.count}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(category)}
                                            className="hover:bg-accent hover:text-accent-foreground rounded-none"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(category.id)}
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

            {/* Category Dialog */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-background border-2 border-border p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-8 border-b-2 border-border pb-4">
                            <h2 className="text-2xl font-heading font-bold uppercase">
                                {editingCategory ? "Edit Category" : "Add Category"}
                            </h2>
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="p-2 hover:bg-destructive hover:text-destructive-foreground transition-colors border-2 border-transparent hover:border-destructive"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="uppercase font-bold text-xs tracking-widest">Category Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ name: e.target.value })
                                    }
                                    required
                                    placeholder="E.G., ELECTRONICS, APPAREL"
                                    className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                />
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
