import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Trophy } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMilestoneStats, updateMilestoneStats } from "@/store/slices/milestoneStatsSlice";
import { useToast } from "@/hooks/use-toast";

const MilestoneStatsManager = () => {
  const dispatch = useAppDispatch();
  const { data: stats, loading } = useAppSelector((state) => state.milestoneStats);
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    event_tahunan: "",
    perhargaan: "",
  });

  useEffect(() => {
    dispatch(fetchMilestoneStats());
  }, [dispatch]);

  useEffect(() => {
    if (stats) {
      setFormData({
        event_tahunan: stats.event_tahunan || "",
        perhargaan: stats.perhargaan || "",
      });
    }
  }, [stats]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(updateMilestoneStats(formData)).unwrap();
      toast({ title: "Berhasil", description: "Statistik milestone berhasil diperbarui" });
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

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-8 h-8 text-gold" />
          <div>
            <h1 className="text-3xl font-bold">Kelola Statistik Milestone</h1>
            <p className="text-muted-foreground">
              Atur statistik Event Tahunan dan Penghargaan yang ditampilkan di halaman Milestone
            </p>
          </div>
        </div>

        {loading && !stats ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Statistik Milestone</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="event_tahunan">Event Tahunan</Label>
                      <Input
                        id="event_tahunan"
                        placeholder="50+"
                        value={formData.event_tahunan}
                        onChange={(e) =>
                          setFormData({ ...formData, event_tahunan: e.target.value })
                        }
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Contoh: 50+, 100+, 200+ event
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perhargaan">Penghargaan</Label>
                      <Input
                        id="perhargaan"
                        placeholder="25+"
                        value={formData.perhargaan}
                        onChange={(e) =>
                          setFormData({ ...formData, perhargaan: e.target.value })
                        }
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Contoh: 25+, 50+, 100+ penghargaan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Simpan Perubahan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6"
            >
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Informasi</h3>
                  <p className="text-sm text-muted-foreground">
                    Statistik ini akan ditampilkan di bagian bawah halaman Milestone sebagai ringkasan pencapaian keseluruhan.
                    Anda dapat mengupdate nilai ini kapan saja sesuai dengan pencapaian terkini.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MilestoneStatsManager;

