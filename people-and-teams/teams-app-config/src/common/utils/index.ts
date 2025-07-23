export function redirect(url: string) {
	window.location.href = url;
}

export const openInNewTab = (url: string | URL) =>
	window.open(url, '_blank', 'noopener noreferrer');

export const hostname = () => globalThis.location?.hostname;

export const origin = () => globalThis.location?.origin;

export const pathname = () => globalThis.location?.pathname;
