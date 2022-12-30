<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { avatarCache } from './avatarCache.store';

	export let avatar_url: string | null;
	export let full_name: string | null;
	export let online: boolean = false;
	export let skeleton: boolean = false;

	let isUrlLoading = true;

	// get full name abbreviation
	const abbreviation =
		full_name
			?.split(' ')
			?.map((name) => name[0])
			?.join('')
			?.slice(0, 2) ?? 'DD';

	let url = '';

	const loadUrl = async (avatar_url: string | null) => {
		if (avatar_url && !skeleton) {
			// check if url is in cache
			const cachedUrl = $avatarCache[avatar_url];

			if (cachedUrl) {
				url = cachedUrl;
				isUrlLoading = false;
				return;
			}

			isUrlLoading = true;
			const { data, error } = await supabase.storage.from('avatars').download(avatar_url);
			if (error) throw error;

			url = URL.createObjectURL(data);

			// add url to cache
			avatarCache.update((cache) => {
				return { ...cache, [avatar_url]: url };
			});

			isUrlLoading = false;
		} else {
			isUrlLoading = false;
		}
	};

	$: loadUrl(avatar_url);
</script>

<li class:online class="avatar placeholder">
	<div class="bg-neutral-focus text-neutral-content rounded-full w-8 !p-0">
		{#if isUrlLoading}
			<span class="skeleton-loader" />
		{:else if url}
			<img src={url} alt="{full_name} avatar" />
		{:else}
			<span class="text-lg ">{abbreviation}</span>
		{/if}
	</div>
</li>

<style lang="postcss">
	.skeleton-loader {
		background: linear-gradient(
			to right,
			rgba(130, 130, 130, 0.2) 8%,
			rgba(130, 130, 130, 0.3) 18%,
			rgba(130, 130, 130, 0.2) 33%
		);
		background-size: 800px 100px;
		animation: wave-lines 2s infinite ease-out;
		@apply w-full h-full;
	}
	@keyframes wave-lines {
		0% {
			background-position: -468px 0;
		}
		100% {
			background-position: 468px 0;
		}
	}
</style>
