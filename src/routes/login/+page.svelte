<script lang="ts">
	import LabeledTextInput from '$lib/inputs/LabeledTextInput.svelte';
	import { supabase } from '$lib/supabaseClient';

	export let form: { error: boolean; message: string };

	let loading = false;
	let email = '';

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signInWithOtp({ email });
			if (error) throw error;
			alert('Check your email for the login link!');
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};
</script>

<div class="max-w-md p-4 mx-auto pt-32">
	<div class="relative w-fit">
		<div class="bg-primary w-full h-full absolute top-0 left-0 -skew-x-6" />
		<h1 class="font-bold z-10 text-5xl mx-auto text-primary-content w-fit relative py-1 px-4">
			Login
		</h1>
	</div>
</div>
<div class="flex items-center justify-center w-full">
	<form
		on:submit|preventDefault={handleLogin}
		class="w-full max-w-md p-4 rounded-lg bg-base-100 flex flex-col gap-2 shadow-md pb-8"
	>
		<LabeledTextInput
			bind:value={email}
			label="Email"
			name="email"
			placeholder="dummy@dumbdown.tech"
		/>

		<button class:loading type="submit" class="btn btn-primary max-w-xs w-full mx-auto"
			>Login</button
		>
		<div class="max-w-xs mx-auto w-full">
			<div class="divider" />
			<p class="text-center">
				Need an account? <a class="text-primary hover:underline" href="/register">Register here</a>
			</p>
		</div>
	</form>
</div>
{#if form?.error}
	<div class="fixed bottom-8 left-0 px-4 sm:px-8 w-full flex items-center justify-center">
		<div class="max-w-2xl alert alert-error shadow-lg">
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current flex-shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				<span>{form?.message ?? ''}</span>
			</div>
		</div>
	</div>
{/if}
