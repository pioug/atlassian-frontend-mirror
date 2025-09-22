export const isEventInContainer = (event: Event, containerSelector: string): boolean => {
	const target = event.target instanceof Element ? event.target : null;

	if (!target) {
		return false;
	}

	return !!target.closest(containerSelector);
};

export const isShortcutToFocusToolbar = (event: KeyboardEvent) => {
	return event.altKey && event.key === 'F10';
};

export const getFocusableElements = (rootNode: HTMLElement | null): Array<HTMLElement> => {
	if (!rootNode) {
		return [];
	}

	const focusableElements =
		(rootNode.querySelectorAll(
			'a[href], button:not([disabled]), textarea, input, select, div[tabindex="-1"], div[tabindex="0"]',
		) as NodeListOf<HTMLElement>) || [];

	const focusableElementsArray = Array.from(focusableElements);

	// filter out focusable elements from child components such as dropdown menus / popups
	return focusableElementsArray.filter((elm) => {
		const style = window.getComputedStyle(elm);

		// filter out invisible elements
		return style.visibility !== 'hidden' && style.display !== 'none';
	});
};
