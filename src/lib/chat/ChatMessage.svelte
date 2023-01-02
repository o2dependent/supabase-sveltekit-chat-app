<script lang="ts">
	import { quintOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';
	import { crossfade } from 'svelte/transition';
	import Avatar from '$lib/profile/Avatar.svelte';
	import { formatDistance } from 'date-fns';

	export let is_previous_sender: boolean;
	export let is_next_sender: boolean;
	export let full_name: string;
	export let avatar_url: string;
	export let sent_at: Date;
	export let text: string;
	export let is_me: boolean = false;

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});
</script>

<div class:chat-start={!is_me} class:chat-end={is_me} class="chat last:group">
	{#if !is_me}
		<div class="chat-image avatar">
			<div class="w-10 rounded-full">
				{#if !is_next_sender}
					<span in:receive={{ key: full_name }} out:send={{ key: full_name }}>
						<Avatar {avatar_url} {full_name} />
					</span>
				{/if}
			</div>
		</div>
	{/if}
	{#if !is_previous_sender}
		<div class="chat-header">
			{full_name}
			<time class="text-xs opacity-50">{formatDistance(sent_at, new Date())}</time>
		</div>
	{/if}
	<div class:chat-bubble-primary={is_me} class="chat-bubble">{text}</div>
	<div class="hidden group-[.chat-end]:block chat-footer opacity-50">Delivered</div>
</div>
