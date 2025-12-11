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
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/store/slices/eventsSlice";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";
const EventManager = () => {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.events);
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (event: typeof events[0]) => {
    setEditId(event.id);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      location: event.location,
      image: null,
    });
    setImagePreview(event.image);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("location", formData.location);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      if (editId) {
        await dispatch(updateEvent({ id: editId, formData: formDataToSend })).unwrap();
        toast({
          title: "Berhasil",
          description: "Event berhasil diperbarui",
        });
      } else {
        await dispatch(createEvent(formDataToSend)).unwrap();
        toast({
          title: "Berhasil",
          description: "Event berhasil ditambahkan",
        });
      }
      setShowForm(false);
      setEditId(null);
      setFormData({ title: "", description: "", date: "", location: "", image: null });
      setImagePreview(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan event",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus event ini?")) {
      try {
        await dispatch(deleteEvent(id)).unwrap();
        toast({
          title: "Berhasil",
          description: "Event berhasil dihapus",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Gagal menghapus event",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData({ title: "", description: "", date: "", location: "", image: null });
    setImagePreview(null);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Kelola Event</h1>
        <div className="mb-6">
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Event
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
                <CardTitle>{editId ? "Edit Event" : "Tambah Event Baru"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Judul Event</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    <Label className="placeholder-white" color="white" htmlFor="date">Tanggal Event</Label>
                    <Input
  className="text-white placeholder-white"
  id="date"
  type="date"
  value={formData.date}
  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
  required
/>

                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Lokasi</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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

        {loading && !events.length ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardContent className="flex justify-between items-center p-6">
                  <div className="flex gap-4">
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <p className="text-muted-foreground line-clamp-2">{event.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.location} • {new Date(event.date).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(event)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {events.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Belum ada event
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EventManager;
