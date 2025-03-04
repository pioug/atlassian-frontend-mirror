export type SelectorConfig = {
	id: boolean;
	testId: boolean;
	role: boolean;
	className: boolean;
	dataVC?: boolean;
};

const nameCache: WeakMap<HTMLElement, string> = new WeakMap();

function getAttributeSelector(element: HTMLElement, attributeName: string): string {
	const attrValue = element.getAttribute(attributeName);
	if (!attrValue) {
		return '';
	}
	return `[${attributeName}="${encodeURIComponent(attrValue)}"]`;
}

function isSelectorUnique(selector: string): boolean {
	return document.querySelectorAll(selector).length === 1;
}

function getUniqueSelector(selectorConfig: SelectorConfig, element: HTMLElement): string {
	let currentElement: HTMLElement | null = element;
	const parts: string[] = [];

	while (currentElement && currentElement.localName !== 'body') {
		const tagName = currentElement.localName;
		let selectorPart = tagName;

		if (selectorConfig.id && currentElement.id) {
			selectorPart += `#${encodeURIComponent(currentElement.id)}`;
		} else if (selectorConfig.dataVC) {
			selectorPart += getAttributeSelector(currentElement, 'data-vc');
		} else if (selectorConfig.testId) {
			selectorPart +=
				getAttributeSelector(currentElement, 'data-testid') ||
				getAttributeSelector(currentElement, 'data-test-id');
		} else if (selectorConfig.role) {
			selectorPart += getAttributeSelector(currentElement, 'role');
		} else if (selectorConfig.className && currentElement.className) {
			const classNames = Array.from(currentElement.classList).map(encodeURIComponent).join('.');
			if (classNames) {
				selectorPart += `.${classNames}`;
			}
		}

		parts.unshift(selectorPart);
		const potentialSelector = parts.join(' > ').trim();

		if (potentialSelector && isSelectorUnique(potentialSelector)) {
			return potentialSelector;
		}
		currentElement = currentElement.parentElement;
	}

	const potentialSelector = parts.join(' > ').trim();
	if (!potentialSelector) {
		return 'unknown';
	} else if (!isSelectorUnique(potentialSelector)) {
		const parentElement = element.parentElement;
		if (parentElement) {
			const siblingIndex = Array.from(parentElement.children).indexOf(element) + 1;
			return `${potentialSelector}:nth-child(${siblingIndex})`;
		}
	}

	return potentialSelector;
}

export default function getElementName(selectorConfig: SelectorConfig, element: Element): string {
	if (!(element instanceof HTMLElement)) {
		return 'error';
	}
	const cachedName = nameCache.get(element);
	if (cachedName) {
		return cachedName;
	}

	const uniqueSelector = getUniqueSelector(selectorConfig, element);
	nameCache.set(element, uniqueSelector);

	return uniqueSelector;
}
