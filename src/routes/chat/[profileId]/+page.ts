import { supabase } from '$lib/supabaseClient';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { profile } = await parent();
	const { profileId } = params;
	const room_key = [profile?.id, profileId]
		.sort((a, b) => a?.localeCompare(b ?? '') ?? 0)
		.join('_');

	const { data: initialMessages } = await supabase
		.from('direct_messages')
		.select('*')
		.eq('room_key', room_key)
		.order('created_at', { ascending: true });

	console.log({ initialMessages });

	return { profileId, room_key, initialMessages };
};
