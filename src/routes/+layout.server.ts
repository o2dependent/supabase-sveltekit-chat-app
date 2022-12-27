import { supabase } from '$lib/supabaseClient';
import type { Database } from '$types/supabase';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const load: LayoutServerLoad = async (event) => {
	const session = await getServerSession(event);

	let profile: null | Profile = null;

	if (session?.user?.id) {
		const { data: profileData } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', session?.user?.id)
			.single();
		profile = profileData;
	}

	if (!profile?.username && session?.user && event.url.pathname !== '/onboard') {
		throw redirect(307, '/onboard');
	}

	return { session, profile };
};
