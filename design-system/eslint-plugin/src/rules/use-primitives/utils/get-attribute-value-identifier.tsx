import { isNodeOfType, type JSXAttribute } from 'eslint-codemod-utils';

/**
 * Bit of a weird name, but the functionality is quite specific, so this is the best I could do.
 * This function looks at a JSXAttribute, and returns the string representation
 * of the value if it's an identifier, e.g. `css={someStyles}` would return `'someStyles'`
 *
 * It returns undefined if it finds anything else, like:
 * - `css={[styles1, styles2]}`
 * - `css={...styles}`
 * - `css={styleMap[key]}`
 * - `css='what even is this'`
 * - etc
 */
export const getAttributeValueIdentifier = (attr: JSXAttribute | undefined): string | undefined => {
	if (!attr) {
		return undefined;
	}

	if (!isNodeOfType(attr, 'JSXAttribute')) {
		return undefined;
	}

	if (!attr.value) {
		return undefined;
	}

	if (!isNodeOfType(attr.value, 'JSXExpressionContainer')) {
		return undefined;
	}

	if (!isNodeOfType(attr.value.expression, 'Identifier')) {
		return undefined;
	}

	return attr.value.expression.name;
};
