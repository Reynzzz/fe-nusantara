import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNews } from "@/store/slices/newsSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

const News = () => {
  const dispatch = useAppDispatch();
  const { news, loading } = useAppSelector((state) => state.news);

  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (newsItem: any) => {
    setSelectedNews(newsItem);
    setOpen(true);
  };

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  const featuredNews = news.length > 0 ? news[0] : null;
  const otherNews = news.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <Navigation />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative pt-32 pb-12 overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center text-gold">
            News & Blog
          </h1>
          <p className="text-xl text-center text-muted-foreground max-w-3xl mx-auto">
            Update terkini seputar kegiatan dan prestasi Motorcycle Club
          </p>
        </div>
      </motion.section>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Featured Article */}
          {featuredNews && (
            <section className="py-12">
              <div className="container mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <button
                    onClick={() => handleOpen(featuredNews)}
                    className="w-full text-left"
                  >
                    <Card className="bg-card border-gold overflow-hidden">
                      <div className="grid md:grid-cols-2 gap-0">
                        {featuredNews.image && (
                          <div className="relative h-64 md:h-auto">
                            <img
                              src={featuredNews.image}
                              alt={featuredNews.title}
                              className="w-full h-full object-cover"
                            />
                            <Badge className="absolute top-4 left-4 bg-gold text-background">
                              Featured
                            </Badge>
                          </div>
                        )}
                        <CardContent className="p-8 flex flex-col justify-center">
                          <Badge
                            variant="outline"
                            className="w-fit mb-4 border-gold text-gold"
                          >
                            Berita
                          </Badge>
                          <h2 className="text-3xl font-bold mb-4">
                            {featuredNews.title}
                          </h2>
                          <p className="text-sm text-gold mb-4">
                            {new Date(featuredNews.date).toLocaleDateString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                          <p className="text-muted-foreground mb-6">
                            {featuredNews.excerpt}
                          </p>
                          <span className="text-gold hover:underline inline-flex items-center font-semibold">
                            Baca Selengkapnya <ArrowRight className="ml-2" size={20} />
                          </span>
                        </CardContent>
                      </div>
                    </Card>
                  </button>
                </motion.div>
              </div>
            </section>
          )}

          {/* Articles Grid */}
          <section className="py-12 bg-card">
            <div className="container mx-auto px-4">
              {otherNews.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherNews.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <button onClick={() => handleOpen(article)}>
                        <Card className="bg-background border-border hover:border-gold transition-all overflow-hidden group">
                          {article.image && (
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <Badge
                                variant="outline"
                                className="absolute top-4 left-4 bg-background/90 border-gold text-gold"
                              >
                                Berita
                              </Badge>
                            </div>
                          )}
                          <CardContent className="pt-6">
                            <p className="text-sm text-gold mb-2">
                              {new Date(article.date).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <h3 className="text-xl font-bold mb-3 line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-muted-foreground mb-4 line-clamp-3">
                              {article.excerpt}
                            </p>
                            <span className="text-gold hover:underline inline-flex items-center">
                              Baca Selengkapnya <ArrowRight className="ml-1" size={16} />
                            </span>
                          </CardContent>
                        </Card>
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Belum ada berita
                </div>
              )}
            </div>
          </section>
        </>
      )}

      <Footer />

      {/* Dialog for News Detail */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          {selectedNews && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedNews.title}</DialogTitle>
                <DialogDescription>
                  {new Date(selectedNews.date).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </DialogDescription>
              </DialogHeader>
              {selectedNews.image && (
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  className="w-full h-64 object-cover my-4 rounded-md"
                />
              )}
              <p className="text-muted-foreground">{selectedNews.content}</p>
              {selectedNews.external_link && (
                <div className="mt-4">
                  <a
                    href={selectedNews.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-gold hover:underline"
                  >
                    Baca selengkapnya di sumber asli <ArrowRight className="ml-2" size={16} />
                  </a>
                </div>
              )}
              <DialogClose className="mt-4 btn btn-sm">Tutup</DialogClose>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default News;
