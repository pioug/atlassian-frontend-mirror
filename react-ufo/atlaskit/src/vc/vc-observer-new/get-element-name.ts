export type SelectorConfig = {
	id: boolean;
	testId: boolean;
	role: boolean;
	className: boolean;
	dataVC?: boolean;
};

const nameCache: WeakMap<HTMLElement, string> = new WeakMap();
export default function getElementName(selectorConfig: SelectorConfig, element: Element): string {
	if (!(element instanceof HTMLElement)) {
		return 'error';
	}
	const cachedName = nameCache.get(element);
	if (cachedName) {
		return cachedName;
	}
	// Get the tag name of the element.
	const tagName = element.localName;

	const encodeValue = (s: string) => {
		try {
			return encodeURIComponent(s);
		} catch (e) {
			return 'malformed_value';
		}
	};

	// Helper function to construct attribute selectors.
	const getAttributeSelector = (attributeName: string, prefix: string = ''): string => {
		const attrValue = element.getAttribute(attributeName);
		if (!attrValue) {
			return '';
		}

		const encondedAttrValue = encodeValue(attrValue);
		return `${prefix}[${attributeName}="${encondedAttrValue}"]`;
	};

	// Construct the data-vc attribute selector if specified in the config.
	const dataVC = selectorConfig.dataVC ? getAttributeSelector('data-vc') : '';

	// Construct the ID selector if specified in the config and the element has an ID.
	const id = selectorConfig.id && element.id ? `#${encodeValue(element.id)}` : '';

	// Construct the test ID selector if specified in the config.
	const testId = selectorConfig.testId
		? getAttributeSelector('data-testid') || getAttributeSelector('data-test-id')
		: '';

	// Construct the role selector if specified in the config.
	const role = selectorConfig.role ? getAttributeSelector('role') : '';

	const classNames = Array.from(element.classList).map(encodeValue).join('.');
	// Construct the class list selector if specified in the config.
	const classList = selectorConfig.className && classNames ? `.${classNames}` : '';

	// Combine primary attribute selectors (id, testId, role) into a single string.
	const primaryAttributes = [id, testId, role].filter(Boolean).join('');

	// Use dataVC if available, otherwise use the primary attributes.
	const attributes = dataVC || primaryAttributes;

	// If no attributes or class list, recursively get the parent's name.
	if (!attributes && !classList) {
		const parentName = element.parentElement
			? getElementName(selectorConfig, element.parentElement)
			: 'unknown';
		return `${parentName} > ${tagName}`;
	}

	// Return the final constructed name: tagName + attributes or classList.
	const name = `${tagName}${attributes || classList}`;

	nameCache.set(element, name);

	return name;
}
