
import { createClient } from '@supabase/supabase-js';

// These should be in .env.local
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('Supabase URL or Key missing. Database features will not work.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface StaffUser {
    id: string; // The SIxxxx ID
    created_at: string;
}

export interface TranslationSession {
    id: string;
    user_id: string;
    started_at: string;
    staff_language: string;
    visitor_language: string;
}

/**
 * Log in or register a staff member by their SI ID.
 * Since this is a simple "SIxxxx" access, we treat it as a lookup or create.
 */
export async function loginOrRegisterStaff(staffId: string): Promise<StaffUser | null> {
    // Validate format SIdddd
    if (!/^SI\d{4}$/.test(staffId)) {
        throw new Error('Invalid format. Must be SI followed by 4 digits (e.g., SI1234).');
    }

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', staffId)
        .single();

    if (existingUser) {
        return existingUser as StaffUser;
    }

    // If not, create
    const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ id: staffId }])
        .select()
        .single();

    if (createError) {
        console.error('Error creating user:', createError);
        // If error is duplicate key (race condition), try fetching again
        if (createError.code === '23505') {
            const { data: retryUser } = await supabase
                .from('users')
                .select('*')
                .eq('id', staffId)
                .single();
            return retryUser as StaffUser;
        }
        throw new Error('Could not login/register user.');
    }

    return newUser as StaffUser;
}

/**
 * Create a new translation session for a user.
 */
export async function createSession(userId: string, staffLang: string, visitorLang: string): Promise<string | null> {
    const { data, error } = await supabase
        .from('sessions')
        .insert([{
            user_id: userId,
            staff_language: staffLang,
            visitor_language: visitorLang
        }])
        .select('id')
        .single();

    if (error) {
        console.error('Error creating session:', error);
        return null;
    }
    return data.id;
}

/**
 * Save a message (turn) to the database.
 */
export async function saveMessage(sessionId: string, role: 'agent' | 'user', text: string, language: string) {
    // We only save final messages, usually called when turn is complete
    const { error } = await supabase
        .from('messages')
        .insert([{
            session_id: sessionId,
            role,
            content: text,
            language
        }]);

    if (error) {
        console.error('Failed to save message:', error);
    }
}
