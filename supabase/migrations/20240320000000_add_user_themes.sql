-- Create user_themes table
CREATE TABLE IF NOT EXISTS public.user_themes (
    auth_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    theme_colors JSONB NOT NULL DEFAULT '{"primary":"#000000","secondary":"#a6a8ac","tableHeader":"#f6f6f6"}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_themes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own theme"
    ON public.user_themes FOR SELECT
    USING (auth.uid()::uuid = auth_id);

CREATE POLICY "Users can update their own theme"
    ON public.user_themes FOR UPDATE
    USING (auth.uid()::uuid = auth_id);

CREATE POLICY "Users can insert their own theme"
    ON public.user_themes FOR INSERT
    WITH CHECK (auth.uid()::uuid = auth_id);

-- Function to handle theme updates
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_themes (auth_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create theme entry for new users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 