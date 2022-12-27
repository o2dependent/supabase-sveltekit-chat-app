import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ parent }) => {
	const { session } = await parent();
	if (session?.user?.id) {
		throw redirect(303, '/');
	}
};
