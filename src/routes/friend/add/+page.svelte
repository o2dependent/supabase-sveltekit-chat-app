<script lang="ts">
	import LabeledTextInput from '$lib/inputs/LabeledTextInput.svelte';
	import Avatar from '$lib/profile/Avatar.svelte';
	import { supabase } from '$lib/supabaseClient';
	import type { Database } from '$types/supabase';
	import type { PageData } from './$types';

	export let data: PageData;

	type Profile = Database['public']['Tables']['profiles']['Row'];

	$: ({ profile } = data);

	let searchText = '';
	let searchedFriends: Profile[] = [];
	let friendsLoading = false;

	let timer: NodeJS.Timeout;
	const debounce = (value: string) => {
		clearTimeout(timer);
		timer = setTimeout(async () => {
			if (!value) {
				searchedFriends = [];
				return;
			}
			friendsLoading = true;
			const { data: newSearchedFriends } = await supabase
				.from('profiles')
				.select(`*, friends!friends_requester_id_fkey(id)`)
				.ilike('username', `%${value}%`);
			searchedFriends = newSearchedFriends ?? [];
			friendsLoading = false;
			console.log({ searchedFriends });
		}, 750);
	};

	$: debounce(searchText);

	const addFriend = async () => {
		try {
			const { data: userProfile, error: userProfileError } = await supabase
				.from('profiles')
				.select(`id`)
				.eq('username', searchText)
				.single();
		} catch (error) {}
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

{#each searchedFriends as { full_name, username, avatar_url }}
	<div class="flex gap-2">
		<div class="w-fit">
			<Avatar {full_name} {avatar_url} />
		</div>
		<span class="flex-grow">@{username}</span>
		<div>
			<button on:click={addFriend} class="btn btn-sm btn-primary">Add</button>
		</div>
	</div>
{:else}
	<p>No friends found</p>
{/each}
