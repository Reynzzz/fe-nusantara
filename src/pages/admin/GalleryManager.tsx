import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { galleryAPI, getImageUrl } from "@/services/api";
import { YouTubeEmbed } from "react-social-media-embed";
import { InstagramEmbed } from "react-social-media-embed";
import { TikTokEmbed } from "react-social-media-embed";

interface GalleryItem {
  id: number;
  title: string;
  type: "image" | "video" | "embed";
  url: string;
  thumbnailUrl: string | null;
  description: string | null;
  createdAt: string;
}

const GalleryManager = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "image" as "image" | "video" | "embed",
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
      const res = await galleryAPI.getAll();
      setItems(res.data || []);
    } catch {
      toast({ title: "Error", description: "Gagal memuat galeri", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("type", formData.type);
    if (formData.description) payload.append("description", formData.description);

    if (formData.type === "image") {
      if (!editingItem && !imageFile) {
        toast({ title: "Error", description: "Upload gambar wajib", variant: "destructive" });
        return;
      }
      if (imageFile) payload.append("image", imageFile);
    } else {
      payload.append("url", formData.url);
      if (formData.thumbnailUrl) payload.append("thumbnailUrl", formData.thumbnailUrl);
    }

    try {
      if (editingItem) {
        await galleryAPI.update(editingItem.id, payload);
        toast({ title: "Berhasil diupdate" });
      } else {
        await galleryAPI.create(payload);
        toast({ title: "Berhasil ditambahkan" });
      }
      resetForm();
      fetchItems();
    } catch {
      toast({ title: "Error", description: "Gagal menyimpan", variant: "destructive" });
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
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus item ini?")) return;

    try {
      await galleryAPI.delete(id);
      toast({ title: "Berhasil dihapus" });
      fetchItems();
    } catch {
      toast({ title: "Error", description: "Gagal menghapus", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({ title: "", type: "image", url: "", thumbnailUrl: "", description: "" });
    setImageFile(null);
    setEditingItem(null);
    setIsEditing(false);
  };

  const renderEmbed = (item: GalleryItem) => {
    const url = item.url;

    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <YouTubeEmbed url={url} width="100%" height="100%" />
        </div>
      );
    }

    // Instagram
    if (url.includes("instagram.com")) {
      return (
        <div className="w-full h-full flex items-center justify-center overflow-auto">
          <InstagramEmbed url={url} width="100%" />
        </div>
      );
    }

    // TikTok
    if (url.includes("tiktok.com")) {
      return (
        <div className="w-full h-full flex items-center justify-center overflow-auto">
          <TikTokEmbed url={url} width="100%" />
        </div>
      );
    }

    return <div className="text-white text-center p-4">URL tidak didukung</div>;
  };

  return (
    <AdminLayout>
      <div className="p-5 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gallery Manager</h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Tambah</Button>
          )}
        </div>

        {isEditing && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? "Edit Item" : "Tambah Item Baru"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Judul"
                required
              />

              <Select
                value={formData.type}
                onValueChange={(v: any) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Foto</SelectItem>
                  <SelectItem value="video">YouTube</SelectItem>
                  <SelectItem value="embed">IG / TikTok / Shorts</SelectItem>
                </SelectContent>
              </Select>

              {formData.type === "image" ? (
                <div>
                  <Input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    accept="image/*"
                  />
                  {editingItem && (
                    <p className="text-sm text-gray-500 mt-1">
                      Kosongkan jika tidak ingin mengubah gambar
                    </p>
                  )}
                </div>
              ) : (
                <Input
                  placeholder="Paste URL (YouTube, Instagram, TikTok)"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              )}

              <Textarea
                placeholder="Deskripsi (opsional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <div className="flex gap-2">
                <Button type="submit">{editingItem ? "Update" : "Simpan"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video bg-black relative">
                {item.type === "image" ? (
                  <img
                    src={getImageUrl(item.url)}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  renderEmbed(item)
                )}
              </div>
              <div className="p-3">
                <div className="font-semibold mb-2">{item.title}</div>
                {item.description && (
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
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
      </div>
    </AdminLayout>
  );
};

export default GalleryManager;