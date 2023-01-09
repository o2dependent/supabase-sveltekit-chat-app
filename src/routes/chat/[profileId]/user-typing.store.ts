import { writable } from 'svelte/store';
import type { OnlinePresence } from './online-chatters.store';

export const userTyping = writable<Record<string, OnlinePresence>>({});
