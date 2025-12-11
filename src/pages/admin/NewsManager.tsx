import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchNews,
  createNews,
  updateNews,
  deleteNews,
} from "@/store/slices/newsSlice";
import { useToast } from "@/hooks/use-toast";

const NewsManager = () => {
  const dispatch = useAppDispatch();
  const { news, loading } = useAppSelector((state) => state.news);
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    date: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (item: typeof news[0]) => {
    setEditId(item.id);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      date: item.date.split('T')[0],
      image: null,
    });
    setImagePreview(item.image);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("excerpt", formData.excerpt);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("date", formData.date || new Date().toISOString());
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      if (editId) {
        await dispatch(updateNews({ id: editId, formData: formDataToSend })).unwrap();
        toast({
          title: "Berhasil",
          description: "Berita berhasil diperbarui",
        });
      } else {
        await dispatch(createNews(formDataToSend)).unwrap();
        toast({
          title: "Berhasil",
          description: "Berita berhasil ditambahkan",
        });
      }
      setShowForm(false);
      setEditId(null);
      setFormData({ title: "", excerpt: "", content: "", date: "", image: null });
      setImagePreview(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan berita",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
      try {
        await dispatch(deleteNews(id)).unwrap();
        toast({
          title: "Berhasil",
          description: "Berita berhasil dihapus",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Gagal menghapus berita",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData({ title: "", excerpt: "", content: "", date: "", image: null });
    setImagePreview(null);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Kelola News</h1>
        <div className="mb-6">
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Berita
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
                <CardTitle>{editId ? "Edit Berita" : "Tambah Berita Baru"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Judul</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Ringkasan</Label>
                    <Input
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Konten</Label>
                    <Textarea
                      id="content"
                      rows={6}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Tanggal</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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

        {loading && !news.length ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4">
            {news.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex justify-between items-center p-6">
                  <div className="flex gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-muted-foreground line-clamp-2">{item.excerpt}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(item.date).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {news.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Belum ada berita
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default NewsManager;
