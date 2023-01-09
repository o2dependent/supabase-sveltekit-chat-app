import { supabase } from '$lib/supabaseClient';
import { profile } from '../../profile.store';
import { get } from 'svelte/store';
import { onlineChatters, type OnlinePresence } from './online-chatters.store';

export const subscribeToOnlineChattersChannel = (room_key: string) => {
	const profileData = get(profile);

	const onlineChannel = supabase.channel(`${room_key}-online-users`, {
		config: {
			presence: {
				key: profileData?.id
			}
		}
	});

	onlineChannel.on('presence', { event: 'sync' }, () => {
		console.log('Online users: ', onlineChannel.presenceState());
	});

	onlineChannel.on('presence', { event: 'join' }, ({ newPresences }) => {
		console.log('New users have joined: ', newPresences);
		onlineChatters.update((oldOnlineChatters) => {
			const newOnlineChatters = { ...oldOnlineChatters };
			for (const presence of newPresences) {
				newOnlineChatters[presence.id] = presence as OnlinePresence;
			}
			return newOnlineChatters;
		});
	});

	onlineChannel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
		console.log('Users have left: ', leftPresences);
		onlineChatters.update((oldOnlineChatters) => {
			const newOnlineChatters = { ...oldOnlineChatters };
			for (const presence of leftPresences) {
				delete newOnlineChatters[presence.id];
			}
			return newOnlineChatters;
		});
	});

	onlineChannel.subscribe(async (status) => {
		if (status === 'SUBSCRIBED') {
			const status = await onlineChannel.track({
				online_at: new Date().toISOString(),
				username: profileData?.username,
				avatar_url: profileData?.avatar_url,
				id: profileData?.id
			});
		}
	});
	return {
		channel: onlineChannel,
		unsubscribe: () => {
			onlineChannel.unsubscribe();
			onlineChannel.untrack();
		}
	};
};
