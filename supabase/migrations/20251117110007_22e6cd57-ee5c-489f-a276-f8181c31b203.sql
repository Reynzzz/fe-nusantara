-- Create news table
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for news
CREATE POLICY "Allow public read access to news"
  ON public.news FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert news"
  ON public.news FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update news"
  ON public.news FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated users to delete news"
  ON public.news FOR DELETE
  USING (true);

-- RLS Policies for events
CREATE POLICY "Allow public read access to events"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert events"
  ON public.events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update events"
  ON public.events FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated users to delete events"
  ON public.events FOR DELETE
  USING (true);

-- RLS Policies for products
CREATE POLICY "Allow public read access to products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert products"
  ON public.products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products"
  ON public.products FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated users to delete products"
  ON public.products FOR DELETE
  USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();