<script lang="ts">
	import { goto } from '$app/navigation';
	import LabeledTextInput from '$lib/inputs/LabeledTextInput.svelte';
	import { supabase } from '$lib/supabaseClient';
	import type { PageData } from './$types';
	import AvatarUpload from './AvatarUpload.svelte';

	export let data: PageData;

	let loading = false;
	let username = '';
	let full_name = '';
	let avatar_url = '';

	const updateProfile = async () => {
		try {
			loading = true;

			if (!data?.session) {
				throw new Error('You must be logged in to update your profile');
			}

			const { user } = data?.session;

			const { error } = await supabase.from('profiles').upsert({
				id: user.id,
				username,
				full_name,
				avatar_url,
				updated_at: new Date().toDateString()
			});

			if (error) throw error;

			goto('/');
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex flex-col flex-grow max-w-md mx-auto">
	<h1 class="text-4xl">Create your profile!</h1>
	<p>Looks like your new. Let's make your profile!</p>
	<form class="max-w-md w-full mx-auto flex flex-col gap-2">
		<AvatarUpload bind:url={avatar_url} size={10} on:upload={updateProfile} />
		<LabeledTextInput
			label="Full Name"
			placeholder="Don Dummy"
			name="full_name"
			bind:value={full_name}
		/>
		<LabeledTextInput label="Username" placeholder="dummy" name="username" bind:value={username} />
		<button
			disabled={loading}
			class:loading
			type="submit"
			class="btn btn-primary"
			on:click|preventDefault={updateProfile}
		>
			Submit
		</button>
	</form>
</div>
