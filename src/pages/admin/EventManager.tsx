import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/store/slices/eventsSlice";
import { fetchAbout, updateAbout } from "@/store/slices/aboutSlice";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";
const EventManager = () => {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.events);
  const { content: aboutContent } = useAppSelector((state) => state.about);
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [showBackgroundForm, setShowBackgroundForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    registration_link: "",
    image: null as File | null,
  });
  const [eventBackgroundImage, setEventBackgroundImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchAbout());
  }, [dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventBackgroundImage(file);
      setBackgroundImagePreview(URL.createObjectURL(file));
    }
  };

  const handleBackgroundImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    if (eventBackgroundImage) {
      formDataToSend.append("event_background_image", eventBackgroundImage);
    }
    
    // Include existing about content to preserve other fields
    if (aboutContent) {
      formDataToSend.append("hero_title", aboutContent.hero_title || "");
      formDataToSend.append("hero_tagline", aboutContent.hero_tagline || "");
      formDataToSend.append("history_title", aboutContent.history_title || "");
      formDataToSend.append("history_text", aboutContent.history_text || "");
      formDataToSend.append("vision_title", aboutContent.vision_title || "");
      formDataToSend.append("vision_text", aboutContent.vision_text || "");
      formDataToSend.append("mission_title", aboutContent.mission_title || "");
      formDataToSend.append("mission_text", aboutContent.mission_text || "");
      formDataToSend.append("values", JSON.stringify(aboutContent.values || []));
      formDataToSend.append("member_benefits", JSON.stringify(aboutContent.member_benefits || []));
      formDataToSend.append("member_registration_link", aboutContent.member_registration_link || "");
      formDataToSend.append("management", JSON.stringify(aboutContent.management || []));
      formDataToSend.append("contact_phone", aboutContent.contact_phone || "");
      formDataToSend.append("contact_email", aboutContent.contact_email || "");
      formDataToSend.append("contact_address", aboutContent.contact_address || "");
    }

    try {
      await dispatch(updateAbout(formDataToSend)).unwrap();
      toast({
        title: "Berhasil",
        description: "Background image halaman Event berhasil diperbarui",
      });
      setShowBackgroundForm(false);
      setEventBackgroundImage(null);
      setBackgroundImagePreview(null);
      dispatch(fetchAbout());
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan background image",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (event: typeof events[0]) => {
    setEditId(event.id);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      location: event.location,
      registration_link: event.registration_link || "",
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
    formDataToSend.append("registration_link", formData.registration_link);
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
      setFormData({ title: "", description: "", date: "", location: "", registration_link: "", image: null });
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
    setFormData({ title: "", description: "", date: "", location: "", registration_link: "", image: null });
    setImagePreview(null);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Kelola Event</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowBackgroundForm(!showBackgroundForm)} variant="outline">
              <ImageIcon className="w-4 h-4 mr-2" />
              Atur Background Image
            </Button>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Event
            </Button>
          </div>
        </div>

        {/* Background Image Form */}
        {showBackgroundForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Background Image Halaman Event</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBackgroundImageSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_background_image">Background Image (untuk Hero Banner)</Label>
                    <Input
                      id="event_background_image"
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundImageChange}
                    />
                    {aboutContent?.event_background_image && !backgroundImagePreview && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">Background Image Saat Ini:</p>
                        <img
                          src={aboutContent.event_background_image}
                          alt="Current Background"
                          className="w-full h-48 object-cover rounded"
                        />
                      </div>
                    )}
                    {backgroundImagePreview && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                        <img
                          src={backgroundImagePreview}
                          alt="Background Preview"
                          className="w-full h-48 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Simpan Background Image
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowBackgroundForm(false);
                        setEventBackgroundImage(null);
                        setBackgroundImagePreview(null);
                      }}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

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
                    <Label htmlFor="registration_link">Link Registrasi</Label>
                    <Input
                      id="registration_link"
                      value={formData.registration_link}
                      onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
                      placeholder="Google Form URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Gambar Event</Label>
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
