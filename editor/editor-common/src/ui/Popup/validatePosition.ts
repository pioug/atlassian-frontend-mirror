export function validatePosition(popup: HTMLElement): boolean {
	// popup.offsetParent does not exist if the popup element is not mounted
	if (!popup || !popup.offsetParent) {
		return false;
	}

	return true;
}
