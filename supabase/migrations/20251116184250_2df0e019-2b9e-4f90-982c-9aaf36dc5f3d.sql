-- Create function to update timestamps (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create table for about page content
CREATE TABLE public.about_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_title TEXT NOT NULL DEFAULT 'BROTHERS FOREVER COMMUNITY',
  hero_tagline TEXT NOT NULL DEFAULT 'Satu Hati, Satu Tujuan, Satu Brotherhood',
  history_title TEXT NOT NULL DEFAULT 'Sejarah Kami',
  history_text TEXT NOT NULL,
  history_image_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1558981359-219d6364c9c8',
  vision_title TEXT NOT NULL DEFAULT 'Visi',
  vision_text TEXT NOT NULL,
  mission_title TEXT NOT NULL DEFAULT 'Misi',
  mission_text TEXT NOT NULL,
  values JSONB NOT NULL DEFAULT '[]'::jsonb,
  management JSONB NOT NULL DEFAULT '[]'::jsonb,
  contact_phone TEXT,
  contact_email TEXT,
  contact_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to about content"
ON public.about_content
FOR SELECT
USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update about content"
ON public.about_content
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert about content"
ON public.about_content
FOR INSERT
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_about_content_updated_at
BEFORE UPDATE ON public.about_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content
INSERT INTO public.about_content (
  history_text,
  vision_text,
  mission_text,
  values,
  management,
  contact_phone,
  contact_email,
  contact_address
) VALUES (
  'Brothers Forever Community (BFC) didirikan pada tahun 2020 oleh sekelompok penggemar motor yang memiliki visi yang sama untuk menciptakan komunitas yang solid dan bersahabat. Kami percaya bahwa berkendara bukan hanya tentang kecepatan, tetapi tentang perjalanan, persahabatan, dan pengalaman yang kami bagikan bersama.',
  'Menjadi komunitas motor terkemuka yang menjunjung tinggi nilai persaudaraan, keamanan berkendara, dan kontribusi positif bagi masyarakat.',
  'Membangun jaringan persaudaraan yang kuat antar anggota, Mempromosikan budaya berkendara yang aman dan bertanggung jawab, Mengadakan kegiatan sosial untuk membantu masyarakat, Memberikan platform untuk berbagi pengetahuan dan pengalaman.',
  '[
    {"icon": "Users", "title": "Persaudaraan", "description": "Kami membangun ikatan kuat antar anggota yang melampaui sekadar hobi berkendara"},
    {"icon": "Shield", "title": "Safety First", "description": "Keselamatan berkendara adalah prioritas utama dalam setiap kegiatan kami"},
    {"icon": "Heart", "title": "Solidaritas", "description": "Saling mendukung dan membantu sesama anggota dalam segala situasi"},
    {"icon": "Award", "title": "Integritas", "description": "Menjunjung tinggi kejujuran dan tanggung jawab dalam setiap tindakan"}
  ]'::jsonb,
  '[
    {"position": "Ketua Umum", "name": "Ahmad Pratama"},
    {"position": "Wakil Ketua", "name": "Budi Santoso"},
    {"position": "Sekretaris", "name": "Candra Wijaya"},
    {"position": "Bendahara", "name": "Dedi Kurniawan"},
    {"position": "Koordinator Event", "name": "Eko Prasetyo"},
    {"position": "Humas", "name": "Faisal Rahman"}
  ]'::jsonb,
  '+62 812-3456-7890',
  'info@brothersforever.com',
  'Jl. Raya Motor No. 123, Jakarta Selatan'
);