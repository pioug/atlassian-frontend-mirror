export function setCookie(key: string, value: string | number): void {
	document.cookie = `${key}=${value};path=/;max-age=30`;
}
