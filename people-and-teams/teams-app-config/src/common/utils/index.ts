export function redirect(url: string): void {
	window.location.href = url;
}

export const openInNewTab = (url: string | URL) =>
	window.open(url, '_blank', 'noopener noreferrer');

export const hostname = (): string => globalThis.location?.hostname;

export const origin = (): string => globalThis.location?.origin;

export const pathname = (): string => globalThis.location?.pathname;
