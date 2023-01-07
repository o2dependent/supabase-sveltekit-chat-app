<script lang="ts">
	import { session } from './session.store';
	import { profile } from './profile.store';
	import Avatar from '$lib/profile/Avatar.svelte';
	import '../app.postcss';

	let open = false;
</script>

<header class="drawer">
	<input bind:checked={open} id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="w-full bg-base-300">
			<div class="navbar container mx-auto">
				<div class="flex-none lg:hidden">
					<label for="my-drawer-3" class="btn btn-square btn-ghost">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="inline-block w-6 h-6 stroke-current"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/></svg
						>
					</label>
				</div>
				<div class="flex-1 px-2 mx-2">Navbar Title</div>
				<div class="flex-none hidden lg:block">
					<ul class="menu menu-horizontal">
						{#if $session && $profile}
							<Avatar full_name={$profile?.full_name} avatar_url={$profile?.avatar_url} online />
							<li>@{$profile?.username}</li>
						{:else}
							<!-- Navbar menu content here -->
							<li><a on:click={() => (open = false)} href="/login">Login</a></li>
						{/if}
					</ul>
				</div>
			</div>
		</div>
		<!-- Page content here -->
		<main class="mx-auto container h-fit flex-grow">
			<slot />
		</main>
	</div>
	<div class="drawer-side">
		<label for="my-drawer-3" class="drawer-overlay" />
		<ul class="menu p-4 w-80 bg-base-100">
			{#if $session && $profile}
				<div>
					<span class="flex gap-4">
						<Avatar full_name={$profile?.full_name} avatar_url={$profile?.avatar_url} online />
						<p>@{$profile?.username}</p>
					</span>
				</div>
				<li>
					<a on:click={() => (open = false)} href="/friend">Friends</a>
				</li>
				<li>
					<a on:click={() => (open = false)} href="/chat">Chat</a>
				</li>
			{:else}
				<!-- Navbar menu content here -->
				<li><a on:click={() => (open = false)} href="/login">Login</a></li>
			{/if}
		</ul>
	</div>
</header>
