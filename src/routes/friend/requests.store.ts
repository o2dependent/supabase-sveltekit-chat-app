import { writable } from 'svelte/store';
import type { LayoutServerData } from './$types';

type Requests = LayoutServerData['requests'];

export const requests = writable<Requests>([]);
