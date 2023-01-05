import { supabase } from '$lib/supabaseClient';
import type { Database } from '$types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'] | null;

export const searchFriends = async (search_text: string, profile: Profile) => {
	const { data: newSearchedFriends } = await supabase
		.from('profiles')
		.select(
			`*, outgoing_requests:friends!friends_user_id_fkey(id, status), incoming_requests:friends!friends_requester_id_fkey(id, status)`
		)
		.ilike('username', `%${search_text}%`)
		.eq('outgoing_requests.requester_id', profile?.id)
		.eq('incoming_requests.user_id', profile?.id)
		.neq('id', profile?.id);
	return newSearchedFriends;
};
