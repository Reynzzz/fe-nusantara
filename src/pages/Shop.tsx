import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/slices/productsSlice";

const Shop = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    dispatch(fetchProducts(undefined));
  }, [dispatch]);

  const categories = [
    { value: "all", label: "Semua Produk" },
    { value: "jersey", label: "Jersey" },
    { value: "jaket", label: "Jaket" },
    { value: "aksesoris", label: "Aksesoris" },
    { value: "sparepart", label: "Sparepart" },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleBuyClick = (product: typeof products[0]) => {
    const waNumber = "6281234567890"; // Ganti dengan nomor WA club
    const message = `Halo, saya tertarik untuk membeli *${product.name}* seharga Rp ${product.price.toLocaleString("id-ID")}`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background flex flex-col"
    >
      <Navigation />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-gold">
              Online Shop
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Dapatkan merchandise official club kami. Kualitas terjamin dan desain eksklusif.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.value)}
                className="min-w-[120px]"
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {product.image && (
                    <div className="relative h-64 overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {product.stock === 0 && (
                        <Badge className="absolute top-4 right-4" variant="destructive">
                          Stok Habis
                        </Badge>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-gold">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleBuyClick(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {product.stock > 0 ? "Beli Sekarang" : "Stok Habis"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Tidak ada produk dalam kategori ini
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Shop;
