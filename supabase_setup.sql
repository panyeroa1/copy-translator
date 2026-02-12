-- Create Users Table
CREATE TABLE public.users (
    id TEXT PRIMARY KEY, -- e.g. SI1234
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Sessions Table
CREATE TABLE public.sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    staff_language TEXT NOT NULL,
    visitor_language TEXT NOT NULL
);

-- Create Messages Table
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.sessions(id) NOT NULL,
    role TEXT NOT NULL, -- 'user' or 'agent'
    content TEXT NOT NULL,
    language TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create Policies (Open for now as we are using anon key for simple staff access)
-- In a production app, you'd want stricter policies.
CREATE POLICY "Enable read/write for all users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for all users" ON public.sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for all users" ON public.messages FOR ALL USING (true) WITH CHECK (true);
