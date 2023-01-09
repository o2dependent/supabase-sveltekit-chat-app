<script lang="ts">
	import ChatMessage from '$lib/chat/ChatMessage.svelte';
	import Avatar from '$lib/profile/Avatar.svelte';
	import { supabase } from '$lib/supabaseClient';
	import type { Database } from '$types/supabase';
	import type { RealtimePresenceState } from '@supabase/supabase-js';
	import { profile } from '../../profile.store';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { PageData } from './$types';
	import { subscribeToMessagesChannel } from './messages-channel';
	import { messages } from './messages.store';
	import { subscribeToOnlineChattersChannel } from './online-chatters-channel';
	import { subscribeToUserTypingChannel } from './user-typing-channel';

	export let data: PageData;

	type Presence = RealtimePresenceState[''][0];
	type OnlinePresence = Presence & { username: string; avatar_url: string };

	$: ({ room_key, profileId } = data);

	let onlineUsers: Record<string, OnlinePresence> = {};
	let usersTyping: Record<string, OnlinePresence> = {};
	let commentText = '';

	let scrollContainer: HTMLDivElement;
	let scrollPosition = 0;

	// add comment action with optimistic UI
	const onComment = async (text: string) => {
		const { data } = await supabase
			.from('direct_messages')
			.insert({ receiver_id: profileId, sender_id: $profile?.id, text, room_key });
	};

	let onTyping = async () => {};

	let onTypingBlur = async () => {};

	onMount(() => {
		// Channel name can be any string.
		// Create channels with the same name for both the broadcasting and receiving clients.
		const messagesChannel = subscribeToMessagesChannel(room_key, () => {
			setTimeout(() => {
				const top = scrollContainer?.scrollHeight - scrollContainer?.offsetHeight;
				const behavior = top - scrollPosition >= 2000 ? 'auto' : 'smooth';
				scrollContainer.scroll({
					top,
					behavior
				});
			}, 500);
		});

		const onlineChattersChannel = subscribeToOnlineChattersChannel(room_key);

		const typingChannel = subscribeToUserTypingChannel(room_key);

		onTyping = async () => {
			await typingChannel.channel.track({
				online_at: new Date().toISOString(),
				username: $profile?.username,
				avatar_url: $profile?.avatar_url,
				id: $profile?.id
			});
		};
		onTypingBlur = async () => {
			await typingChannel.channel.untrack();
		};

		// scroll to bottom
		scrollContainer.scroll({
			top: scrollContainer?.scrollHeight - scrollContainer?.offsetHeight
		});

		// add event listener to update scrollPosition
		scrollContainer.addEventListener('scroll', () => {
			scrollPosition = scrollContainer.scrollTop;
		});

		return () => {
			messagesChannel.unsubscribe();
			onlineChattersChannel.unsubscribe();
			typingChannel.unsubscribe();
		};
	});
</script>

<div class="h-full flex flex-col max-h-[calc(100vh-4rem)] overflow-hidden">
	<div class="px-4 py-2 flex flex-col bg-base-200">
		<h2 class="text-lg">Online</h2>
		<div class="flex gap-2">
			{#each Object.entries(onlineUsers) as [id, { avatar_url, username }] (id)}
				<Avatar {avatar_url} full_name={username} online />
			{:else}
				<Avatar avatar_url="" full_name="" online skeleton />
			{/each}
		</div>
	</div>
	<div class="relative flex-grow overflow-hidden flex">
		<div
			bind:this={scrollContainer}
			class="flex-grow flex flex-col w-full px-2 pt-4 overflow-y-scroll justify-end"
		>
			{#each $messages as { id, text, sender_id, created_at }, idx (id)}
				<ChatMessage
					text={text ?? ''}
					avatar_url={onlineUsers[sender_id ?? '']?.avatar_url}
					full_name={onlineUsers[sender_id ?? '']?.username}
					sent_at={new Date(created_at ?? '')}
					is_me={sender_id === $profile?.id}
					is_next_sender={sender_id === ($messages?.[idx + 1]?.sender_id ?? '')}
					is_previous_sender={sender_id === ($messages?.[idx - 1]?.sender_id ?? '')}
				/>
			{/each}
			{#if scrollPosition < scrollContainer?.scrollHeight - scrollContainer?.offsetHeight - 150}
				<div
					in:fly={{ y: 100 }}
					out:fly={{ y: 100 }}
					class="absolute bottom-2 flex items-center justify-center left-0 w-full"
				>
					<button
						type="button"
						on:click={() => {
							const top = scrollContainer?.scrollHeight - scrollContainer?.offsetHeight;
							// scroll to bottom
							console.log({ scrollPosition });
							scrollContainer.scroll({
								top,
								behavior: top - scrollPosition >= 2000 ? 'auto' : 'smooth'
							});
						}}
						class="alert py-2 w-fit shadow-md"
					>
						<div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								class="stroke-info flex-shrink-0 w-6 h-6"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/></svg
							>
							<span>1 unread messages. Tap to see.</span>
						</div>
					</button>
				</div>
			{/if}
		</div>
	</div>

	{#if Object.keys(usersTyping).length > 0}
		<p>
			{Object.keys(usersTyping)
				?.map((key) => usersTyping[key].username)
				.join(', ')} are typing...
		</p>
	{/if}

	<form
		on:submit|preventDefault={async () => {
			try {
				await onComment(commentText);
				commentText = '';
			} catch (error) {
				commentText = 'something went wrong';
			}
		}}
		class="px-2 py-1 w-full flex gap-2 sticky top-full"
	>
		<input
			on:focus={onTyping}
			on:blur={() => {
				console.log('FUCK');
				onTypingBlur();
			}}
			bind:value={commentText}
			type="text"
			placeholder="Type here"
			class="input input-ghost w-full"
		/>
		<button class="btn" type="submit">Send</button>
	</form>
</div>
