import { supabase } from '$lib/supabaseClient';
import type { Database } from '$types/supabase';
import { get } from 'svelte/store';
import { messages } from './messages.store';
import { profile } from '../../profile.store';

type DirectMessage = Database['public']['Tables']['direct_messages']['Row'];

export const subscribeToMessagesChannel = (room_key: string, onUserNewMessage: () => void) => {
	const channel = supabase.channel(room_key);

	channel
		.on<DirectMessage>(
			'postgres_changes',
			{
				event: 'INSERT',
				schema: 'public',
				table: 'direct_messages',
				filter: `room_key=eq.${room_key}`
			},
			(message) => {
				if (message.new.sender_id === get(profile)?.id) {
					onUserNewMessage?.();
				}
				messages.update((oldMessages) => [...oldMessages, message.new]);
			}
		)
		.subscribe();

	return { channel, unsubscribe: () => channel.unsubscribe() };
};
