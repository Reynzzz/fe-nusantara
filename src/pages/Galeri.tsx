import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { galleryAPI, getImageUrl } from "@/services/api";
import { YouTubeEmbed, InstagramEmbed, TikTokEmbed } from "react-social-media-embed";

interface GalleryItem {
  id: number;
  title: string;
  type: "image" | "video" | "embed";
  url: string;
  thumbnailUrl?: string | null;
  description?: string | null;
}

export default function Galeri() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<"all" | "image" | "video" | "embed">("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGallery = async () => {
    try {
      const res = await galleryAPI.getAll();
      setGalleryItems(res?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const filtered =
    filter === "all"
      ? galleryItems
      : galleryItems.filter((i) => i.type === filter);

  const handleNext = () => {
    if (!selectedItem) return;
    const index = filtered.findIndex((i) => i.id === selectedItem.id);
    setSelectedItem(filtered[(index + 1) % filtered.length]);
  };

  const handlePrev = () => {
    if (!selectedItem) return;
    const index = filtered.findIndex((i) => i.id === selectedItem.id);
    setSelectedItem(filtered[(index - 1 + filtered.length) % filtered.length]);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === "Escape") setSelectedItem(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedItem, filtered]);

  const renderContent = (item: GalleryItem) => {
    const url = item.url;

    // Image
    if (item.type === "image") {
      return (
        <img
          src={getImageUrl(item.url)}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      );
    }

    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <YouTubeEmbed url={url} width="100%" height="100%" />
        </div>
      );
    }

    // Instagram
    if (url.includes("instagram.com")) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black overflow-auto">
          <InstagramEmbed url={url} width="100%" />
        </div>
      );
    }

    // TikTok
    if (url.includes("tiktok.com")) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black overflow-auto">
          <TikTokEmbed url={url} width="100%" />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-32 pb-20 container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center text-gradient-gold mb-4">
          Galeri
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Dokumentasi perjalanan dan momen MC Nusantara
        </p>

        {/* FILTER */}
        <div className="flex justify-center gap-4 mb-10">
          {["all", "image", "video", "embed"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={`px-6 py-2 rounded-full border transition
              ${
                filter === t
                  ? "bg-gold text-background"
                  : "bg-card hover:bg-gold/20"
              }`}
            >
              {t === "all" ? "Semua" : t === "image" ? "Foto" : t === "video" ? "YouTube" : "Social Media"}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              className="cursor-pointer"
              onClick={() => setSelectedItem(item)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-card hover:ring-2 hover:ring-gold transition">
                {renderContent(item)}
              </div>

              <h3 className="mt-3 font-semibold line-clamp-2">{item.title}</h3>
            </motion.div>
          ))}
        </div>
      </main>

      {/* MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedItem(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 text-white hover:scale-110 transition"
            >
              <ChevronLeft size={40} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 text-white hover:scale-110 transition"
            >
              <ChevronRight size={40} />
            </button>

            <motion.div
              className="bg-card rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <div className="relative min-h-[400px]">
                {selectedItem.type === "image" ? (
                  <img
                    src={getImageUrl(selectedItem.url)}
                    alt={selectedItem.title}
                    className="w-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <div className="w-full flex items-center justify-center p-4 bg-black">
                    {renderContent(selectedItem)}
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>
                {selectedItem.description && (
                  <p className="text-muted-foreground">{selectedItem.description}</p>
                )}
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}