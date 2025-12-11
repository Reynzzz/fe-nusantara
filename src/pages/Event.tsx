import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ExternalLink, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEvents } from "@/store/slices/eventsSlice";

const Event = () => {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= now
  );
  const pastEvents = events.filter((event) => new Date(event.date) < now);

  const handleRegisterClick = () => {
    const googleFormUrl = "https://forms.gle/example"; // Ganti dengan link Google Form sebenarnya
    window.open(googleFormUrl, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background flex flex-col"
    >
      <Navigation />

      <main className="flex-1 pt-20">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[500px] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 z-10" />
          <img
            src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1600"
            alt="Event Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center max-w-3xl px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient-gold">
                Event & Kegiatan Club
              </h1>
              <p className="text-xl md:text-2xl text-foreground mb-8">
                Bergabunglah dalam berbagai kegiatan seru dan berkesan bersama kami
              </p>
              <Button size="lg" className="text-lg px-8 py-6" onClick={handleRegisterClick}>
                <ExternalLink className="mr-2 h-5 w-5" />
                Daftar Event Sekarang
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-gold">
              Event Mendatang
            </h2>
            <p className="text-muted-foreground text-lg">
              Jangan lewatkan kegiatan seru yang akan datang
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    {event.image && (
                      <div className="relative h-48 overflow-hidden bg-muted">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-4 right-4 bg-gold text-background">
                          Buka Pendaftaran
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription className="mt-2">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4 text-gold" />
                        <span>
                          {new Date(event.date).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4 text-gold" />
                        <span>{event.location}</span>
                      </div>
                      <Button className="w-full mt-4" onClick={handleRegisterClick}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Daftar Sekarang
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Belum ada event mendatang
            </div>
          )}
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section className="bg-muted/30 py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Event Sebelumnya</h2>
                <p className="text-muted-foreground text-lg">
                  Kenangan indah dari kegiatan yang telah berlalu
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {pastEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <Badge variant="secondary">Selesai</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>
                            {new Date(event.date).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <p className="text-sm text-muted-foreground pt-2">{event.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </motion.div>
  );
};

export default Event;
