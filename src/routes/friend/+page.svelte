<script lang="ts">
	import Avatar from '$lib/profile/Avatar.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { FriendsStatus } from '$types/friends-status';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { subscribeToFriendsChannel } from './friends-channel';
	import IncomingFriendRequest from './IncomingFriendRequest.svelte';

	export let data: PageData;

	$: ({ friends, requests, profile } = data);

	onMount(() => {
		const unsubscribeToFriendsChannel = subscribeToFriendsChannel();

		return () => {
			unsubscribeToFriendsChannel();
		};
	});
</script>

<a data-sveltekit-preload-code="eager" href="/friend/add">Add a friend</a>

{#each $friends ?? [] as { id, sender: { avatar_url, username, id: user_id } } (id)}
	<a
		href="/chat/{user_id}"
		class="w-full flex gap-2 px-2 py-1 rounded-md bg-base-300 border-base-content/20 border"
	>
		<Avatar full_name={username} {avatar_url} online />
		<p>
			@{username}
		</p>
	</a>
{:else}
	<p class="text-center">No friends yet</p>
{/each}

{#each $requests ?? [] as { id: request_id, sender: { avatar_url, username, id: sender_id, full_name } } (request_id)}
	<IncomingFriendRequest {profile} {sender_id} {full_name} {request_id} {avatar_url} {username} />
{:else}
	<p class="text-center">No requests yet</p>
{/each}
