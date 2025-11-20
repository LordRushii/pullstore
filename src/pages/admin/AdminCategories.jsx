import { useState } from "react";
import { products } from "../../data/mockData";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const AdminCategories = () => {
    const uniqueCategories = [...new Set(products.map((p) => p.category))];
    const [categories, setCategories] = useState(
        uniqueCategories.map((c, i) => ({ id: i, name: c, count: products.filter(p => p.category === c).length }))
    );

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            setCategories(categories.filter((c) => c.id !== id));
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Button className="flex items-center gap-2">
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
                                        <Button variant="ghost" size="icon">
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
        </div>
    );
};

export default AdminCategories;
