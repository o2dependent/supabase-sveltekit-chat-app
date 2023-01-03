<script lang="ts">
	export let searchText: string;
</script>

<label class="flex flex-col gap-2 w-full bg-base-200 p-2" for="search-username">
	<p>Add a friend</p>
	<input
		class="bg-base-200 px-2 py-1"
		bind:value={searchText}
		placeholder="Enter username"
		name="search-username"
	/>
</label>
