-- Create storage bucket for resources
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true);

-- Create resource categories table
CREATE TABLE public.resource_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resources table
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.resource_categories(id) NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  tags TEXT[],
  is_pack BOOLEAN DEFAULT false,
  pack_size INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default categories
INSERT INTO public.resource_categories (name, description) VALUES
  ('Newsletters', 'Newsletter templates and examples'),
  ('Quiz Packs', 'Interactive quiz materials and answer sheets'),
  ('Visiting with Purpose Pack', 'Materials for meaningful visits'),
  ('Reminiscence Pack', 'Memory-triggering images and materials'),
  ('Seasonal Packs', 'Holiday and seasonal themed resources'),
  ('Miscellaneous', 'Other helpful resources and materials');

-- Enable Row Level Security
ALTER TABLE public.resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no authentication required for demo)
CREATE POLICY "Anyone can view resource categories" 
ON public.resource_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view resources" 
ON public.resources 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert resources" 
ON public.resources 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update resources" 
ON public.resources 
FOR UPDATE 
USING (true);

-- Create storage policies for resources bucket
CREATE POLICY "Anyone can view resource files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resources');

CREATE POLICY "Anyone can upload resource files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resources');

CREATE POLICY "Anyone can update resource files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'resources');

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();