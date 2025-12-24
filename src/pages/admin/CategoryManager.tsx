import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Loader2, Save, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "@/store/slices/categoriesSlice";
import { useToast } from "@/hooks/use-toast";

const CategoryManager = () => {
    const dispatch = useAppDispatch();
    const { categories, loading, error } = useAppSelector((state) => state.categories);
    const { toast } = useToast();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ name: "" });

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        try {
            if (editingId) {
                await dispatch(updateCategory({ id: editingId, name: formData.name })).unwrap();
                toast({ title: "Berhasil", description: "Kategori berhasil diperbarui" });
            } else {
                await dispatch(createCategory(formData.name)).unwrap();
                toast({ title: "Berhasil", description: "Kategori berhasil ditambahkan" });
            }
            resetForm();
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Gagal menyimpan kategori",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;
        try {
            await dispatch(deleteCategory(id)).unwrap();
            toast({ title: "Berhasil", description: "Kategori berhasil dihapus" });
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Gagal menghapus kategori (mungkin masih digunakan produk)",
                variant: "destructive",
            });
        }
    };

    const handleEdit = (category: typeof categories[0]) => {
        setEditingId(category.id);
        setFormData({ name: category.name });
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: "" });
    };

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-gold">Kelola Kategori Produk</h1>

                {!showForm && (
                    <Button onClick={() => setShowForm(true)} className="mb-6">
                        <Plus className="w-4 h-4 mr-2" /> Tambah Kategori
                    </Button>
                )}

                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>{editingId ? "Edit Kategori" : "Tambah Kategori Baru"}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                                    <div className="flex-1 space-y-2">
                                        <Label htmlFor="name">Nama Kategori</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ name: e.target.value })}
                                            placeholder="Contoh: Jersey, Jaket..."
                                            autoFocus
                                        />
                                    </div>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                        Simpan
                                    </Button>
                                    <Button type="button" variant="outline" onClick={resetForm}>
                                        <X className="w-4 h-4 mr-2" /> Batal
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                <div className="grid gap-4">
                    <Card>
                        <CardContent className="p-0">
                            <div className="rounded-md border">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground">
                                        <tr>
                                            <th className="p-4 font-medium">Nama Kategori</th>
                                            <th className="p-4 font-medium">Slug</th>
                                            <th className="p-4 font-medium text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((category) => (
                                            <tr key={category.id} className="border-t hover:bg-muted/50 transition-colors">
                                                <td className="p-4 font-medium">{category.name}</td>
                                                <td className="p-4 text-muted-foreground">{category.slug}</td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(category)}
                                                            className="h-8 w-8"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(category.id)}
                                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {categories.length === 0 && !loading && (
                                            <tr>
                                                <td colSpan={3} className="p-8 text-center text-muted-foreground">
                                                    Belum ada kategori. Silakan tambahkan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CategoryManager;
