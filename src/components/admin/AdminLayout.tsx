import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Newspaper, Calendar, ShoppingBag, LogOut, Users, Image, Flag } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Kelola News",
    url: "/admin/news",
    icon: Newspaper,
  },
  {
    title: "Kelola Event",
    url: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Kelola Produk",
    url: "/admin/products",
    icon: ShoppingBag,
  },
  {
    title: "Halaman Tentang",
    url: "/admin/about",
    icon: Users,
  },
  {
    title: "Kelola Galeri",
    url: "/admin/gallery",
    icon: Image,
  },
  {
    title: "Kelola Milestone",
    url: "/admin/milestones",
    icon: Flag,
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (!isAuth) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-bold text-gold">Admin Panel</h2>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <a href={item.url}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4 border-t border-border">
              <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col w-full">
          <header className="h-14 border-b border-border bg-card flex items-center px-4">
            <SidebarTrigger />
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
