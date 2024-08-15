const interactiveTags: string[] = ['button', 'a', 'input', 'select', 'textarea'];

export const isInteractiveElement = (element: HTMLElement): boolean => {
	if (interactiveTags.includes(element.tagName.toLowerCase())) {
		return true;
	}

	if (element.getAttribute('tabindex') !== null || element.hasAttribute('contenteditable')) {
		return true;
	}

	return false;
};
