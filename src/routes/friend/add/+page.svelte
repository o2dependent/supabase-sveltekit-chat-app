<script lang="ts">
	import LabeledTextInput from '$lib/inputs/LabeledTextInput.svelte';
	import Avatar from '$lib/profile/Avatar.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { FriendsStatus } from '$types/friends-status.d';
	import type { Database } from '$types/supabase';
	import type { PageData } from './$types';

	export let data: PageData;

	type Profile = Database['public']['Tables']['profiles']['Row'] & {
		incoming_requests:
			| {
					id: number;
					status: string | null;
			  }[]
			| null;
	} & {
		outgoing_requests:
			| {
					id: number;
					status: string | null;
			  }[]
			| null;
	};

	$: ({ profile } = data);

	let searchText = '';
	let searchedFriends: Awaited<ReturnType<typeof searchFriends>> = [];
	let friendsLoading = false;

	const searchFriends = async (search_text: string) => {
		const { data: newSearchedFriends } = await supabase
			.from('profiles')
			.select(
				`*, outgoing_requests:friends!friends_user_id_fkey(id, status), incoming_requests:friends!friends_requester_id_fkey(id, status)`
			)
			.ilike('username', `%${search_text}%`)
			.neq('id', profile?.id);
		return newSearchedFriends;
	};

	const handleSearch = async (value: string) => {
		if (!value) {
			searchedFriends = [];
			return;
		}
		friendsLoading = true;
		const newSearchedFriends = await searchFriends(value);
		searchedFriends = newSearchedFriends ?? [];
		friendsLoading = false;
		console.log({ searchedFriends });
	};

	let timer: NodeJS.Timeout;

	const debounce = (value: string) => {
		clearTimeout(timer);
		timer = setTimeout(() => handleSearch(value), 750);
	};

	$: debounce(searchText);

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

<label class="flex flex-col gap-2 w-full bg-base-200 p-2" for="search-username">
	<p>Add a friend</p>
	<input
		class="bg-base-200 px-2 py-1"
		bind:value={searchText}
		placeholder="Enter username"
		name="search-username"
	/>
</label>

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
