import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: LayoutServerLoad = async ({ parent }) => {
	const { profile, session } = await parent();

	if (!session?.user && !profile) {
		throw redirect(307, '/');
	}

	const { data: profiles } = await supabase.from('profiles').select('*');

	return { profiles };
};
