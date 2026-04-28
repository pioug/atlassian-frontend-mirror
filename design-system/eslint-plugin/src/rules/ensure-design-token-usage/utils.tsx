import type { Rule } from 'eslint';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
	callExpression,
	type CallExpression,
	type EslintNode,
	identifier,
	isNodeOfType,
	literal,
	type ObjectExpression,
	type Property,
	SimpleCallExpression,
	type SpreadElement,
	StringableASTNode,
	type TaggedTemplateExpression,
} from 'eslint-codemod-utils';

import { getScope } from '@atlaskit/eslint-utils/context-compat';
import { spacing as spacingScale } from '@atlaskit/tokens/tokens-raw';

import { findIdentifierInParentScope } from '../utils/find-in-parent';
import { isColorCssPropertyName } from '../utils/is-color';
import { isCurrentSurfaceCustomPropertyName } from '../utils/is-current-surface-custom-property-name';

import { borderWidthValueToToken } from './border-width-value-to-token';
import { cleanComments } from './clean-comments';
import { getRawExpression } from './get-raw-expression';
import { isBorderRadius } from './is-border-radius';
import { normaliseValue } from './normalise-value';
import { radiusValueToToken } from './radius-value-to-token';
import { isBorderSizeProperty, isShapeProperty } from './shape';
import { splitCssProperties } from './split-css-properties';
import { splitShorthandValues } from './split-shorthand-values';
import type { Domains } from './types';
const properties = [
	'padding',
	'paddingBlock',
	'paddingInline',
	'paddingLeft',
	'paddingTop',
	'paddingRight',
	'paddingBottom',
	'paddingInline',
	'paddingInlineStart',
	'paddingInlineEnd',
	'paddingBlock',
	'paddingBlockStart',
	'paddingBlockEnd',
	'marginLeft',
	'marginTop',
	'marginRight',
	'marginBottom',
	'marginInline',
	'marginInlineStart',
	'marginInlineEnd',
	'marginBlock',
	'marginBlockStart',
	'marginBlockEnd',
	'margin',
	'gap',
	'rowGap',
	'gridRowGap',
	'columnGap',
	'gridColumnGap',
	'top',
	'left',
	'right',
	'bottom',
	'inlineStart',
	'inlineEnd',
	'blockStart',
	'blockEnd',
	'outline-offset',
];

export type ProcessedCSSLines = [string, string][];

const spacingValueToToken = Object.fromEntries(
	spacingScale.map((token) => [token.value, token.cleanName]),
);

export const isSpacingProperty = (propertyName: string): boolean => {
	return properties.includes(propertyName);
};

export const getValueFromShorthand = (str: unknown): (string | number)[] => {
	const valueString = String(str);
	const fontFamily = /(Charlie)|(sans-serif$)|(monospace$)/;
	const fontWeightString = /(regular$)|(medium$)|(semibold$)|(bold$)/;
	const fontStyleString = /(inherit$)|(normal$)|(italic$)/;
	if (
		fontFamily.test(valueString) ||
		fontWeightString.test(valueString) ||
		fontStyleString.test(valueString)
	) {
		return [valueString];
	}
	// If we want to filter out NaN just add .filter(Boolean)
	return splitShorthandValues(String(str).trim()).map(removePixelSuffix);
};

const isGridSize = (node: EslintNode): node is CallExpression =>
	isNodeOfType(node, 'CallExpression') &&
	isNodeOfType(node.callee, 'Identifier') &&
	(node.callee.name === 'gridSize' || node.callee.name === 'getGridSize') &&
	// If there are arguments we know it's a custom gridSize function and cannot be certain what it returns
	node.arguments.length === 0;

const isToken = (node: EslintNode): node is CallExpression =>
	isNodeOfType(node, 'CallExpression') &&
	isNodeOfType(node.callee, 'Identifier') &&
	node.callee.name === 'token';

const getRawExpressionForToken = (node: CallExpression, context: Rule.RuleContext): string => {
	const args = node.arguments;
	const call = `\${token(${args
		.map((argNode) => {
			if (isNodeOfType(argNode, 'Literal')) {
				return argNode.raw;
			}

			if (isNodeOfType(argNode, 'Identifier')) {
				return argNode.name;
			}

			if (isNodeOfType(argNode, 'MemberExpression')) {
				return getValue(argNode, context);
			}
		})
		.join(', ')})}`;
	return call;
};

const isFontSize = (node: EslintNode): node is CallExpression =>
	isNodeOfType(node, 'CallExpression') &&
	isNodeOfType(node.callee, 'Identifier') &&
	(node.callee.name === 'fontSize' || node.callee.name === 'getFontSize');

const isFontSizeSmall = (node: EslintNode): node is CallExpression =>
	isNodeOfType(node, 'CallExpression') &&
	isNodeOfType(node.callee, 'Identifier') &&
	node.callee.name === 'fontSizeSmall';

const getValueFromCallExpression = (node: EslintNode, context: Rule.RuleContext) => {
	if (!isNodeOfType(node, 'CallExpression')) {
		return null;
	}

	if (isGridSize(node)) {
		return 8;
	}

	if (isBorderRadius(node)) {
		return 3;
	}

	if (isFontSize(node)) {
		return 14;
	}

	if (isFontSizeSmall(node)) {
		return 11;
	}

	if (isToken(node)) {
		return getRawExpressionForToken(node, context);
	}

	return null;
};

export const getValue = (
	node: EslintNode,
	context: Rule.RuleContext,
): string | number | (string | number)[] | null | undefined => {
	if (isNodeOfType(node, 'Literal')) {
		return getValueFromShorthand(node.value);
	}

	if (isNodeOfType(node, 'BinaryExpression')) {
		return getValueFromBinaryExpression(node, context);
	}

	if (isNodeOfType(node, 'UnaryExpression')) {
		return getValueFromUnaryExpression(node, context);
	}

	if (isNodeOfType(node, 'CallExpression')) {
		return getValueFromCallExpression(node, context);
	}

	if (isNodeOfType(node, 'Identifier')) {
		return getValueFromIdentifier(node, context);
	}

	if (isNodeOfType(node, 'TemplateLiteral')) {
		return getValueFromTemplateLiteral(node, context);
	}

	return null;
};

const getValueFromIdentifier = (
	node: EslintNode,
	context: Rule.RuleContext,
): number | null | any[] | string | undefined => {
	if (!isNodeOfType(node, 'Identifier')) {
		return null;
	}

	if (node.name === 'gridSize') {
		return 8;
	}

	const scope = getScope(context, node);
	const variable = findIdentifierInParentScope({
		scope,
		identifierName: node.name,
	});

	if (!variable) {
		return null;
	}

	const definition = variable.defs[0];

	if (
		isNodeOfType(definition.node, 'ImportSpecifier') &&
		isNodeOfType(definition.node.parent!, 'ImportDeclaration') &&
		definition.node.parent.source.value === '@atlassian/jira-common-styles/src/main.tsx'
	) {
		return definition.node.imported.type === 'Identifier' &&
			definition.node.imported.name === 'gridSize'
			? 8
			: null;
	}

	if (!isNodeOfType(definition.node, 'VariableDeclarator')) {
		return null;
	}

	if (!definition.node.init) {
		return null;
	}

	return getValue(definition.node.init, context);
};

const getValueFromUnaryExpression = (
	node: EslintNode,
	context: Rule.RuleContext,
): number | null => {
	if (!isNodeOfType(node, 'UnaryExpression')) {
		return null;
	}

	const value = getValue(node.argument, context);

	if (!value) {
		return null;
	}

	// eslint-disable-next-line no-eval
	return eval(`${node.operator}(${value})`);
};

/**
 * @example
 * ```js
 * `2 ${variable} 0`
 *
 * // results in [2, NaN, 0]
 * ```
 * ```js
 * const variable = 4;
 * `2 ${variable} 0`
 *
 * // results in [2, 4, 0]
 * ```
 */
export const getValueFromTemplateLiteralRaw = (
	node: EslintNode,
	context: Rule.RuleContext,
): string[] | string | null => {
	if (!isNodeOfType(node, `TemplateLiteral`)) {
		return null;
	}

	const combinedString = node.quasis
		.map((q, i) => {
			return `${q.value.raw}${node.expressions[i] ? getValue(node.expressions[i], context) : ''}`;
		})
		.join('')
		.trim();

	const fontFamily = /(sans-serif$)|(monospace$)/;
	if (fontFamily.test(combinedString)) {
		return combinedString;
	}

	return combinedString.split(' ');
};

const getValueFromTemplateLiteral = (
	node: EslintNode,
	context: Rule.RuleContext,
): number[] | string[] | string | null => {
	const value = getValueFromTemplateLiteralRaw(node, context);

	return Array.isArray(value) ? (value.map(removePixelSuffix) as any[]) : value;
};

const getValueFromBinaryExpression = (
	node: EslintNode,
	context: Rule.RuleContext,
): number | null => {
	if (!isNodeOfType(node, 'BinaryExpression')) {
		return null;
	}

	const { left, right, operator } = node;

	const leftValue = getValue(left, context);
	const rightValue = getValue(right, context);
	const final =
		rightValue && leftValue
			? // eslint-disable-next-line no-eval
				eval(`${leftValue}${operator}${rightValue}`)
			: null;

	return final;
};

const emRegex = /(.*\d+)em$/;
const percentageRegex = /(%$)/;

export const emToPixels = <T extends unknown>(
	value: T,
	fontSize: number | null | undefined,
): number | T | null => {
	if (typeof value === 'string') {
		const emMatch = value.match(emRegex);
		if (emMatch && typeof fontSize === 'number') {
			return Number(emMatch[1]) * fontSize;
		} else if (value.match(percentageRegex)) {
			return value;
		} else {
			return null;
		}
	}
	return value;
};

const percentageOrEmOrAuto = /(%$)|(\d+em$)|(auto$)/;

export const removePixelSuffix = (value: string | number): string | number => {
	if (typeof value === 'string' && (percentageOrEmOrAuto.test(value) || isCalc(value))) {
		return value;
	}

	return Number(typeof value === 'string' ? value.replace('px', '') : value);
};

const invalidSpacingUnitRegex = /(\d+rem$)|(vw$)|(vh$)/;

export const isValidSpacingValue = (
	value: string | number | boolean | RegExp | null | undefined | any[] | bigint,
	fontSize?: number | null | undefined,
): boolean => {
	if (typeof value === 'string') {
		if (invalidSpacingUnitRegex.test(value)) {
			return false;
		}
	} else if (Array.isArray(value)) {
		// could be array due to shorthand
		for (const val in value) {
			if (invalidSpacingUnitRegex.test(val)) {
				return false;
			}
		}
	}

	if (emRegex.test(value as string) && typeof fontSize !== 'number') {
		return false;
	}
	return true;
};

const calcRegex = /(^calc)/;

export const isCalc = (
	value: string | number | boolean | RegExp | null | undefined | any[] | bigint,
): boolean => {
	if (typeof value === 'string') {
		if (calcRegex.test(value)) {
			return true;
		}
	}
	return false;
};

/**
 * Returns an array of domains that are relevant to the provided property based on the rule options.
 * @param propertyName camelCase CSS property
 * @param targetOptions Array containing the types of properties that should be included in the rule.
 * @example
 * ```
 * propertyName: padding, targetOptions: ['spacing'] -> returns ['spacing']
 * propertyName: backgroundColor, targetOptions: ['spacing'] -> returns []
 * propertyName: backgroundColor, targetOptions: ['color', 'spacing'] -> returns ['color']
 * ```
 */
export function getDomainsForProperty(propertyName: string, targetOptions: Domains): Domains {
	const domains: Domains = [];
	if (
		(isColorCssPropertyName(propertyName) || isCurrentSurfaceCustomPropertyName(propertyName)) &&
		targetOptions.includes('color')
	) {
		domains.push('color');
	}

	if (isSpacingProperty(propertyName) && targetOptions.includes('spacing')) {
		domains.push('spacing');
	}

	if (isShapeProperty(propertyName) && targetOptions.includes('shape')) {
		domains.push('shape');
	}

	return domains;
}

/**
 * Returns an array of tuples representing a processed css within `TaggedTemplateExpression` node.
 * Each element of the array is a tuple `[string, string]`,
 * where the first element is the processed css line with computed values
 * and the second element of the tuple is the original css line from source.
 * @param node TaggedTemplateExpression node.
 * @param context Rule.RuleContext.
 * @example
 * ```
 * `[['padding: 8', 'padding: ${gridSize()}'], ['margin: 6', 'margin: 6px' ]]`
 * ```
 */
export function processCssNode(
	node: TaggedTemplateExpression & Rule.NodeParentExtension,
	context: Rule.RuleContext,
): ProcessedCSSLines | undefined {
	const combinedString = node.quasi.quasis
		.map((q, i) => {
			return `${q.value.raw}${
				node.quasi.expressions[i] ? getValue(node.quasi.expressions[i], context) : ''
			}`;
		})
		.join('');

	const rawString = node.quasi.quasis
		.map((q, i) => {
			return `${q.value.raw}${
				node.quasi.expressions[i]
					? getRawExpression(node.quasi.expressions[i], context)
						? `\${${getRawExpression(node.quasi.expressions[i], context)}}`
						: null
					: ''
			}`;
		})
		.join('');
	const cssProperties = splitCssProperties(cleanComments(combinedString));
	const unalteredCssProperties = splitCssProperties(cleanComments(rawString));
	if (cssProperties.length !== unalteredCssProperties.length) {
		// this means something went wrong with the parsing, the original lines can't be reconciled with the processed lines
		return undefined;
	}
	return cssProperties.map((cssProperty, index): [string, string] => [
		cssProperty,
		unalteredCssProperties[index],
	]);
}

/**
 * Returns a token node for a given value including fallbacks.
 * @param propertyName camelCase CSS property
 * @param value string representing pixel value, or font family, or number representing font weight
 * @example
 * ```
 * propertyName: padding, value: '8px' => token('space.100', '8px')
 * propertyName: fontWeight, value: 400 => token('font.weight.regular', '400')
 * ```
 */
export function getTokenNodeForValue(
	propertyName: string,
	value: string,
): StringableASTNode<SimpleCallExpression> {
	const token = findTokenNameByPropertyValue(propertyName, value);
	const fallbackValue =
		propertyName === 'fontFamily' ? { value: `${value}`, raw: `\`${value}\`` } : `${value}`;

	return callExpression({
		callee: identifier({ name: 'token' }),
		arguments: [
			literal({
				value: `'${token ?? ''}'`,
			}),
			literal(fallbackValue),
		],
		optional: false,
	});
}

export function getFontSizeValueInScope(cssProperties: ProcessedCSSLines): number | undefined {
	const fontSizeNode = cssProperties.find(([style]) => {
		const [rawProperty, value] = style.split(':');
		return /font-size/.test(rawProperty) ? value : null;
	});
	if (!fontSizeNode) {
		return undefined;
	}
	const [_, fontSizeValue] = fontSizeNode[0].split(':');
	if (!fontSizeValue) {
		return undefined;
	}
	return getValueFromShorthand(fontSizeValue)[0] as number;
}

export function findTokenNameByPropertyValue(
	propertyName: string,
	value: string,
): string | undefined {
	const lookupValue = normaliseValue(propertyName, value);
	const tokenName = isShapeProperty(propertyName)
		? isBorderSizeProperty(propertyName)
			? borderWidthValueToToken[lookupValue]
			: radiusValueToToken[lookupValue]
		: spacingValueToToken[lookupValue];

	if (!tokenName) {
		return undefined;
	}

	return tokenName;
}

/**
 * Returns a stringifiable node with the token expression corresponding to its matching token.
 * If no token found for the pair the function returns undefined.
 * @param propertyName string camelCased css property.
 * @param value The computed value e.g '8px' -> '8'.
 */
export function getTokenReplacement(
	propertyName: string,
	value: string,
): StringableASTNode<SimpleCallExpression> | undefined {
	const tokenName = findTokenNameByPropertyValue(propertyName, value);

	if (!tokenName) {
		return undefined;
	}

	const fallbackValue = normaliseValue(propertyName, value);

	return getTokenNodeForValue(propertyName, fallbackValue);
}

export function getPropertyNodeFromParent(
	property: string,
	parentNode: ObjectExpression & Rule.NodeParentExtension,
): Property | SpreadElement | undefined {
	const propertyNode = parentNode.properties.find((node) => {
		if (!isNodeOfType(node, 'Property')) {
			return;
		}

		if (!isNodeOfType(node.key, 'Identifier')) {
			return;
		}

		return node.key.name === property;
	});

	return propertyNode;
}

export function getValueForPropertyNode(
	propertyNode: Property | SpreadElement,
	context: Rule.RuleContext,
): string | number | null | undefined {
	const propertyValueRaw = isNodeOfType(propertyNode!, 'Property')
		? getValue(propertyNode.value, context)
		: null;

	const propertyValue = Array.isArray(propertyValueRaw) ? propertyValueRaw[0] : propertyValueRaw;

	return propertyValue;
}
