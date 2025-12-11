import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Calendar, ShoppingBag } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

const AdminDashboard = () => {
  const menuItems = [
    {
      title: "Kelola News",
      description: "Tambah, edit, dan hapus artikel berita",
      icon: Newspaper,
      link: "/admin/news",
      color: "text-blue-500",
    },
    {
      title: "Kelola Event",
      description: "Atur event dan kegiatan club",
      icon: Calendar,
      link: "/admin/events",
      color: "text-green-500",
    },
    {
      title: "Kelola Produk",
      description: "Manajemen produk shop",
      icon: ShoppingBag,
      link: "/admin/products",
      color: "text-purple-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-8">Selamat Datang, Admin</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={item.link}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg bg-secondary ${item.color}`}>
                          <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle>{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
