import { writable } from 'svelte/store';
import type { LayoutServerData } from './$types';

type Friends = LayoutServerData['friends'];

export const friends = writable<Friends>([]);
