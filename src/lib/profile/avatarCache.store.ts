import { writable } from 'svelte/store';

// create object store
export const avatarCache = writable({} as Record<string, string>);
