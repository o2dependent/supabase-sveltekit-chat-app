<script lang="ts">
	import Avatar from '$lib/profile/Avatar.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ friends, requests } = data);

	// onMount(() => {
	// 	// Channel name can be any string.
	// 	// Create channels with the same name for both the broadcasting and receiving clients.
	// 	const channel = supabase.channel(`${data?.profile?.id}-friends`);

	// 	channel
	// 		.on<Friend>(
	// 			'postgres_changes',
	// 			{
	// 				event: 'INSERT',
	// 				schema: 'public',
	// 				table: 'friends',
	// 				filter: `user_id=eq.${data?.profile?.id}`
	// 			},
	// 			({ new: friend }) => {
	// 				if (friend.status === FriendsStatus.ACCEPTED) {
	// 					friends = [...friends, friend];
	// 				} else if (friend.status === FriendsStatus.PENDING) {
	// 					requests = [...requests, friend];
	// 				}
	// 			}
	// 		)
	// 		.subscribe();
	// });

	$: console.log({ data });
</script>

<a data-sveltekit-preload-code="eager" href="/friend/add">Add a friend</a>

{#each friends ?? [] as { id, sender: { avatar_url, username } } (id)}
	<a
		href="/chat/{id}"
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

{#each requests ?? [] as { id, sender: { avatar_url, username } } (id)}
	<a
		href="/chat/{id}"
		class="w-full flex gap-2 px-2 py-1 rounded-md bg-base-300 border-base-content/20 border"
	>
		<Avatar full_name={username} {avatar_url} online />
		<p>
			@{username}
		</p>
	</a>
{:else}
	<p class="text-center">No requests yet</p>
{/each}
