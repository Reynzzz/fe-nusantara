import { useEffect, useMemo } from "react";
import { Calendar, Trophy, Users, Heart, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMilestones } from "@/store/slices/milestoneSlice";

const Milestone = () => {
  const dispatch = useAppDispatch();
  const { items: milestones, loading } = useAppSelector((state) => state.milestones);

  useEffect(() => {
    dispatch(fetchMilestones());
  }, [dispatch]);

  const stats = useMemo(() => {
    const totalAchievements = milestones.reduce(
      (sum, item) => sum + (item.achievements?.length || 0),
      0
    );
    return {
      totalYears: milestones.length,
      totalAchievements,
    };
  }, [milestones]);

  const icons = [Trophy, Users, Calendar, Heart];

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
            Milestone
          </h1>
          <p className="text-xl text-center text-muted-foreground max-w-3xl mx-auto">
            Perjalanan dan pencapaian Motorcycle Club dari tahun ke tahun
          </p>
        </div>
      </motion.section>

      {/* Timeline */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-gold" />
            </div>
          ) : (
            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gold"></div>

              {/* Timeline Items */}
              <div className="space-y-12">
                {milestones.map((milestone, index) => {
                  const Icon = icons[index % icons.length];
                  return (
                    <div
                      key={milestone.id}
                      className={`relative grid md:grid-cols-2 gap-8 items-center ${
                        index % 2 === 0 ? "" : "md:flex-row-reverse"
                      }`}
                    >
                      {/* Content */}
                      <div className={index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12 md:col-start-2"}>
                        <Card className="bg-card border-gold">
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className={`w-12 h-12 bg-gold rounded-full flex items-center justify-center ${
                                index % 2 === 0 ? "md:ml-auto" : ""
                              }`}>
                                <Icon size={24} className="text-background" />
                              </div>
                              <h3 className="text-3xl font-bold text-gold">{milestone.year}</h3>
                            </div>
                            <h4 className="text-2xl font-bold mb-2">{milestone.title}</h4>
                            <p className="text-muted-foreground mb-4">{milestone.description}</p>
                            <ul className="space-y-2">
                              {milestone.achievements.map((achievement, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-gold mt-1">✓</span>
                                  <span className="text-muted-foreground">{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Image */}
                      {milestone.image && (
                        <motion.div 
                          className={`relative h-64 rounded-lg overflow-hidden ${
                            index % 2 === 0 ? "md:col-start-2" : "md:col-start-1 md:row-start-1"
                          }`}
                          initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6 }}
                        >
                          <img
                            src={milestone.image}
                            alt={milestone.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                        </motion.div>
                      )}

                      {/* Timeline Dot */}
                      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gold rounded-full border-4 border-background"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Summary */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 text-center text-gold"
          >
            Pencapaian Total
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-background border-gold">
              <CardContent className="pt-6 text-center">
                <h3 className="text-4xl font-bold text-gold mb-2">
                  {stats.totalYears || "-"}
                </h3>
                <p className="text-muted-foreground">Total Milestone</p>
              </CardContent>
            </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-background border-gold">
              <CardContent className="pt-6 text-center">
                <h3 className="text-4xl font-bold text-gold mb-2">
                  {stats.totalAchievements}
                </h3>
                <p className="text-muted-foreground">Total Pencapaian</p>
              </CardContent>
            </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-background border-gold">
              <CardContent className="pt-6 text-center">
                <h3 className="text-4xl font-bold text-gold mb-2">50+</h3>
                <p className="text-muted-foreground">Event Tahunan</p>
              </CardContent>
            </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-background border-gold">
              <CardContent className="pt-6 text-center">
                <h3 className="text-4xl font-bold text-gold mb-2">25+</h3>
                <p className="text-muted-foreground">Penghargaan</p>
              </CardContent>
            </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default Milestone;
