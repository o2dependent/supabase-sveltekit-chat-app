import { writable } from 'svelte/store';
import type { LayoutServerData } from './$types';

type Session = LayoutServerData['session'];

export const session = writable<Session>(null);
