/**
 * IE11 doesn't support classList to SVGElements
 **/
export const containsClassName = (
	node: HTMLElement | SVGElement | null,
	className: string,
): boolean => {
	if (!node) {
		return false;
	}

	if (node.classList && node.classList.contains) {
		return node.classList.contains(className);
	}

	if (!node.className) {
		return false;
	}

	const classNames =
		typeof node.className.baseVal === 'string' ? node.className.baseVal : node.className;
	return classNames.split(' ').indexOf(className) !== -1;
};
