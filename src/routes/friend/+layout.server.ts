import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { FriendsStatus } from '$types/friends-status.d';

type GetArrayType<T> = T extends (infer U)[] ? U : never;

export const load: LayoutServerLoad = async ({ parent }) => {
	const { profile, session } = await parent();

	if (!session?.user && !profile) {
		throw redirect(307, '/');
	}

	const { data: friends } = await supabase
		.from('friends')
		.select(`status, sender:sender_id(*), id`)
		.eq('user_id', profile?.id)
		.eq('status', FriendsStatus.ACCEPTED)
		.limit(25);

	const { data: requests } = await supabase
		.from('friends')
		.select(`status, sender:sender_id(*), id`)
		.eq('user_id', profile?.id)
		.eq('status', FriendsStatus.PENDING)
		.limit(25);

	return {
		friends: friends as
			| (GetArrayType<typeof friends> & {
					sender: { id: string; username: string; avatar_url: string };
			  })[]
			| null,
		requests: requests as
			| (GetArrayType<typeof requests> & {
					sender: { id: string; username: string; avatar_url: string };
			  })[]
			| null
	};
};
