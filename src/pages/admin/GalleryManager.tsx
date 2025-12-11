import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, ImageIcon, Video, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { galleryAPI, getImageUrl } from "@/services/api";

interface GalleryItem {
  id: number;
  title: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl: string | null;
  description: string | null;
  createdAt: string;
}

const getYouTubeId = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
};

const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "";
};

const GalleryManager = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "image" as "image" | "video",
    url: "",
    thumbnailUrl: "",
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await galleryAPI.getAll();
      setItems((response?.data || []) as GalleryItem[]);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Gagal memuat galeri", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("type", formData.type);
    if (formData.description) payload.append("description", formData.description);

    if (formData.type === "video") {
      payload.append("url", formData.url);
      if (formData.thumbnailUrl) payload.append("thumbnailUrl", formData.thumbnailUrl);
    } else {
      if (!editingItem && !imageFile) {
        toast({ title: "Error", description: "Unggah gambar untuk tipe foto", variant: "destructive" });
        return;
      }
      if (imageFile) {
        payload.append("image", imageFile);
      }
    }

    try {
      if (editingItem) {
        const response = await galleryAPI.update(editingItem.id, payload);
        if (!response?.success) {
          throw new Error(response?.message || "Gagal mengupdate item");
        }
        toast({ title: "Berhasil", description: "Item berhasil diupdate" });
      } else {
        const response = await galleryAPI.create(payload);
        if (!response?.success) {
          throw new Error(response?.message || "Gagal menambahkan item");
        }
        toast({ title: "Berhasil", description: "Item berhasil ditambahkan" });
      }

      resetForm();
      fetchItems();
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Operasi gagal, coba lagi", variant: "destructive" });
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      type: item.type,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl || "",
      description: item.description || "",
    });
    setImageFile(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus item ini?")) return;

    try {
      const response = await galleryAPI.delete(id);
      if (!response?.success) {
        throw new Error(response?.message || "Gagal menghapus");
      }
      toast({ title: "Berhasil", description: "Item berhasil dihapus" });
      fetchItems();
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Gagal menghapus item", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "image",
      url: "",
      thumbnailUrl: "",
      description: "",
    });
    setImageFile(null);
    setEditingItem(null);
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-5">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Kelola Galeri</h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="bg-gold hover:bg-gold-dark text-background">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Item
            </Button>
          )}
        </div>

        {isEditing && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? "Edit Item" : "Tambah Item Baru"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Judul galeri"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipe</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "image" | "video") => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          Foto
                        </div>
                      </SelectItem>
                      <SelectItem value="video">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          Video YouTube
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">
                  {formData.type === "video" ? "URL YouTube" : "Unggah Gambar"}
                </Label>
                  {formData.type === "video" ? (
                    <>
                      <Input
                        id="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=xxxxx"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Masukkan URL YouTube (contoh: https://www.youtube.com/watch?v=xxxxx atau https://youtu.be/xxxxx)
                      </p>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        required={!editingItem}
                      />
                      {editingItem?.type === "image" && (
                        <p className="text-xs text-muted-foreground">
                          Biarkan kosong jika tidak ingin mengganti gambar.
                        </p>
                      )}
                    </div>
                  )}
              </div>

              {formData.type === "video" && (
                <div className="space-y-2">
                  <Label htmlFor="thumbnail_url">URL Thumbnail</Label>
                  <Input
                  id="thumbnail_url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="Kosongkan untuk menggunakan thumbnail YouTube otomatis"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi (opsional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi singkat"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-gold hover:bg-gold-dark text-background">
                  {editingItem ? "Update" : "Simpan"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <img
                  src={item.type === "video" 
                    ? (item.thumbnailUrl ? getImageUrl(item.thumbnailUrl) : getYouTubeThumbnail(item.url))
                    : getImageUrl(item.url)
                  }
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.type === "video" 
                      ? "bg-red-500 text-white" 
                      : "bg-gold text-background"
                  }`}>
                    {item.type === "video" ? "Video" : "Foto"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                )}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {items.length === 0 && !isEditing && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Belum ada item di galeri</p>
            <Button onClick={() => setIsEditing(true)} className="bg-gold hover:bg-gold-dark text-background">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Item Pertama
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GalleryManager;
