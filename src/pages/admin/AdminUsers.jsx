import { useState, useEffect } from "react";
import { usersApi } from "../../lib/apiService";
import { Users, Pencil, Trash2, X, Shield, User as UserIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "user",
        isActive: true,
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await usersApi.getAll();
            setUsers(data.users || []);
            setLoading(false);
        } catch (error) {
            console.error("Error loading users:", error);
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (user) => {
        if (user.role === "admin") {
            alert("Cannot delete admin users. Change role to user first.");
            return;
        }

        if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
            try {
                await usersApi.delete(user._id);
                await loadUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!editingUser) return;

        try {
            await usersApi.update(editingUser._id, formData);
            await loadUsers();
            setIsDialogOpen(false);
            setFormData({ name: "", email: "", role: "user", isActive: true });
        } catch (error) {
            console.error("Error updating user:", error);
            alert(error.message || "Failed to update user");
        }
    };

    const getRoleBadgeClass = (role) => {
        return role === "admin"
            ? "bg-purple-50 border-purple-600 text-purple-600"
            : "bg-blue-50 border-blue-600 text-blue-600";
    };

    const getStatusBadgeClass = (isActive) => {
        return isActive
            ? "bg-green-50 border-green-600 text-green-600"
            : "bg-red-50 border-red-600 text-red-600";
    };

    if (loading) {
        return (
            <div className="p-6 md:p-12 min-h-screen bg-background">
                <div className="text-center py-20 text-2xl font-heading font-bold uppercase animate-pulse">
                    Loading Users...
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-12 min-h-screen bg-background">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-5xl font-heading font-bold uppercase tracking-tighter">Users</h1>
                    <p className="text-muted-foreground uppercase tracking-widest text-sm mt-2">
                        {users.length} Total Users
                    </p>
                </div>
                <Button onClick={loadUsers} variant="outline" size="lg" className="gap-2 uppercase font-bold border-2">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </Button>
            </div>

            <div className="bg-background border-2 border-border">
                <Table>
                    <TableHeader className="bg-secondary/10">
                        <TableRow className="border-b-2 border-border hover:bg-transparent">
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground h-12">Name</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground">Email</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground">Role</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground">Status</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-xs text-foreground">Joined</TableHead>
                            <TableHead className="text-right font-bold uppercase tracking-widest text-xs text-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id} className="border-b border-border hover:bg-secondary/5 group">
                                <TableCell className="font-bold uppercase">{user.name}</TableCell>
                                <TableCell className="font-mono text-sm text-muted-foreground">{user.email}</TableCell>
                                <TableCell>
                                    <span
                                        className={`px-3 py-1 border-2 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 ${getRoleBadgeClass(
                                            user.role
                                        )}`}
                                    >
                                        {user.role === "admin" ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`px-3 py-1 border-2 text-xs font-bold uppercase tracking-wider ${getStatusBadgeClass(
                                            user.isActive
                                        )}`}
                                    >
                                        {user.isActive ? "Active" : "Inactive"}
                                    </span>
                                </TableCell>
                                <TableCell className="font-mono text-sm text-muted-foreground">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(user)}
                                            className="hover:bg-accent hover:text-accent-foreground rounded-none"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(user)}
                                            className="hover:bg-destructive hover:text-destructive-foreground rounded-none"
                                            disabled={user.role === "admin"}
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

            {/* Edit User Dialog */}
            {isDialogOpen && editingUser && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-background border-2 border-border p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-8 border-b-2 border-border pb-4">
                            <h2 className="text-2xl font-heading font-bold uppercase">Edit User</h2>
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="p-2 hover:bg-destructive hover:text-destructive-foreground transition-colors border-2 border-transparent hover:border-destructive"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="uppercase font-bold text-xs tracking-widest">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus-visible:ring-0 focus-visible:border-foreground"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="uppercase font-bold text-xs tracking-widest">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="rounded-none border-2 border-border h-12 px-4 font-bold focus-visible:ring-0 focus-visible:border-foreground"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role" className="uppercase font-bold text-xs tracking-widest">
                                    Role
                                </Label>
                                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                                    <SelectTrigger className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus:ring-0 focus:border-foreground">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-2 border-border">
                                        <SelectItem value="user" className="font-bold uppercase focus:bg-accent focus:text-accent-foreground">
                                            User
                                        </SelectItem>
                                        <SelectItem value="admin" className="font-bold uppercase focus:bg-accent focus:text-accent-foreground">
                                            Admin
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="isActive" className="uppercase font-bold text-xs tracking-widest">
                                    Status
                                </Label>
                                <Select
                                    value={formData.isActive ? "active" : "inactive"}
                                    onValueChange={(value) => setFormData({ ...formData, isActive: value === "active" })}
                                >
                                    <SelectTrigger className="rounded-none border-2 border-border h-12 px-4 font-bold uppercase focus:ring-0 focus:border-foreground">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-2 border-border">
                                        <SelectItem value="active" className="font-bold uppercase focus:bg-accent focus:text-accent-foreground">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="inactive" className="font-bold uppercase focus:bg-accent focus:text-accent-foreground">
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
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
                                    Update User
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
