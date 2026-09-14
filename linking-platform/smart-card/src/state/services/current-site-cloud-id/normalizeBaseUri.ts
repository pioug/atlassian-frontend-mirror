export function normalizeBaseUri(baseUriWithNoTrailingSlash = ''): string {
	return baseUriWithNoTrailingSlash.replace(/\/$/, '');
}
