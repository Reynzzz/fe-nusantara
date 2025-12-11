import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Users, CheckCircle2 } from "lucide-react";

const Member = () => {
  // Google Form terbaru
  const googleFormUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSf6cFzWrYCfuCNO2qq6mEL2Qx3JElqM5JFpdJ0yQ25SzUetUg/viewform";

  const benefits = [
    "Akses ke semua event club",
    "Diskon khusus di merchandise shop",
    "Networking dengan member lainnya",
    "Update berita dan informasi terbaru",
    "Kesempatan riding bersama",
    "Dukungan komunitas yang solid",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gold/10 rounded-full mb-6">
              <Users className="w-10 h-10 text-gold" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Bergabung dengan Kami
            </h1>
            <p className="text-lg text-muted-foreground">
              Jadilah bagian dari komunitas pengendara motor yang solid dan penuh passion.
              Daftar sekarang dan nikmati berbagai keuntungan eksklusif!
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 mb-16">
          <Card className="p-8 bg-card border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Keuntungan Member
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                  <p className="text-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Registration Redirect Button */}
        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Form Registrasi Member
            </h2>

            <Card className="p-8 bg-card border-border">
              <p className="text-muted-foreground mb-6">
                Klik tombol di bawah ini untuk membuka formulir pendaftaran.
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
