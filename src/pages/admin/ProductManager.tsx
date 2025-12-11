import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/store/slices/productsSlice";
import { useToast } from "@/hooks/use-toast";

const ProductManager = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts(undefined));
  }, [dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (product: typeof products[0]) => {
    setEditId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      stock: product.stock.toString(),
      image: null,
    });
    setImagePreview(product.image);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("stock", formData.stock);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      if (editId) {
        await dispatch(updateProduct({ id: editId, formData: formDataToSend })).unwrap();
        toast({
          title: "Berhasil",
          description: "Produk berhasil diperbarui",
        });
      } else {
        await dispatch(createProduct(formDataToSend)).unwrap();
        toast({
          title: "Berhasil",
          description: "Produk berhasil ditambahkan",
        });
      }
      setShowForm(false);
      setEditId(null);
      setFormData({ name: "", price: "", description: "", category: "", stock: "", image: null });
      setImagePreview(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan produk",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast({
          title: "Berhasil",
          description: "Produk berhasil dihapus",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Gagal menghapus produk",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData({ name: "", price: "", description: "", category: "", stock: "", image: null });
    setImagePreview(null);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Kelola Produk</h1>
        <div className="mb-6">
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Produk
          </Button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editId ? "Edit Produk" : "Tambah Produk Baru"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Produk</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Harga</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jersey">Jersey</SelectItem>
                        <SelectItem value="jaket">Jaket</SelectItem>
                        <SelectItem value="aksesoris">Aksesoris</SelectItem>
                        <SelectItem value="sparepart">Sparepart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stok</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Gambar</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-2 w-48 h-32 object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Simpan
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {loading && !products.length ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="flex justify-between items-center p-6">
                  <div className="flex gap-4">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <p className="text-muted-foreground line-clamp-2">{product.description}</p>
                      <p className="text-gold font-semibold mt-1">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm text-muted-foreground">Stok: {product.stock}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {products.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Belum ada produk
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductManager;
