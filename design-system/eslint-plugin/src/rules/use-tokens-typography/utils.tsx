import {
	callExpression,
	type Expression,
	type Identifier,
	identifier,
	literal,
	type MemberExpression,
	memberExpression,
	type Property,
	property,
	type SpreadElement,
	type StringableASTNode,
} from 'eslint-codemod-utils';

import { typographyPalette } from '@atlaskit/tokens/palettes-raw';
import { typography as typographyTokens } from '@atlaskit/tokens/tokens-raw';

export type TokenValueMap = {
	tokenName: string;
	tokenValue: string;
	values: {
		fontSize?: string;
		fontWeight?: string;
		lineHeight?: string;
	};
};

export const typographyValueToToken: TokenValueMap[] = typographyTokens
	// we're filtering here to remove the `font` tokens.
	.filter((t) => t.attributes.group === 'typography')
	.filter((t) => t.cleanName.includes('font.heading') || t.cleanName.includes('font.body'))
	// Filtering out UNSAFE tokens that were meant for migrations, these tokens are deprecated and will be removed in the future
	.filter((t) => !t.cleanName.includes('UNSAFE'))
	.map((currentToken): TokenValueMap => {
		const individualValues = {
			fontSize: typographyPalette.find(
				(baseToken) =>
					baseToken.path.slice(-1)[0] ===
					// @ts-expect-error token.original.value can be a string, due to the typographyTokens export including deprecated tokens
					currentToken.original.value.fontSize,
			)?.value,
			fontWeight: typographyPalette.find(
				(baseToken) =>
					baseToken.path.slice(-1)[0] ===
					// @ts-expect-error token.original.value can be a string, due to the typographyTokens export including deprecated tokens
					currentToken.original.value.fontWeight,
			)?.value,
			lineHeight: typographyPalette.find(
				(baseToken) =>
					baseToken.path.slice(-1)[0] ===
					// @ts-expect-error token.original.value can be a string, due to the typographyTokens export including deprecated tokens
					currentToken.original.value.lineHeight,
			)?.value,
		};

		return {
			tokenName: currentToken.cleanName,
			tokenValue: currentToken.value,
			values: individualValues,
		};
	});

export function findTypographyTokenForValues(
	fontSize: string,
	lineHeight?: string,
): TokenValueMap[] {
	// Match 11px to 12px as this is what happened when transitioning from legacy to refreshed typography
	if (fontSize === '11px') {
		fontSize = '12px';
	}

	let matchingTokens = typographyValueToToken
		.filter((token) => token.values.fontSize === fontSize)
		// If lineHeight == 1, we don't match to a token
		.filter(() => (lineHeight === '1' ? false : true));

	return matchingTokens;
}

export const fontWeightTokens: TokenValueMap[] = typographyTokens
	.filter((token) => token.attributes.group === 'fontWeight')
	.map((token) => {
		return {
			tokenName: token.cleanName,
			tokenValue: token.value,
			values: {
				fontWeight: token.value,
			},
		};
	});

export function findFontWeightTokenForValue(
	fontWeight: string,
	tokens: TokenValueMap[] = fontWeightTokens,
): TokenValueMap | undefined {
	if (fontWeight === 'normal') {
		fontWeight = '400';
	}

	// Match bold and 700 to 653 to match with bold weight refreshed typography
	if (fontWeight === 'bold' || fontWeight === '700') {
		fontWeight = '653';
	}

	return tokens.find((token) => token.values.fontWeight === fontWeight);
}

export const fontWeightMap: FontWeightMap = {
	regular: '400',
	medium: '500',
	semibold: '600',
	bold: '700',
} as const;

export type FontWeightMap = {
	regular: string;
	medium: string;
	semibold: string;
	bold: string;
};

export const defaultFontWeight: string = fontWeightMap.regular;

function getTokenNode(
	tokenName: string,
	fallbackValue?: string,
	isFallbackMember: boolean = false,
) {
	const callExpressionArgs: (Expression | SpreadElement)[] = [
		literal({
			value: `'${tokenName}'`,
		}),
	];

	if (fallbackValue) {
		const fallback = isFallbackMember
			? createMemberExpressionFromArray(fallbackValue.split('.'))
			: literal(fallbackValue);

		callExpressionArgs.push(fallback);
	}

	return callExpression({
		callee: identifier({ name: 'token' }),
		arguments: callExpressionArgs,
		optional: false,
	});
}

function createMemberExpressionFromArray(
	array: string[],
): StringableASTNode<MemberExpression | Identifier> {
	if (array.length === 1) {
		return identifier(array[0]);
	}
	const property = array.pop();

	return memberExpression({
		object: createMemberExpressionFromArray(array),
		property: identifier(property!),
	});
}

export function getTokenProperty(
	propertyName: string,
	tokenName: string,
	tokenFallback?: string,
	isFallbackMember: boolean = false,
): StringableASTNode<Property> {
	return property({
		key: identifier(propertyName),
		value: getTokenNode(tokenName, tokenFallback, isFallbackMember),
	});
}

export { isTypographyProperty } from './is-typography-property';
