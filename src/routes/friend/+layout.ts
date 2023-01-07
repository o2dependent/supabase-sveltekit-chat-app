import type { LayoutLoad } from './$types';
import { friends } from './friends.store';
import { requests } from './requests.store';

export const load: LayoutLoad = async ({ data }) => {
	friends.set(data?.friends ?? []);
	requests.set(data?.requests ?? []);

	return { friends, requests };
};
