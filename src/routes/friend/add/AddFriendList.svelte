<script lang="ts">
	import type { searchFriends } from './searchFriends';
	import type { PageData } from './$types';
	import { FriendsStatus } from '$types/friends-status.d';
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
			console.log({ userProfile, userProfileError });
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
		<a href="/chat/{id}" class="flex gap-2">
			<div class="w-fit">
				<Avatar {full_name} {avatar_url} />
			</div>
			<span class="flex-grow">@{username}</span>
			<div>
				<button on:click={() => sendRequest(id)} class="btn btn-sm btn-primary">Add</button>
			</div>
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
