import { writable } from 'svelte/store';
import type { RealtimePresenceState } from '@supabase/supabase-js';

type Presence = RealtimePresenceState[''][0];
export type OnlinePresence = Presence & { username: string; avatar_url: string };

export const onlineChatters = writable<Record<string, OnlinePresence>>({});
