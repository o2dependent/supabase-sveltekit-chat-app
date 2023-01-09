import { supabase } from '$lib/supabaseClient';
import { profile } from '../../profile.store';
import { get } from 'svelte/store';
import { userTyping } from './user-typing.store';
import type { OnlinePresence } from './online-chatters.store';

export const subscribeToUserTypingChannel = (room_key: string) => {
	const profileData = get(profile);

	const typingChannel = supabase.channel(`${room_key}-typing`, {
		config: {
			presence: {
				key: profileData?.id
			}
		}
	});

	typingChannel.on('presence', { event: 'sync' }, () => {
		console.log('Online users: ', typingChannel.presenceState());
	});

	typingChannel.on('presence', { event: 'join' }, ({ newPresences }) => {
		console.log('New users have joined: ', newPresences);
		userTyping.update((oldUserTyping) => {
			const newUserTyping = { ...oldUserTyping };
			for (const presence of newPresences) {
				newUserTyping[presence.id] = presence as OnlinePresence;
			}
			return newUserTyping;
		});
	});

	typingChannel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
		console.log('Users have left: ', leftPresences);
		userTyping.update((oldUserTyping) => {
			const newUsersTyping = { ...oldUserTyping };
			for (const presence of leftPresences) {
				// remove entry from object
				delete newUsersTyping[presence.id];
			}
			return newUsersTyping;
		});
	});

	return {
		channel: typingChannel,
		unsubscribe: () => {
			typingChannel.unsubscribe();
			typingChannel.untrack();
		}
	};
};
