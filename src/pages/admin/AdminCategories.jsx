import { useState, useEffect } from "react";
import { categoriesApi, productsApi } from "../../lib/apiService";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "" });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [categoriesData, productsData] = await Promise.all([
                categoriesApi.getAll(),
                productsApi.getAll(),
            ]);
            setCategories(categoriesData);
            setProducts(productsData);
            setLoading(false);
        } catch (error) {
            console.error("Error loading data:", error);
            setLoading(false);
        }
    };

    const getCategoryProductCount = (categoryName) => {
        return products.filter((p) => p.category === categoryName).length;
    };

    const handleDelete = async (category) => {
        const productCount = getCategoryProductCount(category.name);
        
        if (productCount > 0) {
            alert(`Cannot delete category "${category.name}" because it has ${productCount} product(s). Remove or reassign the products first.`);
            return;
        }

        if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
            try {
                await categoriesApi.delete(category._id);
                await loadData();
            } catch (error) {
                console.error("Error deleting category:", error);
                alert("Failed to delete category");
            }
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({ 
            name: category.name,
            description: category.description || ""
        });
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setEditingCategory(null);
        setFormData({ name: "", description: "" });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                // Update existing category
                await categoriesApi.update(editingCategory._id, formData);
            } else {
                // Add new category
                await categoriesApi.create(formData);
            }

            await loadData();
            setIsDialogOpen(false);
            setFormData({ name: "", description: "" });
        } catch (error) {
            console.error("Error saving category:", error);
            alert(error.message || "Failed to save category");
        }
    };

    if (loading) {
        return (
            <div className="p-6 md:p-12 min-h-screen bg-background">
                <div className="text-center py-20 text-2xl font-heading font-bold uppercase animate-pulse">
                    Loading Categories...
                </div>
            </div>
        );
    }

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
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground">Slug</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground">Product Count</TableHead>
                            <TableHead className="text-right font-bold uppercase tracking-widest text-xs text-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category._id} className="border-b border-border hover:bg-secondary/5 group">
                                <TableCell className="font-bold uppercase text-lg">{category.name}</TableCell>
                                <TableCell className="font-mono text-sm text-muted-foreground">{category.slug}</TableCell>
                                <TableCell className="font-mono font-bold">{getCategoryProductCount(category.name)}</TableCell>
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
                                            onClick={() => handleDelete(category)}
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
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                    placeholder="E.G., ELECTRONICS, APPAREL"
                                    className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="uppercase font-bold text-xs tracking-widest">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    placeholder="Brief description of the category"
                                    className="rounded-none border-2 border-border px-4 py-3 focus-visible:ring-0 focus-visible:border-foreground min-h-[100px]"
                                    rows={3}
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
