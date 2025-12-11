import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLogo from '@/assets/Logo_NMC.png'
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/tentang", label: "Tentang Club" },
    { to: "/milestone", label: "Milestone" },
    { to: "/news", label: "News & Blog" },
    { to: "/galeri", label: "Galeri" },
    { to: "/member", label: "Member" },
    { to: "/event", label: "Event" },
    { to: "/shop", label: "Shop" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-24 h-24 p-3">
             <img src={MainLogo} alt="" />
            </div>

          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button
                  variant="ghost"
                  className={`${
                    isActive(link.to)
                      ? "text-gold hover:text-white hover:bg-primary"
                      : "text-foreground hover:text-white hover:bg-primary"
                  } transition-colors`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-foreground hover:text-gold transition-colors"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      isActive(link.to)
                        ? "text-gold bg-secondary"
                        : "text-foreground hover:text-gold hover:bg-secondary"
                    }`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
