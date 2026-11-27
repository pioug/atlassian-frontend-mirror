import { getStudioHost } from './getStudioHost';

const getStudioSessionSyncUrl = (path: string, email: string): string => {
	const url = new URL(`${getStudioHost()}${path}`);
	url.searchParams.set('login_hint', email);
	return url.toString();
};

export const getStudioPath = (path: string, email?: string): string => {
	if (email) {
		return getStudioSessionSyncUrl(path, email);
	}
	return `${getStudioHost()}${path}`;
};
