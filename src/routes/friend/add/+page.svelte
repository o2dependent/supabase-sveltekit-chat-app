<script lang="ts">
	import type { PageData } from './$types';
	import AddFriendList from './AddFriendList.svelte';
	import AddFriendSearchBar from './AddFriendSearchBar.svelte';
	import { searchFriends } from './searchFriends';

	export let data: PageData;

	$: ({ profile } = data);

	let searchText = '';
	let searchedFriends: Awaited<ReturnType<typeof searchFriends>> = [];
	let friendsLoading = false;

	const handleSearch = async (value: string) => {
		if (!value) {
			searchedFriends = [];
			return;
		}
		friendsLoading = true;
		const newSearchedFriends = await searchFriends(value, profile);
		searchedFriends = newSearchedFriends ?? [];
		friendsLoading = false;
	};

	let timer: NodeJS.Timeout;

	const debounce = (value: string) => {
		clearTimeout(timer);
		timer = setTimeout(() => handleSearch(value), 750);
	};

	$: debounce(searchText);
</script>

<AddFriendSearchBar bind:searchText />
<AddFriendList {profile} {searchedFriends} />
