<script lang="ts">
	import Avatar from '$lib/profile/Avatar.svelte';

	export let full_name: string;
	export let avatar_url: string;
	export let username: string;
</script>

<div class="flex gap-2">
	<div class="w-fit">
		<Avatar {full_name} {avatar_url} />
	</div>
	<div>
		<span class="flex-grow">@{username}</span>
	</div>
	<div>
		<slot />
	</div>
</div>
