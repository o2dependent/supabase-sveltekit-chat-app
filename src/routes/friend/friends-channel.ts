import { supabase } from '$lib/supabaseClient';
import { FriendsStatus } from '$types/friends-status';
import { get } from 'svelte/store';
import { profile } from '../profile.store';
import { friends } from './friends.store';
import { requests } from './requests.store';
import type { WritableValue } from '$types/WritableValue';

export const subscribeToFriendsChannel = () => {
	const userProfile = get(profile);

	const channel = supabase.channel(`${userProfile?.id}-friends`);

	channel
		.on<NonNullable<WritableValue<typeof requests>>[number]>(
			'postgres_changes',
			{
				event: 'INSERT',
				schema: 'public',
				table: 'friends',
				filter: `user_id=eq.${userProfile?.id}`
			},
			({ new: friend }) => {
				if (friend.status === FriendsStatus.ACCEPTED) {
					friends.update((oldFriends) => [...(oldFriends ?? []), friend]);
				} else if (friend.status === FriendsStatus.PENDING) {
					requests.update((oldRequests) => [...(oldRequests ?? []), friend]);
				}
			}
		)
		.subscribe();

	return () => {
		channel.unsubscribe();
	};
};
