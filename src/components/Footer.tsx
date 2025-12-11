import { Link } from "react-router-dom";
import { Instagram, Youtube, Facebook } from "lucide-react";
import MainLogo from '@/assets/Logo_NMC.png'
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/tentang", label: "Tentang" },
    { to: "/news", label: "News" },
    { to: "/event", label: "Event" },
    { to: "/shop", label: "Shop" },
    { to: "/kontak", label: "Kontak" },
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
            <Link to="/" className="flex items-center space-x-3">
            <div className="w-24 h-24 p-3">
             <img src={MainLogo} alt="" />
            </div>

          </Link>
            </div>
            <p className="text-muted-foreground text-sm">
              Komunitas penggemar motor yang solid, penuh semangat, dan saling mendukung.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold text-gold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-gold hover:text-background transition-all"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-1 border-t border-border text-center">
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
