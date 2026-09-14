/**
 * Checks if the current code is running inside an iframe.
 * @returns true if running in an iframe, false otherwise
 */
export const isInIframe: any = (): boolean => {
	try {
		return window !== window.top;
	} catch {
		// If we can't access window.top due to cross-origin restrictions, assume we're in an iframe
		return true;
	}
};
