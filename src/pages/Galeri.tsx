import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { galleryAPI, getImageUrl } from "@/services/api";

interface GalleryItem {
  id: number;
  title: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string | null;
  description?: string | null;
  duration?: string | null;
}

const getYouTubeId = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : null;
};

const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeId(url);
  if (!videoId) return "/placeholder-youtube.jpg";
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export default function Galeri() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await galleryAPI.getAll();
      setGalleryItems(res?.data || []);
    } finally {
      setLoading(false);
    }
  };

  const filtered = galleryItems.filter((item) =>
    filter === "all" ? true : item.type === filter
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-32 pb-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gradient-gold mb-4">Galeri</h1>
          <p className="text-muted-foreground text-lg">
            Dokumentasi perjalanan dan moment berharga Motorcycle Club
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {["all", "image", "video"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={`px-6 py-2 rounded-full transition border 
                ${
                  filter === t
                    ? "bg-gold text-background"
                    : "bg-card text-foreground hover:bg-gold/20"
                }`}
            >
              {t === "all" ? "Semua" : t === "image" ? "Foto" : "Video"}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              {/* Thumbnail wrapper */}
              <div className="relative group aspect-video rounded-xl overflow-hidden bg-card">
                <img
                  src={
                    item.type === "video"
                      ? item.thumbnailUrl
                        ? getImageUrl(item.thumbnailUrl)
                        : getYouTubeThumbnail(item.url)
                      : getImageUrl(item.url)
                  }
                  onError={(e) => {
                    if (item.type === "video") {
                      const id = getYouTubeId(item.url);
                      if (id)
                        (e.currentTarget as HTMLImageElement).src =
                          `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
                    }
                  }}
                  className="w-full h-full object-cover transition duration-300 group-hover:brightness-75"
                />

                {/* PLAY ICON ON HOVER */}
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                      <Play size={40} className="text-white" />
                    </div>
                  </div>
                )}

                {/* Durasi video */}
                {item.type === "video" && (
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-0.5 rounded text-xs">
                    {item.duration || "0:00"}
                  </span>
                )}
              </div>

              <div className="mt-3">
                <p className="font-semibold text-base text-foreground line-clamp-2">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.type === "video" ? "Video" : "Foto"} • MC Nusantara
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="max-w-4xl bg-card rounded-lg overflow-hidden"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === "video" ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(
                    selectedItem.url
                  )}?autoplay=1`}
                  className="w-full aspect-video"
                />
              ) : (
                <img
                  src={getImageUrl(selectedItem.url)}
                  className="w-full max-h-[80vh] object-contain"
                />
              )}

              <div className="p-4">
                <h2 className="text-xl font-semibold">{selectedItem.title}</h2>
                <p className="text-muted-foreground mt-1">
                  {selectedItem.description}
                </p>
              </div>

              <button
                className="absolute top-4 right-4 bg-black/60 p-2 rounded-full text-white"
                onClick={() => setSelectedItem(null)}
              >
                <X />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
