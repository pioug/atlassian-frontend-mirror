export const findParentByClassname = (
	element: HTMLElement,
	className: string,
	maxParentElement: HTMLElement = document.body,
): HTMLElement | undefined => {
	if (element.classList.contains(className)) {
		return element;
	}

	let currentElement = element;

	while (currentElement.parentElement !== maxParentElement) {
		if (currentElement.parentElement) {
			currentElement = currentElement.parentElement;

			if (currentElement.classList.contains(className)) {
				return currentElement;
			}
		} else {
			return undefined;
		}
	}

	return undefined;
};
