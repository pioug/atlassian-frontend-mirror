const BROWSER_SIZE_THRESHOLD = 38;

export const AUTH_WINDOW_HEIGHT = 760;
export const AUTH_WINDOW_WIDTH = 620;

export const getWindowOpenFeatures = (
	popupHeight: number,
	popupWidth: number,
): string | undefined => {
	const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
	const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
	const vl = window.screenLeft || 0;
	const vt = window.screenTop || 0;

	// Center the popup window
	const left = (vw - popupWidth) / 2 + vl;
	const top = (vh - popupHeight) / 2 + vt;

	// Open a popup if there's enough space in the viewport
	// Otherwise, fall back to the default behavior (opening in a new tab)
	const windowFeatures =
		vw > popupWidth + BROWSER_SIZE_THRESHOLD && vh > popupHeight + BROWSER_SIZE_THRESHOLD
			? `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`
			: undefined;

	return windowFeatures;
};
