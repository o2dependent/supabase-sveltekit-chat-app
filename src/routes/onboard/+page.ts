import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { session, profile } = await parent();

	if (!session?.user || (session?.user && profile?.username)) {
		throw redirect(307, '/');
	}
	return { session, profile };
};
