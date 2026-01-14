export const REDIRECT_COUNT = 'redirectCount';
export const IDENTITY_CSRF_TOKEN = 'avatar.csrf.token';

export function setCookie(key: string, value: string | number): void {
	document.cookie = `${key}=${value};path=/;max-age=30`;
}

export function getCookieAsInteger(key: string, defaultValue = 0): number {
	const regex = new RegExp(`${key}=(\\d+)`);
	const result = document.cookie.match(regex);

	return result ? parseInt(result[1], 10) : defaultValue;
}

export function clearCookie(key: string): void {
	document.cookie = `${key}=doesntmatter;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}
