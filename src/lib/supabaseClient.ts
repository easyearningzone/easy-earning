import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const DEFAULT_SUPABASE_URL = 'https://vdidrydxmfdmhugkdofe.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_nM-WqxyZA77eiwXCM9ureQ_Fk2eV0mv';

// Retrieve from Vite environment or configured defaults or localStorage override
const envSupabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const envSupabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(customUrl?: string, customKey?: string): SupabaseClient | null {
  const url = customUrl || localStorage.getItem('supabase_custom_url') || envSupabaseUrl;
  const key = customKey || localStorage.getItem('supabase_custom_key') || envSupabaseAnonKey;

  if (!url || !key) {
    return null;
  }

  try {
    if (!supabaseInstance || customUrl || customKey) {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    }
    return supabaseInstance;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

export const supabase = getSupabaseClient();

export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
  try {
    const testClient = createClient(url, key);
    const { data, error } = await testClient.from('profiles').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      return {
        success: false,
        message: `সংযুক্তিতে ত্রুটি: ${error.message} (দয়া করে SQL Migration রান করেছেন কি না নিশ্চিত করুন)`
      };
    }
    return {
      success: true,
      message: 'Supabase ডাটাবেজের সাথে সফলভাবে সংযুক্ত হয়েছে!'
    };
  } catch (err: any) {
    return {
      success: false,
      message: `সংযোগ ব্যর্থ: ${err.message || 'অজানা ত্রুটি'}`
    };
  }
}
