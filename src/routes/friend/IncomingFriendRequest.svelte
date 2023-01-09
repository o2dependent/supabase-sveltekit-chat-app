<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { FriendsStatus } from '$types/friends-status';
	import { profile } from '../profile.store';
	import type { PageData } from './$types';
	import FriendRequestWrapper from './FriendRequestWrapper.svelte';

	export let full_name: string;
	export let avatar_url: string;
	export let username: string;
	export let request_id: number;
	export let sender_id: string;

	const addFriend = async () => {
		const { data, error } = await supabase
			.from('friends')
			.update({
				status: FriendsStatus.ACCEPTED
			})
			.eq('id', request_id);

		const { data: user_friend, error: user_friend_error } = await supabase.from('friends').insert([
			{
				requester_id: $profile?.id,
				user_id: sender_id,
				status: FriendsStatus.ACCEPTED
			}
		]);

		// console.log({ data, user_friend, error, user_friend_error });
	};
</script>

<FriendRequestWrapper {full_name} {avatar_url} {username}>
	<button on:click={addFriend} class="btn btn-sm btn-primary">Add</button>
	<button class="btn btn-sm btn-error">Deny</button>
</FriendRequestWrapper>
