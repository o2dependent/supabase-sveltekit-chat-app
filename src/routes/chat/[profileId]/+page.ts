import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { profile } = await parent();
	const { profileId } = params;
	const room_key = [profile?.id, profileId]
		.sort((a, b) => a?.localeCompare(b ?? '') ?? 0)
		.join('_');

	console.log({ unsortedKey: [profile?.id, profileId], room_key, profileId });

	return { profileId, room_key };
};
