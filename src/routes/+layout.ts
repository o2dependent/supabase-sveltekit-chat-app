import type { LayoutLoad } from './$types';
import { session } from './session.store';
import { profile } from './profile.store';

export const load: LayoutLoad = async ({ data }) => {
	session.set(data?.session ?? null);
	profile.set(data?.profile ?? null);

	return { session: data?.session ?? null, profile: data?.profile ?? null };
};
