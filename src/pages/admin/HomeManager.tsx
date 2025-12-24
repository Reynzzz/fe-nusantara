import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHomeContent, updateHomeContent } from "@/store/slices/homeSlice";
import { useToast } from "@/hooks/use-toast";

const HomeManager = () => {
    const dispatch = useAppDispatch();
    const { content, loading } = useAppSelector((state) => state.home);
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);

    // Local state for form
    const [localContent, setLocalContent] = useState<any | null>(null);
    const [bgVideoFile, setBgVideoFile] = useState<File | null>(null);
    const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
    const [ctaImageFile, setCtaImageFile] = useState<File | null>(null);

    useEffect(() => {
        dispatch(fetchHomeContent());
    }, [dispatch]);

    useEffect(() => {
        if (content) {
            setLocalContent({ ...content });
        }
    }, [content]);

    const handleSave = async () => {
        if (!localContent) return;
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("hero_title", localContent.hero_title || "");
            formData.append("hero_tagline", localContent.hero_tagline || "");
            if (bgVideoFile) {
                formData.append("bg_video", bgVideoFile);
            }
            if (aboutImageFile) {
                formData.append("about_image", aboutImageFile);
            }
            if (ctaImageFile) {
                formData.append("cta_image", ctaImageFile);
            }

            await dispatch(updateHomeContent(formData)).unwrap();
            toast({ title: "Berhasil", description: "Pengaturan home page diperbarui" });
            setBgVideoFile(null);
            setAboutImageFile(null);
            setCtaImageFile(null);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Gagal menyimpan perubahan",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBgVideoFile(e.target.files[0]);
        }
    };

    const handleAboutImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAboutImageFile(e.target.files[0]);
        }
    };

    const handleCtaImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCtaImageFile(e.target.files[0]);
        }
    };

    if (loading && !content) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-screen">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Pengaturan Home Page</h1>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Simpan Perubahan
                    </Button>
                </div>

                {/* Home Page Settings */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="hero_title">Judul Hero</Label>
                                <Input
                                    id="hero_title"
                                    value={localContent?.hero_title || ""}
                                    onChange={(e) =>
                                        setLocalContent({ ...localContent, hero_title: e.target.value })
                                    }
                                    placeholder="RIDE WITH PASSION"
                                />
                            </div>
                            <div>
                                <Label htmlFor="hero_tagline">Tagline Hero</Label>
                                <Input
                                    id="hero_tagline"
                                    value={localContent?.hero_tagline || ""}
                                    onChange={(e) =>
                                        setLocalContent({ ...localContent, hero_tagline: e.target.value })
                                    }
                                    placeholder="Bergabunglah dengan komunitas..."
                                />
                            </div>
                            {/* <div>
                                <Label htmlFor="bg_video">Background Video</Label>
                                <Input
                                    id="bg_video"
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoChange}
                                />
                                {localContent?.bg_video && !bgVideoFile && (
                                    <p className="text-sm text-green-600 mt-2">
                                        Video saat ini tersedia (Upload baru untuk mengganti)
                                    </p>
                                )}
                            </div> */}
                        </div>
                    </Card>

                    <Card className="p-6 mt-6">
                        <h2 className="text-xl font-semibold mb-4">About Section</h2>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="about_image">Gambar About</Label>
                                <Input
                                    id="about_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAboutImageChange}
                                />
                                {localContent?.about_image && !aboutImageFile && (
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        <p className="text-green-600 mb-2">Gambar saat ini tersedia:</p>
                                        <img
                                            src={localContent.about_image}
                                            alt="Current About"
                                            className="h-32 w-auto object-cover rounded-md"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 mt-6">
                        <h2 className="text-xl font-semibold mb-4">CTA Section</h2>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="cta_image">Background Gambar CTA</Label>
                                <Input
                                    id="cta_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCtaImageChange}
                                />
                                {localContent?.cta_image && !ctaImageFile && (
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        <p className="text-green-600 mb-2">Gambar saat ini tersedia:</p>
                                        <img
                                            src={localContent.cta_image}
                                            alt="Current CTA"
                                            className="h-32 w-auto object-cover rounded-md"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </AdminLayout>
    );
};

export default HomeManager;
