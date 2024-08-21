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
	const matched = ari.match(/\/([a-zA-Z0-9_\|\-\:]{1,128})$/);
	return matched ? matched[1] : undefined;
};
