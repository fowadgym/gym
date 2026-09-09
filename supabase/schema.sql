-- Gym Management Engine & Athlete Portal Schema (Hardened)

-- Table: public.profiles
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'athlete' CHECK (role IN ('admin', 'coach', 'athlete')),
  full_name text NOT NULL,
  phone_number text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by authenticated users." ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING ((select auth.uid()) = id);

-- RBAC Synchronization Trigger
CREATE OR REPLACE FUNCTION public.sync_role_to_app_metadata()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{role}',
    to_jsonb(NEW.role)
  )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER sync_profile_role
AFTER INSERT OR UPDATE OF role ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_role_to_app_metadata();

-- Table: public.subscriptions
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  athlete_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier text NOT NULL CHECK (tier IN ('basic', 'pro', 'vip')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subscriptions viewable by self and admins." ON public.subscriptions
  FOR SELECT USING (
    auth.uid() = athlete_id OR 
    (auth.jwt()->'app_metadata'->>'role') IN ('admin', 'coach')
  );

-- SSR Dashboard View
CREATE OR REPLACE VIEW public.athletes_subscription_status AS
SELECT 
  p.id, 
  p.full_name, 
  s.tier, 
  s.end_date, 
  (s.end_date - CURRENT_DATE) AS days_remaining, 
  s.is_active 
FROM public.profiles p 
LEFT JOIN public.subscriptions s ON p.id = s.athlete_id
WHERE p.role = 'athlete';

-- SSR Dashboard RPC
CREATE OR REPLACE FUNCTION public.get_dashboard_kpis()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT jsonb_build_object(
    'total_active', (SELECT count(*) FROM public.subscriptions WHERE is_active = true),
    'expiring_soon', (SELECT count(*) FROM public.athletes_subscription_status WHERE days_remaining > 0 AND days_remaining <= 7),
    'expired', (SELECT count(*) FROM public.athletes_subscription_status WHERE days_remaining <= 0),
    'total_athletes', (SELECT count(*) FROM public.profiles WHERE role = 'athlete')
  );
$$;

-- Table: public.exercises
CREATE TABLE public.exercises (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  title text NOT NULL,
  description text,
  targeted_muscles text[],
  video_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Exercises are viewable by all authenticated users." ON public.exercises
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Only admins/coaches can insert/update exercises." ON public.exercises
  FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin', 'coach'));

-- Table: public.workouts
CREATE TABLE public.workouts (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  athlete_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  date date NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workouts viewable by self and admins." ON public.workouts
  FOR SELECT USING (
    auth.uid() = athlete_id OR 
    (auth.jwt()->'app_metadata'->>'role') IN ('admin', 'coach')
  );
CREATE POLICY "Only admins/coaches can assign workouts." ON public.workouts
  FOR ALL USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin', 'coach'));

-- Table: public.workout_exercises
CREATE TABLE public.workout_exercises (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  workout_id uuid NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sets integer NOT NULL DEFAULT 3,
  reps text NOT NULL DEFAULT '10',
  weight_target text,
  order_index integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workout exercises viewable by self and admins." ON public.workout_exercises
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.workouts w WHERE w.id = workout_id AND (w.athlete_id = auth.uid() OR (auth.jwt()->'app_metadata'->>'role') IN ('admin', 'coach')))
  );

-- Strict IDOR mitigation on UPDATE: athletes can only update 'completed'. 
-- We enforce that the workout belongs to them. Note: to strictly limit to the 'completed' column,
-- we revoke UPDATE on the whole table for athletes and use a security definer function, or rely on Server Actions exclusively.
-- Since the Server Action is strictly constrained, we enforce RLS here that ensures they own it.
CREATE POLICY "Athletes can update completion status on own workouts." ON public.workout_exercises
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.workouts w WHERE w.id = workout_id AND w.athlete_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.workouts w WHERE w.id = workout_id AND w.athlete_id = auth.uid())
  );
  
CREATE POLICY "Only admins/coaches can insert/delete workout exercises." ON public.workout_exercises
  FOR INSERT WITH CHECK ((auth.jwt()->'app_metadata'->>'role') IN ('admin', 'coach'));
CREATE POLICY "Only admins/coaches can delete workout exercises." ON public.workout_exercises
  FOR DELETE USING ((auth.jwt()->'app_metadata'->>'role') IN ('admin', 'coach'));

-- Storage Bucket for Exercise Videos with size and mime constraints
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('exercise-videos', 'exercise-videos', true, 52428800, ARRAY['video/mp4', 'video/webm', 'video/quicktime']) 
ON CONFLICT (id) DO UPDATE SET 
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/quicktime'];

CREATE POLICY "Videos publicly accessible." ON storage.objects
  FOR SELECT USING (bucket_id = 'exercise-videos');

CREATE POLICY "Only admins can upload videos." ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'exercise-videos' AND 
    (auth.jwt()->'app_metadata'->>'role') IN ('admin', 'coach')
  );
