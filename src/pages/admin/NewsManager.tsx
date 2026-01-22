import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Calendar as CalendarIcon,
} from "lucide-react";

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
  console.log(news);
  
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    external_link: "",
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

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      external_link: item.external_link || "",
      date: item.date.split("T")[0],
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
    formDataToSend.append("external_link", formData.external_link);
    formDataToSend.append("date", formData.date);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      if (editId) {
        await dispatch(
          updateNews({ id: editId, formData: formDataToSend })
        ).unwrap();
        toast({ title: "Berhasil", description: "Berita diperbarui" });
      } else {
        await dispatch(createNews(formDataToSend)).unwrap();
        toast({ title: "Berhasil", description: "Berita ditambahkan" });
      }

      resetForm();
    } catch (error: any) {
      toast({
        title: error,
        description: error.message || "Gagal menyimpan berita",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus berita ini?")) return;

    try {
      await dispatch(deleteNews(id)).unwrap();
      toast({ title: "Berhasil", description: "Berita dihapus" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus berita",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      external_link: "",
      date: "",
      image: null,
    });
    setImagePreview(null);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Kelola News</h1>

        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Berita
        </Button>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <Card className="my-6">
              <CardHeader>
                <CardTitle>
                  {editId ? "Edit Berita" : "Tambah Berita"}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Judul</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label>Ringkasan</Label>
                    <Input
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label>Konten</Label>
                    <Textarea
                      rows={6}
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label>Link Eksternal</Label>
                    <Input
                      value={formData.external_link}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          external_link: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* DATE PICKER BULAN ANGKA */}
                  <div className="space-y-2">
                    <Label>Tanggal</Label>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date || "Pilih tanggal"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-3">
                        <div className="flex gap-2 mb-2">
                          {/* BULAN */}
                          <Select
                            value={
                              formData.date
                                ? String(
                                    new Date(formData.date).getMonth() + 1
                                  ).padStart(2, "0")
                                : ""
                            }
                            onValueChange={(m) => {
                              const d = formData.date
                                ? new Date(formData.date)
                                : new Date();
                              d.setMonth(Number(m) - 1);
                              setFormData({
                                ...formData,
                                date: format(d, "yyyy-MM-dd"),
                              });
                            }}
                          >
                            <SelectTrigger className="w-[90px]">
                              <SelectValue placeholder="Bulan" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }).map((_, i) => {
                                const m = String(i + 1).padStart(2, "0");
                                return (
                                  <SelectItem key={m} value={m}>
                                    {m}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>

                          {/* TAHUN */}
                          <Select
                            value={
                              formData.date
                                ? String(
                                    new Date(formData.date).getFullYear()
                                  )
                                : ""
                            }
                            onValueChange={(y) => {
                              const d = formData.date
                                ? new Date(formData.date)
                                : new Date();
                              d.setFullYear(Number(y));
                              setFormData({
                                ...formData,
                                date: format(d, "yyyy-MM-dd"),
                              });
                            }}
                          >
                            <SelectTrigger className="w-[100px]">
                              <SelectValue placeholder="Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 20 }).map((_, i) => {
                                const y =
                                  new Date().getFullYear() - 10 + i;
                                return (
                                  <SelectItem
                                    key={y}
                                    value={String(y)}
                                  >
                                    {y}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>

                        <Calendar
                          mode="single"
                          selected={
                            formData.date
                              ? new Date(formData.date)
                              : undefined
                          }
                          onSelect={(d) =>
                            d &&
                            setFormData({
                              ...formData,
                              date: format(d, "yyyy-MM-dd"),
                            })
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Gambar</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        className="mt-2 w-48 h-32 object-cover rounded"
                      />
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      Simpan
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid gap-4">
          {news.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="flex justify-between p-6">
                <div className="flex gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.excerpt}
                    </p>
                    <p className="text-xs mt-1">
                      {new Date(item.date).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewsManager;
