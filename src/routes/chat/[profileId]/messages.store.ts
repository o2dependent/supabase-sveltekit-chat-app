import { writable } from 'svelte/store';
import type { Database } from '$types/supabase';

type DirectMessage = Database['public']['Tables']['direct_messages']['Row'];

export const messages = writable<DirectMessage[]>([]);
