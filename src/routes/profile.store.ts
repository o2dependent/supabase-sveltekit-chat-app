import { writable } from 'svelte/store';
import type { LayoutServerData } from './$types';

type Profile = LayoutServerData['profile'];

export const profile = writable<Profile>(null);
