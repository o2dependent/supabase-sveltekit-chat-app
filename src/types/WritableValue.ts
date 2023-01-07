import type { Writable } from 'svelte/store';

export type WritableValue<T> = T extends Writable<infer U> ? U : never;
