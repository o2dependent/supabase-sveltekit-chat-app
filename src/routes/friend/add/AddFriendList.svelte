<script lang="ts">
	import type { searchFriends } from './searchFriends';
	import type { PageData } from './$types';
	import { FriendsStatus } from '$types/friends-status';
	import Avatar from '$lib/profile/Avatar.svelte';
	import { supabase } from '$lib/supabaseClient';

	export let searchedFriends: Awaited<ReturnType<typeof searchFriends>>;
	export let profile: PageData['profile'];

	const sendRequest = async (user_id: string) => {
		try {
			const { data: userProfile, error: userProfileError } = await supabase.from('friends').upsert({
				requester_id: profile?.id,
				user_id,
				status: FriendsStatus.PENDING
			});
		} catch (error) {}
	};

	const isRequestStatus = (
		requests: NonNullable<typeof searchedFriends>[0]['outgoing_requests'],
		status: FriendsStatus
	) => {
		return requests && Array.isArray(requests)
			? requests?.some((request) => request.status === status)
			: typeof requests === 'object' && requests?.status === status;
	};
</script>

{#each searchedFriends ?? [] as { id, full_name, username, avatar_url, incoming_requests, outgoing_requests }}
	<!-- is already friend -->
	{#if isRequestStatus(outgoing_requests, FriendsStatus.ACCEPTED)}
		<a href="/chat/{id}" class="flex gap-2 items-center">
			<div class="w-fit">
				<Avatar {full_name} {avatar_url} />
			</div>
			<span class="flex-grow">@{username}</span>
			<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
				><title>Chatbubble Ellipses</title><path
					d="M87.48 380c1.2-4.38-1.43-10.47-3.94-14.86a42.63 42.63 0 00-2.54-3.8 199.81 199.81 0 01-33-110C47.64 139.09 140.72 48 255.82 48 356.2 48 440 117.54 459.57 209.85a199 199 0 014.43 41.64c0 112.41-89.49 204.93-204.59 204.93-18.31 0-43-4.6-56.47-8.37s-26.92-8.77-30.39-10.11a31.14 31.14 0 00-11.13-2.07 30.7 30.7 0 00-12.08 2.43L81.5 462.78a15.92 15.92 0 01-4.66 1.22 9.61 9.61 0 01-9.58-9.74 15.85 15.85 0 01.6-3.29z"
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-miterlimit="10"
					stroke-width="32"
				/><circle fill="currentColor" cx="160" cy="256" r="32" /><circle
					fill="currentColor"
					cx="256"
					cy="256"
					r="32"
				/><circle fill="currentColor" cx="352" cy="256" r="32" /></svg
			>
		</a>
		<!-- has outgoing request from user -->
	{:else if isRequestStatus(outgoing_requests, FriendsStatus.PENDING)}
		<div class="flex gap-2">
			<div class="w-fit">
				<Avatar {full_name} {avatar_url} />
			</div>
			<span class="flex-grow">@{username}</span>
			<div>
				<span class="opacity-50">Requested</span>
			</div>
		</div>
		<!-- has incoming request from user -->
	{:else if isRequestStatus(incoming_requests, FriendsStatus.PENDING)}
		<div class="flex gap-2">
			<div class="w-fit">
				<Avatar {full_name} {avatar_url} />
			</div>
			<span class="flex-grow">@{username}</span>
			<div>
				<button class="btn btn-sm btn-primary">Add</button>
				<button class="btn btn-sm btn-error">Deny</button>
			</div>
		</div>
		<!-- unconnected friend -->
	{:else}
		<div class="flex gap-2">
			<div class="w-fit">
				<Avatar {full_name} {avatar_url} />
			</div>
			<span class="flex-grow">@{username}</span>
			<div>
				<button on:click={() => sendRequest(id)} class="btn btn-sm btn-primary">Send Request</button
				>
			</div>
		</div>
	{/if}
{:else}
	<p>No friends found</p>
{/each}
