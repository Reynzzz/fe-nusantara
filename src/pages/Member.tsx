import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { fetchAbout } from "@/store/slices/aboutSlice";
import { fetchMembers } from "@/store/slices/memberSlice";
import { Loader2, User } from "lucide-react";

const Member = () => {
  const dispatch = useAppDispatch();
  const { content: aboutContent } = useAppSelector((state) => state.about);
  const { members, loading } = useAppSelector((state) => state.members);

  useEffect(() => {
    dispatch(fetchAbout());
    dispatch(fetchMembers());
  }, [dispatch]);

  // Google Form terbaru
  const googleFormUrl =
    aboutContent?.member_registration_link ||
    "https://docs.google.com/forms/d/e/1FAIpQLSf6cFzWrYCfuCNO2qq6mEL2Qx3JElqM5JFpdJ0yQ25SzUetUg/viewform";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        {/* Member List Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Member Kami
            </h1>
            <p className="text-muted-foreground text-lg">
              Inilah para member yang tergabung dalam komunitas kami
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">Belum ada member yang terdaftar</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {members.map((member) => (
                <Card
                  key={member.id}
                  className="p-4 text-center bg-card border-border hover:shadow-lg transition"
                >
                  <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <User className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {member.name}
                  </h3>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Registration Redirect Button */}
        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Form Registrasi Member
            </h2>

            <Card className="p-8 bg-card border-border">
              <p className="text-muted-foreground mb-6">
                Klik tombol di bawah ini untuk membuka formulir pendaftaran member baru.
              </p>

              <a
                href={googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-gold text-white font-semibold rounded-lg hover:bg-gold/90 transition"
              >
                Daftar Sekarang
              </a>
            </Card>

            <p className="text-center text-muted-foreground mt-4 text-sm">
              * Pastikan semua data yang diisi sudah benar
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Member;
