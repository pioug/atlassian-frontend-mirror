export const USER_ARI_PREFIX = 'ari:cloud:identity::user/';

export const createHeaders = (product: string, cloudId: string): Headers => {
	const config = {
		headers: {
			'X-Product': product,
			'X-Experience-Id': 'profile-card',
			'X-Cloudid': cloudId,
		},
	};

	return new Headers({
		...(config.headers || {}),
	});
};

export const getAAIDFromARI = (ari: string): string | undefined => {
	return ari.replace(USER_ARI_PREFIX, '');
};
