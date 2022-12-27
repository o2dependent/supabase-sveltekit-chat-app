<script lang="ts">
	import { onMount } from 'svelte';

	export let value: string = '';
	export let label: string;
	export let name: string;
	export let placeholder: string;
	export let type: 'email' | 'password' | 'text' = 'text';
	export let topAltText: string = '';
	export let bottomErrorText: string = '';

	const onChange = (e: Event) => {
		value = (e.target as HTMLInputElement).value;
	};
</script>

<div class="form-control w-full mx-auto">
	<label class="label" for={name}>
		<span class="label-text">{label}</span>
		<span class="label-text-alt">{topAltText}</span>
	</label>
	<input
		id={name}
		{value}
		{name}
		{type}
		{placeholder}
		on:change={onChange}
		class="input input-bordered w-full placeholder:text-base-content/50 bg-base-200"
	/>
	<label class="label" for={name}>
		<span class="label-text-alt text-error whitespace-pre-line">{bottomErrorText}</span>
	</label>
</div>
