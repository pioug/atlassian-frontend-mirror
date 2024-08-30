export const USER_ARI_PREFIX = 'ari:cloud:identity::user/';

export const getAAIDFromARI = (ari: string): string | undefined => {
	return ari.replace(USER_ARI_PREFIX, '');
};
