import { type EslintNode, isNodeOfType } from 'eslint-codemod-utils';

import { shape as shapeTokens } from '@atlaskit/tokens/tokens-raw';

const shapeProperties = [
	'borderTopLeftRadius',
	'borderTopRightRadius',
	'borderBottomRightRadius',
	'borderBottomLeftRadius',
	'borderRadius',
	'borderStartStartRadius',
	'borderStartEndRadius',
	'borderEndStartRadius',
	'borderEndEndRadius',
];

const borderSizeProperties = [
	'borderWidth',
	'outlineWidth',
	'borderRightWidth',
	'borderLeftWidth',
	'borderTopWidth',
	'borderBottomWidth',
	'borderInlineWidth',
	'borderBlockWidth',
];

export const radiusValueToToken = Object.fromEntries(
	shapeTokens
		.filter((t) => t.name.startsWith('radius'))
		.map((t) => {
			return [t.value, t.cleanName];
		})
		// add in extra entries to resolve 3px, 50%, and 100% to tokens
		.concat([
			['3px', 'radius.small'],
			['50%', 'radius.full'],
			['100%', 'radius.full'],
		]),
);

export const borderWidthValueToToken = Object.fromEntries(
	shapeTokens
		.filter((t) => t.name.startsWith('border.width'))
		.map((t) => [t.value, t.cleanName])
		.concat([['2px', 'border.width']]),
);

export function isRadiusProperty(propertyName: string) {
	return shapeProperties.includes(propertyName);
}

export function isBorderSizeProperty(propertyName: string) {
	return borderSizeProperties.includes(propertyName);
}

export function isShapeProperty(propertyName: string) {
	return isRadiusProperty(propertyName) || isBorderSizeProperty(propertyName);
}

export function isBorderRadius(node: EslintNode) {
	return (
		isNodeOfType(node, 'CallExpression') &&
		isNodeOfType(node.callee, 'Identifier') &&
		(node.callee.name === 'borderRadius' || node.callee.name === 'getBorderRadius')
	);
}
