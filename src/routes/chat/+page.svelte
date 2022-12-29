<script lang="ts">
	import Avatar from '$lib/profile/Avatar.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ profiles } = data);
</script>

<div class="flex flex-col gap-2 mx-auto max-w-md">
	<h1 class="text-3xl border-b border-base-content">Friends</h1>
	{#each profiles ?? [] as { username, avatar_url, full_name, id }}
		<a
			href="/chat/{id}"
			class="w-full flex gap-2 px-2 py-1 rounded-md bg-base-300 border-base-content/20 border"
		>
			<Avatar {full_name} {avatar_url} online />
			<p>
				@{username}
			</p>
		</a>
	{/each}
</div>
