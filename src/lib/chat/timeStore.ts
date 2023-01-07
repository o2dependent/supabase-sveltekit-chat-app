import { writable } from 'svelte/store';

const timeStore = writable(new Date());

setInterval(() => {
	timeStore.update(() => {
		return new Date();
	});
}, 30000);

export { timeStore };
