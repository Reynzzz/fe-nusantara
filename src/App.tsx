import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Tentang from "./pages/Tentang";
import Milestone from "./pages/Milestone";
import News from "./pages/News";
import Shop from "./pages/Shop";
import Event from "./pages/Event";
import Galeri from "./pages/Galeri";
import Member from "./pages/Member";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import NewsManager from "./pages/admin/NewsManager";
import EventManager from "./pages/admin/EventManager";
import ProductManager from "./pages/admin/ProductManager";
import AboutManager from "./pages/admin/AboutManager";
import GalleryManager from "./pages/admin/GalleryManager";
import MilestoneManager from "./pages/admin/MilestoneManager";
import HomeManager from "./pages/admin/HomeManager";
import CategoryManager from "./pages/admin/CategoryManager";

const App = () => (
  <Provider store={store}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/milestone" element={<Milestone />} />
          <Route path="/news" element={<News />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/event" element={<Event />} />
          <Route path="/galeri" element={<Galeri />} />
          <Route path="/member" element={<Member />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/news" element={<NewsManager />} />
          <Route path="/admin/events" element={<EventManager />} />
          <Route path="/admin/products" element={<ProductManager />} />
          <Route path="/admin/categories" element={<CategoryManager />} />
          <Route path="/admin/about" element={<AboutManager />} />
          <Route path="/admin/gallery" element={<GalleryManager />} />
          <Route path="/admin/milestones" element={<MilestoneManager />} />
          <Route path="/admin/home" element={<HomeManager />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Provider>
);

export default App;
