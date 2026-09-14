export function getCookieAsInteger(key: string, defaultValue = 0): number {
	const regex = new RegExp(`${key}=(\\d+)`);
	const result = document.cookie.match(regex);

	return result ? parseInt(result[1], 10) : defaultValue;
}
