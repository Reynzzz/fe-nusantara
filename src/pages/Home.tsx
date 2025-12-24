import { useEffect } from "react";
import { ArrowRight, Calendar, Users, Trophy, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNews } from "@/store/slices/newsSlice";
import { fetchHomeContent } from "@/store/slices/homeSlice";
import { fetchAbout } from "@/store/slices/aboutSlice";
import VIDEOBACKGROUND from "@/assets/Nusantara MotoRiders_Finale_4.mp4";

const Home = () => {
  const dispatch = useAppDispatch();
  const { news, loading } = useAppSelector((state) => state.news);
  const { content: homeContent } = useAppSelector((state) => state.home);
  console.log(homeContent);
  useEffect(() => {
    dispatch(fetchNews());
    dispatch(fetchHomeContent());
    // Also fetch about if needed for other global data
    dispatch(fetchAbout());
  }, [dispatch]);

  const stats = [
    { icon: Users, value: "500+", label: "Active Members" },
    { icon: Calendar, value: "50+", label: "Events per Year" },
    { icon: Trophy, value: "25+", label: "Awards Won" },
  ];

  const latestNews = news.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <Navigation />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <video
          src={VIDEOBACKGROUND}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center px-4 text-center" />

      </motion.section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="w-full bg-secondary border-border hover:border-gold transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                      <stat.icon size={24} className="sm:text-2xl text-background" />
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gold mb-2">
                      {stat.value}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-left"
            >
              <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-6 text-gold">
                {homeContent?.hero_title || "TENTANG KAMI "}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6">
                {homeContent?.hero_tagline || "Motorcycle Club adalah komunitas yang didirikan oleh para penggemar motor sejati.Kami percaya pada persaudaraan, petualangan, dan semangat berkendara yang aman Dengan lebih dari 500 anggota aktif, kami telah menyelenggarakan berbagai event dari touring hingga acara amal, membuktikan bahwa berkendara bukan hanya hobi tapi gaya hidup."}

              </p>

              <Link to="/tentang">
                <Button className="bg-gold hover:bg-gold/90 text-background">
                  Selengkapnya <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-auto sm:h-[300px] md:h-[400px] rounded-lg overflow-hidden"
            >
              <img
                src={homeContent?.about_image || "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800"}
                alt="Club Members"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-4 text-gold">
              Berita Terbaru
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Update terkini dari aktivitas club
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : latestNews.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8 mb-8">
              {latestNews.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="w-full bg-background border-border hover:border-gold transition-all overflow-hidden group">
                    {item.image && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="pt-6">
                      <p className="text-sm sm:text-base text-gold mb-2">
                        {new Date(item.date).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <h3 className="text-lg sm:text-xl md:text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4 line-clamp-3">
                        {item.excerpt}
                      </p>
                      <Link
                        to={`/news/${item.id}`}
                        className="text-gold hover:underline inline-flex items-center"
                      >
                        Baca Selengkapnya <ArrowRight className="ml-1" size={16} />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">Belum ada berita</div>
          )}

          <div className="text-center">
            <Link to="/news">
              <Button
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-background"
              >
                Lihat Semua Berita
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-20 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('${homeContent?.cta_image || "https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=1920"}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-background/90"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 relative text-center">
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-6 text-gold">Siap Bergabung?</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-md sm:max-w-xl md:max-w-2xl mx-auto">
            Jadilah bagian dari keluarga besar kami dan rasakan pengalaman berkendara yang tak
            terlupakan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/member">
              <Button className="bg-gold hover:bg-gold/90 text-background font-bold" size="lg">
                Daftar Sekarang
              </Button>
            </Link>
            <Link to="/tentang">
              <Button
                size="lg"
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-background"
              >
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      <Footer />
    </motion.div>
  );
};

export default Home;
