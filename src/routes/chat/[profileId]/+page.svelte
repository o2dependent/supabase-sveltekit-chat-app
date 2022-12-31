<script lang="ts">
	import ChatMessage from '$lib/chat/ChatMessage.svelte';
	import Avatar from '$lib/profile/Avatar.svelte';
	import { supabase } from '$lib/supabaseClient';
	import type { Database } from '$types/supabase';
	import type { RealtimePresenceState } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;

	type DirectMessage = Database['public']['Tables']['direct_messages']['Row'];
	type Presence = RealtimePresenceState[''][0];
	type OnlinePresence = Presence & { username: string; avatar_url: string };

	$: ({ profile, room_key, profileId, initialMessages } = data);

	let onlineUsers: Record<string, OnlinePresence> = {};
	$: messages = [...(initialMessages ?? [])];
	$: console.log({ messages, initialMessages });
	let commentText = '';

	let scrollContainer: HTMLDivElement;
	let scrollPosition = 0;

	let onComment = async (text: string) => {
		console.log("Something went wrong! Please try again later. (It's not you, it's me.)");
	};

	onMount(() => {
		// Channel name can be any string.
		// Create channels with the same name for both the broadcasting and receiving clients.
		const channel = supabase.channel(room_key);

		// Supabase client setup
		// Listen to broadcast messages.
		// channel
		// 	.on('broadcast', { event: 'message' }, ({ payload }) => {
		// 		messages = [...messages, { ...payload, sent_at: new Date(payload.sent_at) }];
		// 	})
		// 	.subscribe((status) => {
		// 		console.log({ status });
		// 		if (status === 'SUBSCRIBED') {
		// 			// do something that needs to be done when subscribed
		// 		}
		// 	});

		channel
			.on<DirectMessage>(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'direct_messages',
					filter: `room_key=eq.${room_key}`
				},
				(message) => {
					messages = [...messages, message.new];
				}
			)

			.subscribe();

		// add comment action with optimistic UI
		onComment = async (text) => {
			const { data } = await supabase
				.from('direct_messages')
				.insert({ receiver_id: profileId, sender_id: profile?.id, text, room_key });
		};

		const onlineChannel = supabase.channel(`${room_key}-online-users`, {
			config: {
				presence: {
					key: profile?.id
				}
			}
		});

		onlineChannel.on('presence', { event: 'sync' }, () => {
			console.log('Online users: ', onlineChannel.presenceState());
		});

		onlineChannel.on('presence', { event: 'join' }, ({ newPresences }) => {
			console.log('New users have joined: ', newPresences);
			for (const presence of newPresences) {
				onlineUsers[presence.id] = presence as OnlinePresence;
			}
			console.log(onlineUsers);
		});

		onlineChannel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
			console.log('Users have left: ', leftPresences);
			const newOnlineUsers = { ...onlineUsers };
			for (const presence of leftPresences) {
				// remove entry from object
				delete newOnlineUsers[presence.id];
			}
			onlineUsers = newOnlineUsers;
		});

		onlineChannel.subscribe(async (status) => {
			if (status === 'SUBSCRIBED') {
				const status = await onlineChannel.track({
					online_at: new Date().toISOString(),
					username: profile?.username,
					avatar_url: profile?.avatar_url,
					id: profile?.id
				});
			}
		});
		// scroll to bottom
		scrollContainer.scroll({
			top: scrollContainer?.scrollHeight - scrollContainer?.offsetHeight
		});

		// add event listener to update scrollPosition
		scrollContainer.addEventListener('scroll', () => {
			scrollPosition = scrollContainer.scrollTop;
		});

		return () => onlineChannel.untrack();
	});
	$: console.log({ onlineUsers });
</script>

<div class="flex flex-col max-h-[calc(100vh-4rem)] overflow-hidden">
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
		<div bind:this={scrollContainer} class="flex-grow px-2 pt-4 overflow-y-scroll">
			{#each messages as { id, text, sender_id, created_at }, idx (id)}
				<ChatMessage
					text={text ?? ''}
					avatar_url={onlineUsers[sender_id ?? '']?.avatar_url}
					full_name={onlineUsers[sender_id ?? '']?.username}
					sent_at={new Date(created_at ?? '')}
					is_me={sender_id === profile?.id}
					is_next_sender={sender_id === (messages?.[idx + 1]?.sender_id ?? '')}
					is_previous_sender={sender_id === (messages?.[idx - 1]?.sender_id ?? '')}
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
							// scroll to bottom
							scrollContainer.scroll({
								top: scrollContainer?.scrollHeight - scrollContainer?.offsetHeight,
								behavior: 'smooth'
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
			bind:value={commentText}
			type="text"
			placeholder="Type here"
			class="input input-ghost w-full"
		/>
		<button class="btn" type="submit">Send</button>
	</form>
</div>
