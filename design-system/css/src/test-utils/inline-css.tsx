import { type HTMLElementExtended, type HTMLStyleElementExtended } from './types';

if (typeof Node !== 'undefined') {
	/**
	 * Before overriding `textContent` property, we need to store the original, as well as a convenience
	 * property to access the original content with CSS. Remove CSS style definitions from `textContent` for none style nodes
	 */
	const textContentDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent')!;

	Object.defineProperty(Node.prototype, 'textContentOriginal', {
		enumerable: false,
		get() {
			return textContentDescriptor.get!.call(this);
		},
		set: undefined,
	});

	Object.defineProperty(Node.prototype, 'textContentWithoutCss', {
		enumerable: false,
		get() {
			return removeCssContent(this.textContentOriginal, this) ?? '';
		},
		set: undefined,
	});

	Object.defineProperty(Node.prototype, 'textContent', {
		...textContentDescriptor,
		get() {
			return isStyleElement(this) ? this.textContentOriginal : this.textContentWithoutCss;
		},
	});
}

/**
 * Check if a node is a `style` node with type guard
 * @param node Node
 * @returns boolean
 */
export function isStyleElement(node: Node): node is HTMLStyleElementExtended {
	return (
		isExtendedElement(node) &&
		node.tagName.toLowerCase() === 'style' &&
		node.hasAttribute('data-cmpld')
	);
}

export function isExtendedElement(node?: Node): node is HTMLElementExtended {
	return (
		!!node &&
		node.nodeType === node.ELEMENT_NODE &&
		typeof (node as any).textContentOriginal === 'string'
	);
}

/**
 * Return an array of CSS style definitions as text from a node and recursively through
 * the nodes children
 *
 * @param node Node
 * @returns string[]
 */
function getInnerCssContent(node: Node): string[] {
	if (isStyleElement(node)) {
		return [node.textContentOriginal];
	}
	if (!node.hasChildNodes() || !isExtendedElement(node)) {
		return [];
	}
	const output: string[] = [];
	node.querySelectorAll('style[data-cmpld]').forEach((style) => {
		if (isStyleElement(style)) {
			const text = style.textContentOriginal;
			if (text) {
				output.push(text);
			}
		}
	});
	return output;
}

/**
 * Return text with the inline CSS style definitions removed
 *
 * @param text string
 * @param node
 * @returns string
 */
function removeCssContent(text: string | number | null | undefined, node: Node): string {
	if (text === 0) {
		return test.toString();
	}
	if (!text) {
		return '';
	}
	return getInnerCssContent(node).reduce(
		(cleanedText, cssContent) => cleanedText.replace(cssContent, ''),
		text.toString(),
	);
}
