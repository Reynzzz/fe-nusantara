import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Mail, Phone, MapPin, Circle, Loader2 } from "lucide-react";
import { useEffect } from "react";
import * as Icons from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAbout } from "@/store/slices/aboutSlice";

export default function Tentang() {
  const dispatch = useAppDispatch();
  const { content, loading } = useAppSelector((state) => state.about);

  useEffect(() => {
    dispatch(fetchAbout());
  }, [dispatch]);

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Circle;
    return IconComponent;
  };

  if (loading || !content) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
        <div className="text-center space-y-4 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold"
          >
            {content.hero_title || "Tentang Kami"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground"
          >
            {content.hero_tagline || ""}
          </motion.p>
        </div>
      </section>

      {/* History Section */}
      {content.history_title && (
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6">{content.history_title}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {content.history_text}
              </p>
            </div>
            {content.history_image_url && (
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <img
                  src={content.history_image_url}
                  alt="History"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* Vision & Mission */}
      {(content.vision_title || content.mission_title) && (
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {content.vision_title && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-2xl font-bold mb-4 text-primary">
                        {content.vision_title}
                      </h2>
                      <p className="text-muted-foreground">{content.vision_text}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              {content.mission_title && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-2xl font-bold mb-4 text-primary">
                        {content.mission_title}
                      </h2>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {content.mission_text}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      {content.values && content.values.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Nilai-Nilai Kami
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.values.map((value, index) => {
              const Icon = getIcon(value.icon);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="pt-6 text-center">
                      <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground text-sm">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Management Section */}
      {content.management && content.management.length > 0 && (
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-12"
            >
              Struktur Pengurus
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {content.management.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="pt-6 text-center">
                    {member.photo_url ? (
                      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border border-primary/20">
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Users className="w-10 h-10 text-primary" />
                      </div>
                    )}
                      <h3 className="font-semibold text-lg mb-1">{member.position}</h3>
                      <p className="text-muted-foreground">{member.name}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {(content.contact_phone || content.contact_email || content.contact_address) && (
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-8">Hubungi Kami</h2>
            <div className="space-y-4">
              {content.contact_phone && (
                <div className="flex items-center justify-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>{content.contact_phone}</span>
                </div>
              )}
              {content.contact_email && (
                <div className="flex items-center justify-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>{content.contact_email}</span>
                </div>
              )}
              {content.contact_address && (
                <div className="flex items-center justify-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{content.contact_address}</span>
                </div>
              )}
            </div>
          </motion.div>
        </section>
      )}

      <Footer />
    </>
  );
}
