import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { FriendsStatus } from '$types/friends-status';

type GetArrayType<T> = T extends (infer U)[] ? U : never;

export const load: LayoutServerLoad = async ({ parent }) => {
	const { profile, session } = await parent();

	if (!session?.user && !profile) {
		throw redirect(307, '/');
	}

	const { data: friends, error } = await supabase
		.from('friends')
		.select(`status, sender:friends_requester_id_fkey(*), id`)
		.eq('user_id', profile?.id)
		.eq('status', FriendsStatus.ACCEPTED)
		.limit(25);

	const { data: requests, error: requestsError } = await supabase
		.from('friends')
		.select(`status, sender:profiles!friends_requester_id_fkey(*), id, user_id`)
		.eq('user_id', profile?.id)
		.eq('status', FriendsStatus.PENDING)
		.limit(25);

	return {
		friends: friends as
			| (GetArrayType<typeof friends> & {
					sender: { id: string; username: string; avatar_url: string; full_name: string };
			  })[]
			| null,
		requests: requests as
			| (GetArrayType<typeof requests> & {
					sender: { id: string; username: string; avatar_url: string; full_name: string };
			  })[]
			| null
	};
};
