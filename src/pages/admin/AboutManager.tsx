import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAbout, updateAbout } from "@/store/slices/aboutSlice";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { Value, Management, AboutContent } from "@/store/slices/aboutSlice";
import AboutPreview from "./AboutPreview";

const DEFAULT_CONTENT: AboutContent = {
  id: 0,
  // Removed Home fields
  hero_title: "",
  hero_tagline: "",
  history_title: "",
  history_text: "",
  history_image_url: null,
  vision_title: "",
  vision_text: "",
  mission_title: "",
  mission_text: "",
  values: [],
  member_benefits: [],
  member_registration_link: "",
  management: [],
  contact_phone: "",
  contact_email: "",
  contact_address: "",
};

export default function AboutManager() {
  const dispatch = useAppDispatch();
  const { content, loading, error } = useAppSelector((state) => state.about);
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [localContent, setLocalContent] = useState<AboutContent>(content || DEFAULT_CONTENT);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [managementImages, setManagementImages] = useState<
    Record<number, { file: File; preview: string }>
  >({});

  useEffect(() => {
    dispatch(fetchAbout());
  }, [dispatch]);

  useEffect(() => {
    setLocalContent(content || DEFAULT_CONTENT);
    setImagePreview(content?.history_image_url || null);
    setManagementImages({});
  }, [content]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!localContent) return;

    setSaving(true);
    try {
      const formData = new FormData();
      // Removed Home fields from payload
      formData.append("member_benefits", JSON.stringify(localContent.member_benefits || []));
      formData.append("member_registration_link", localContent.member_registration_link || "");
      formData.append("hero_title", localContent.hero_title || "");
      formData.append("hero_tagline", localContent.hero_tagline || "");
      formData.append("history_title", localContent.history_title || "");
      formData.append("history_text", localContent.history_text || "");
      formData.append("vision_title", localContent.vision_title || "");
      formData.append("vision_text", localContent.vision_text || "");
      formData.append("mission_title", localContent.mission_title || "");
      formData.append("mission_text", localContent.mission_text || "");
      formData.append("values", JSON.stringify(localContent.values || []));
      formData.append("management", JSON.stringify(localContent.management || []));
      formData.append("contact_phone", localContent.contact_phone || "");
      formData.append("contact_email", localContent.contact_email || "");
      formData.append("contact_address", localContent.contact_address || "");

      const imageInput = document.getElementById("history_image") as HTMLInputElement;
      if (imageInput?.files?.[0]) {
        formData.append("history_image", imageInput.files[0]);
      }
      const managementUploadIndexes: number[] = [];
      Object.entries(managementImages).forEach(([index, { file }]) => {
        formData.append("management_images", file);
        managementUploadIndexes.push(Number(index));
      });
      managementUploadIndexes.forEach((index) =>
        formData.append("management_image_indexes", index.toString())
      );

      await dispatch(updateAbout(formData)).unwrap();

      toast({
        title: "Berhasil",
        description: "Konten berhasil disimpan",
      });
    } catch (error: any) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan konten",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addValue = () => {
    if (!localContent) return;
    setLocalContent({
      ...localContent,
      values: [...(localContent.values || []), { icon: "Circle", title: "", description: "" }],
    });
  };

  const removeValue = (index: number) => {
    if (!localContent) return;
    setLocalContent({
      ...localContent,
      values: (localContent.values || []).filter((_, i) => i !== index),
    });
  };

  const updateValue = (index: number, field: keyof Value, value: string) => {
    if (!localContent) return;
    const newValues = [...(localContent.values || [])];
    newValues[index] = { ...newValues[index], [field]: value };
    setLocalContent({ ...localContent, values: newValues });
  };

  const addManagement = () => {
    if (!localContent) return;
    setLocalContent({
      ...localContent,
      management: [...(localContent.management || []), { position: "", name: "", photo_url: "" }],
    });
  };

  const removeManagement = (index: number) => {
    if (!localContent) return;
    setLocalContent({
      ...localContent,
      management: (localContent.management || []).filter((_, i) => i !== index),
    });
  };

  const updateManagement = (index: number, field: keyof Management, value: string) => {
    if (!localContent) return;
    const newManagement = [...(localContent.management || [])];
    newManagement[index] = { ...newManagement[index], [field]: value };
    setLocalContent({ ...localContent, management: newManagement });
  };

  const handleManagementImageChange = (index: number, file?: File) => {
    if (!localContent || !file) return;
    const preview = URL.createObjectURL(file);
    setManagementImages((prev) => ({
      ...prev,
      [index]: { file, preview },
    }));
    const newManagement = [...(localContent.management || [])];
    newManagement[index] = { ...newManagement[index], photo_url: preview };
    setLocalContent({ ...localContent, management: newManagement });
  };

  const addBenefit = () => {
    if (!localContent) return;
    setLocalContent({
      ...localContent,
      member_benefits: [...(localContent.member_benefits || []), ""],
    });
  };

  const removeBenefit = (index: number) => {
    if (!localContent) return;
    setLocalContent({
      ...localContent,
      member_benefits: (localContent.member_benefits || []).filter((_, i) => i !== index),
    });
  };

  const updateBenefit = (index: number, value: string) => {
    if (!localContent) return;
    const newBenefits = [...(localContent.member_benefits || [])];
    newBenefits[index] = value;
    setLocalContent({ ...localContent, member_benefits: newBenefits });
  };

  if (loading && !content) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row gap-6 p-10">

        <div className="space-y-6 p-10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Kelola Halaman Tentang</h1>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Simpan Semua
            </Button>
          </div>



          {/* Member Page Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Pengaturan Member Page</h2>
                <Button onClick={addBenefit} size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Tambah Benefit
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="member_registration_link">Link Registrasi (Google Form)</Label>
                  <Input
                    id="member_registration_link"
                    value={localContent.member_registration_link || ""}
                    onChange={(e) =>
                      setLocalContent({ ...localContent, member_registration_link: e.target.value })
                    }
                    placeholder="https://docs.google.com/forms/..."
                  />
                </div>
                <div>
                  <Label>Benefit Member</Label>
                  <div className="space-y-2 mt-2">
                    {(localContent.member_benefits || []).map((benefit, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={benefit}
                          onChange={(e) => updateBenefit(index, e.target.value)}
                          placeholder="Contoh: Akses ke event eksklusif"
                        />
                        <Button
                          onClick={() => removeBenefit(index)}
                          size="icon"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Hero Section (About) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Hero Section (About Page)</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hero_title">Judul Hero</Label>
                  <Input
                    id="hero_title"
                    value={localContent.hero_title || ""}
                    onChange={(e) =>
                      setLocalContent({ ...localContent, hero_title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="hero_tagline">Tagline</Label>
                  <Input
                    id="hero_tagline"
                    value={localContent.hero_tagline || ""}
                    onChange={(e) =>
                      setLocalContent({ ...localContent, hero_tagline: e.target.value })
                    }
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* History Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Sejarah</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="history_title">Judul Sejarah</Label>
                  <Input
                    id="history_title"
                    value={localContent.history_title || ""}
                    onChange={(e) =>
                      setLocalContent({ ...localContent, history_title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="history_text">Teks Sejarah</Label>
                  <Textarea
                    id="history_text"
                    value={localContent.history_text || ""}
                    onChange={(e) =>
                      setLocalContent({ ...localContent, history_text: e.target.value })
                    }
                    rows={5}
                  />
                </div>
                <div>
                  <Label htmlFor="history_image">Gambar Sejarah</Label>
                  <Input
                    id="history_image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="History preview"
                      className="mt-2 w-48 h-32 object-cover rounded"
                    />
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Vision & Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Visi & Misi</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vision_title">Judul Visi</Label>
                  <Input
                    id="vision_title"
                    value={localContent.vision_title || ""}
                    onChange={(e) =>
                      setLocalContent({ ...localContent, vision_title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="vision_text">Teks Visi</Label>
                  <Textarea
                    id="vision_text"
                    value={localContent.vision_text || ""}
                    onChange={(e) =>
                      setLocalContent({ ...localContent, vision_text: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="mission_title">Judul Misi</Label>
                  <Input
                    id="mission_title"
                    value={localContent.mission_title || ""}
                    onChange={(e) =>
                      setLocalContent({ ...localContent, mission_title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="mission_text">Teks Misi</Label>
                  <Textarea
                    id="mission_text"
                    value={localContent.mission_text || ""}
                    onChange={(e) =>
                      setLocalContent({ ...localContent, mission_text: e.target.value })
                    }
                    rows={4}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Nilai-Nilai</h2>
                <Button onClick={addValue} size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Tambah Nilai
                </Button>
              </div>
              <div className="space-y-4">
                {(localContent.values || []).map((value, index) => (
                  <Card key={index} className="p-4 bg-muted/50">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium">Nilai #{index + 1}</span>
                      <Button onClick={() => removeValue(index)} size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label>Icon (nama Lucide)</Label>
                        <Input
                          value={value.icon}
                          onChange={(e) => updateValue(index, "icon", e.target.value)}
                          placeholder="Users, Shield, Heart, dll"
                        />
                      </div>
                      <div>
                        <Label>Judul</Label>
                        <Input
                          value={value.title}
                          onChange={(e) => updateValue(index, "title", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Deskripsi</Label>
                        <Textarea
                          value={value.description}
                          onChange={(e) => updateValue(index, "description", e.target.value)}
                          rows={2}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Struktur Pengurus</h2>
                <Button onClick={addManagement} size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Tambah Pengurus
                </Button>
              </div>
              <div className="space-y-4">
                {(localContent.management || []).map((mgmt, index) => (
                  <Card key={index} className="p-4 bg-muted/50">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium">Pengurus #{index + 1}</span>
                      <Button
                        onClick={() => removeManagement(index)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Jabatan</Label>
                        <Input
                          value={mgmt.position}
                          onChange={(e) => updateManagement(index, "position", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Nama</Label>
                        <Input
                          value={mgmt.name}
                          onChange={(e) => updateManagement(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Foto Pengurus</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleManagementImageChange(index, e.target.files?.[0])}
                        />
                        {(mgmt.photo_url || managementImages[index]?.preview) && (
                          <img
                            src={managementImages[index]?.preview || mgmt.photo_url || undefined}
                            alt={mgmt.name || `Pengurus ${index + 1}`}
                            className="mt-2 w-32 h-32 object-cover rounded-md border"
                          />
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Kontak</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contact_phone">Telepon</Label>
                  <Input
                    id="contact_phone"
                    value={localContent.contact_phone || ""}
                    onChange={(e) =>
                      setLocalContent({ ...localContent, contact_phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Email</Label>
                  <Input
                    id="contact_email"
                    value={localContent.contact_email || ""}
                    onChange={(e) =>
                      setLocalContent({ ...localContent, contact_email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="contact_address">Alamat</Label>
                  <Textarea
                    id="contact_address"
                    value={localContent.contact_address || ""}
                    onChange={(e) =>
                      setLocalContent({ ...localContent, contact_address: e.target.value })
                    }
                    rows={2}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
        <div className="md:w-1/2 border rounded p-4 overflow-auto max-h-[90vh] bg-white">
          <h2 className="text-2xl font-bold mb-4">Preview</h2>
          {localContent ? (
            <AboutPreview content={localContent} />
          ) : (
            <p className="text-muted-foreground">Tidak ada konten untuk preview</p>
          )}
        </div>
      </div>

    </AdminLayout>
  );
}
