<script lang="ts">
	import { formatDistance } from 'date-fns';
	import { timeStore } from './timeStore';

	export let sent_at: Date;
</script>

<time class="text-xs opacity-50">{formatDistance(sent_at, $timeStore)} ago</time>
