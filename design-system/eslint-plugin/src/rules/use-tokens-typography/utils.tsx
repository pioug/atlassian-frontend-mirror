import type { Rule } from 'eslint';
import {
	type CallExpression,
	callExpression,
	type Directive,
	type EslintNode,
	type Expression,
	type Identifier,
	identifier,
	type ImportDeclaration,
	isNodeOfType,
	literal,
	type MemberExpression,
	memberExpression,
	type ModuleDeclaration,
	type Property,
	property,
	type SpreadElement,
	type Statement,
	type StringableASTNode,
} from 'eslint-codemod-utils';

import { typographyPalette } from '@atlaskit/tokens/palettes-raw';
import { typographyAdg3 as typographyTokens } from '@atlaskit/tokens/tokens-raw';

import { Import, Root } from '../../ast-nodes';

export const typographyProperties = ['fontSize', 'fontWeight', 'fontFamily', 'lineHeight'];

export const isTypographyProperty = (propertyName: string) => {
	return typographyProperties.includes(propertyName);
};

export const isFontSize = (node: EslintNode): node is CallExpression =>
	isNodeOfType(node, 'CallExpression') &&
	isNodeOfType(node.callee, 'Identifier') &&
	(node.callee.name === 'fontSize' || node.callee.name === 'getFontSize');

export const isFontSizeSmall = (node: EslintNode): node is CallExpression =>
	isNodeOfType(node, 'CallExpression') &&
	isNodeOfType(node.callee, 'Identifier') &&
	node.callee.name === 'fontSizeSmall';

export const isFontFamily = (node: EslintNode): node is CallExpression =>
	isNodeOfType(node, 'CallExpression') &&
	isNodeOfType(node.callee, 'Identifier') &&
	(node.callee.name === 'fontFamily' || node.callee.name === 'getFontFamily');

export const isCodeFontFamily = (node: EslintNode): node is CallExpression =>
	isNodeOfType(node, 'CallExpression') &&
	isNodeOfType(node.callee, 'Identifier') &&
	(node.callee.name === 'codeFontFamily' || node.callee.name === 'getCodeFontFamily');

export type TokenValueMap = {
	tokenName: string;
	tokenValue: string;
	values: {
		fontSize?: string;
		fontWeight?: string;
		lineHeight?: string;
	};
};

export const typographyValueToToken = typographyTokens
	// we're filtering here to remove the `font` tokens.
	.filter((t) => t.attributes.group === 'typography')
	.filter((t) => t.cleanName.includes('font.heading') || t.cleanName.includes('font.body'))
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

export function isValidTypographyToken(tokenName: string) {
	return typographyTokens
		.filter((t) => t.attributes.group === 'typography')
		.filter(
			(t) =>
				t.cleanName.includes('font.heading') ||
				t.cleanName.includes('font.body') ||
				t.cleanName.includes('font.code'),
		)
		.find((t) => t.cleanName === tokenName);
}

export function findTypographyTokenForValues(fontSize: string, lineHeight?: string) {
	let matchingTokens = typographyValueToToken
		.filter((token) => token.values.fontSize === fontSize)
		// If lineHeight == 1, we don't match to a token
		.filter(() => (lineHeight === '1' ? false : true));

	return matchingTokens;
}

export const fontWeightTokens = typographyTokens
	.filter((token) => token.attributes.group === 'fontWeight')
	.map((token) => {
		return {
			tokenName: token.cleanName,
			tokenValue: token.value,
			values: {},
		};
	});

export function findFontWeightTokenForValue(fontWeight: string) {
	if (fontWeight === 'normal') {
		fontWeight = '400';
	}

	if (fontWeight === 'bold') {
		fontWeight = '700';
	}

	return fontWeightTokens.find((token) => token.tokenValue === fontWeight);
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

export const defaultFontWeight = fontWeightMap.regular;

export const fontFamilyTokens = typographyTokens.filter(
	(token) => token.attributes.group === 'fontFamily',
);

export function findFontFamilyValueForToken(tokenName: string) {
	// Note this will only ever be undefined if the tokens get renamed, and should never happen.
	return fontFamilyTokens.find((token) => token.cleanName === tokenName)?.value || '';
}

export function findFontFamilyTokenForValue(value: string) {
	if (/charlie[\s-]?display/i.test(value)) {
		return 'font.family.brand.heading';
	} else if (/charlie[\s-]?text/i.test(value)) {
		return 'font.family.brand.body';
	} else if (/sans[\s-]?serif/i.test(value)) {
		return 'font.family.body';
	} else if (/monospace/i.test(value)) {
		return 'font.family.code';
	}
}

export function notUndefined<V>(value: V | undefined): value is V {
	return value !== undefined;
}

export function isValidPropertyNode(node: Property) {
	if (!isNodeOfType(node.key, 'Identifier') && !isNodeOfType(node.key, 'Literal')) {
		return false;
	}

	return true;
}

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
) {
	return property({
		key: identifier(propertyName),
		value: getTokenNode(tokenName, tokenFallback, isFallbackMember),
	});
}

export function getLiteralProperty(propertyName: string, propertyValue: string) {
	return property({
		key: identifier(propertyName),
		value: literal(propertyValue),
	});
}

export function convertPropertyNodeToStringableNode(node: Property) {
	return property({
		key: node.key,
		value: node.value,
	});
}

export function insertTokensImport(
	root: (Directive | Statement | ModuleDeclaration)[],
	fixer: Rule.RuleFixer,
) {
	return Root.insertImport(
		root,
		{
			module: '@atlaskit/tokens',
			specifiers: ['token'],
		},
		fixer,
	);
}

export function insertFallbackImportFull(
	root: (Directive | Statement | ModuleDeclaration)[],
	fixer: Rule.RuleFixer,
) {
	return Root.insertImport(
		root,
		{
			module: '@atlaskit/theme/typography',
			specifiers: ['fontFallback'],
		},
		fixer,
	);
}

export function insertFallbackImportSpecifier(
	fixer: Rule.RuleFixer,
	themeImportNode: ImportDeclaration,
) {
	return Import.insertNamedSpecifiers(themeImportNode, ['fontFallback'], fixer);
}
