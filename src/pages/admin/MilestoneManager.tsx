import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Calendar } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createMilestone,
  deleteMilestone,
  fetchMilestones,
  updateMilestone,
} from "@/store/slices/milestoneSlice";
import { useToast } from "@/hooks/use-toast";

const MilestoneManager = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.milestones);
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    year: "",
    title: "",
    description: "",
    achievementsText: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMilestones());
  }, [dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (item: typeof items[0]) => {
    setEditId(item.id);
    setFormData({
      year: item.year,
      title: item.title,
      description: item.description,
      achievementsText: item.achievements.join("\n"),
      image: null,
    });
    setImagePreview(item.image || null);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData({
      year: "",
      title: "",
      description: "",
      achievementsText: "",
      image: null,
    });
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("year", formData.year);
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    const achievementsArray = formData.achievementsText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    payload.append("achievements", JSON.stringify(achievementsArray));
    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {
      if (editId) {
        await dispatch(updateMilestone({ id: editId, formData: payload })).unwrap();
        toast({ title: "Berhasil", description: "Milestone berhasil diperbarui" });
      } else {
        await dispatch(createMilestone(payload)).unwrap();
        toast({ title: "Berhasil", description: "Milestone berhasil ditambahkan" });
      }
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan data",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus milestone ini?")) return;
    try {
      await dispatch(deleteMilestone(id)).unwrap();
      toast({ title: "Berhasil", description: "Milestone berhasil dihapus" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus data",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Kelola Milestone</h1>
            <p className="text-muted-foreground">
              Tambah, ubah, dan hapus milestone agar tampil di user.
            </p>
          </div>
          <Button onClick={() => setShowForm((prev) => !prev)}>
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? "Tutup Form" : "Tambah Milestone"}
          </Button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>{editId ? "Edit Milestone" : "Tambah Milestone"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Tahun</Label>
                      <Input
                        id="year"
                        placeholder="2025"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Judul</Label>
                      <Input
                        id="title"
                        placeholder="Judul milestone"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
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
                    <Label htmlFor="achievements">Pencapaian (pisahkan per baris)</Label>
                    <Textarea
                      id="achievements"
                      rows={4}
                      value={formData.achievementsText}
                      onChange={(e) =>
                        setFormData({ ...formData, achievementsText: e.target.value })
                      }
                      placeholder={"Pembukaan chapter baru\nEvent nasional\nProgram sosial"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Gambar</Label>
                    <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-2 w-48 h-32 object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
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

        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                {item.image && (
                  <div className="w-full md:w-64 h-40 overflow-hidden rounded bg-muted">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-gold font-semibold">
                    <Calendar className="w-4 h-4" />
                    <span>{item.year}</span>
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {item.achievements.map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {!loading && items.length === 0 && (
            <p className="text-center text-muted-foreground">Belum ada milestone.</p>
          )}
          {loading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default MilestoneManager;


