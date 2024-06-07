import { type EslintNode, isNodeOfType } from 'eslint-codemod-utils';

import { shape as shapeTokens } from '@atlaskit/tokens/tokens-raw';

const shapeProperties = [
	'borderTopLeftRadius',
	'borderTopRightRadius',
	'borderBottomRightRadius',
	'borderBottomLeftRadius',
	'borderRadius',
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
		.filter((t) => t.name.startsWith('border.radius'))
		// we prefer using the default (border.radius) over its aliases
		.filter((t) => !t.name.startsWith('border.radius.100'))
		.map((t) => {
			return [t.value, t.cleanName];
		})
		.concat([['3px', 'border.radius']]) // add in an extra entry to resolve 3px to border.radius (normally 4px)
		.concat([['50%', 'border.radius.circle']]), // add in an extra entry to resolve 50% to border.radius.circle (normally 2002rem)
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
