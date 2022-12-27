<script lang="ts">
	import Avatar from '$lib/profile/Avatar.svelte';
	import '../app.postcss';
	import type { PageData } from './$types';

	export let data: PageData;

	$: console.log({ data });
</script>

<header class="drawer">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
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
						{#if data?.session && data?.profile}
							<Avatar
								full_name={data?.profile?.full_name}
								avatar_url={data?.profile?.avatar_url}
								online
							/>
							<li>@{data.profile?.username}</li>
						{:else}
							<!-- Navbar menu content here -->
							<li><a href="/login">Login</a></li>
						{/if}
					</ul>
				</div>
			</div>
		</div>
		<!-- Page content here -->
		<main class="mx-auto container">
			<slot />
		</main>
	</div>
	<div class="drawer-side">
		<label for="my-drawer-3" class="drawer-overlay" />
		<ul class="menu p-4 w-80 bg-base-100">
			{#if data?.session && data?.profile}
				<li class="flex gap-4">
					<div class="avatar online">
						<div class="w-24 rounded-full">
							<img src="https://placeimg.com/192/192/people" />
						</div>
					</div>
					<p>@{data.profile?.username}</p>
				</li>
			{:else}
				<!-- Navbar menu content here -->
				<li><a href="/login">Login</a></li>
			{/if}
		</ul>
	</div>
</header>
