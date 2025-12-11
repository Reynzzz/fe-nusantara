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
import VIDEOBACKGROUND from '@/assets/Nusantara MotoRiders_Finale_4.mp4'
const Home = () => {
  const dispatch = useAppDispatch();
  const { news, loading } = useAppSelector((state) => state.news);

  useEffect(() => {
    dispatch(fetchNews());
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
      className="min-h-scree"
    >
      <Navigation />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1920')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background"></div>
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient-gold">
            RIDE WITH PASSION
          </h1>
          <p className="text-xl md:text-2xl text-foreground mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan komunitas motor terbesar dan terseru di Indonesia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/member">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-background font-bold">
                Daftar Member <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/event">
              <Button size="lg" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-background">
                Lihat Event
              </Button>
            </Link>
          </div>
        </div> */}
     <video 
  src={VIDEOBACKGROUND}
  autoPlay 
  loop 
  muted 
  playsInline 
  className="w-full h-full object-cover"
></video>

      </motion.section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-secondary border-border hover:border-gold transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                      <stat.icon size={32} className="text-background" />
                    </div>
                    <h3 className="text-4xl font-bold text-gold mb-2">{stat.value}</h3>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-gold">Tentang Kami</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Motorcycle Club adalah komunitas yang didirikan oleh para penggemar motor sejati. 
                Kami percaya pada persaudaraan, petualangan, dan semangat berkendara yang aman.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Dengan lebih dari 500 anggota aktif, kami telah menyelenggarakan berbagai event, 
                dari touring hingga acara amal, membuktikan bahwa berkendara bukan hanya hobi, 
                tapi gaya hidup.
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
              className="relative h-[400px] rounded-lg overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800"
                alt="Club Members"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-gold">Berita Terbaru</h2>
            <p className="text-muted-foreground">Update terkini dari aktivitas club</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : latestNews.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {latestNews.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-background border-border hover:border-gold transition-all overflow-hidden group">
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
                      <p className="text-sm text-gold mb-2">
                        {new Date(item.date).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{item.excerpt}</p>
                      <Link to={`/news/${item.id}`} className="text-gold hover:underline inline-flex items-center">
                        Baca Selengkapnya <ArrowRight className="ml-1" size={16} />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              Belum ada berita
            </div>
          )}

          <div className="text-center">
            <Link to="/news">
              <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-background">
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
            backgroundImage: "url('https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=1920')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-background/90"></div>
        </div>

        <div className="container mx-auto px-4 z-10 relative text-center">
          <h2 className="text-4xl font-bold mb-6 text-gold">Siap Bergabung?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Jadilah bagian dari keluarga besar kami dan rasakan pengalaman berkendara yang tak terlupakan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/member">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-background font-bold">
                Daftar Sekarang
              </Button>
            </Link>
            <Link to="/tentang">
              <Button size="lg" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-background">
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
