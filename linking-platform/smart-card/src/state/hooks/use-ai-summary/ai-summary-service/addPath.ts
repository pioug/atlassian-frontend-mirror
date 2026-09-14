export const addPath = (baseUrl: string, path: string): string => {
	const urlWithTrailingSlash = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
	const pathWithoutLeadingSlash = !path.startsWith('/') ? path : path.substring(1, path.length);
	const url = [urlWithTrailingSlash, pathWithoutLeadingSlash].join('');
	return url;
};
