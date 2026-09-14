export function clearCookie(key: string): void {
	document.cookie = `${key}=doesntmatter;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}
