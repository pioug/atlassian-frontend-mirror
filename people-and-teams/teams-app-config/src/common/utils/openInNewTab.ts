export const openInNewTab = (url: string | URL): Window | null =>
	window.open(url, '_blank', 'noopener noreferrer');
