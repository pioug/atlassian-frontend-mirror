/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import {
	type ImportDeclaration,
	type ImportSpecifier,
	isNodeOfType,
	type ObjectExpression,
	type Property,
	type StringableASTNode,
} from 'eslint-codemod-utils';

import { Object as ASTObject, ObjectEntry, Root } from '../../../ast-nodes';
import { getValueForPropertyNode, normaliseValue } from '../../ensure-design-token-usage/utils';
import { getSourceCode } from '../../utils/context-compat';
import {
	isDecendantOfGlobalToken,
	isDecendantOfStyleBlock,
	isDecendantOfType,
} from '../../utils/is-node';
import { type RuleConfig } from '../config';
import {
	convertPropertyNodeToStringableNode,
	defaultFontWeight,
	findFontFamilyValueForToken,
	findFontWeightTokenForValue,
	findTypographyTokenForValues,
	type FontWeightMap,
	fontWeightMap,
	getLiteralProperty,
	getTokenProperty,
	insertFallbackImportFull,
	insertFallbackImportSpecifier,
	insertTokensImport,
	isValidPropertyNode,
	isValidTypographyToken,
	notUndefined,
	type TokenValueMap,
} from '../utils';

interface MetaData {
	context: Rule.RuleContext;
	config: RuleConfig;
}

interface Refs {
	fontSizeNode: Property;
	fontSizeRaw: string | number;
	tokensImportNode: ImportDeclaration | undefined;
	themeImportNode: ImportDeclaration | undefined;
	shouldAddFallback: boolean;
	shouldAddFallbackImport: 'full' | 'specifier' | false;
}

type Check = {
	success: boolean;
	refs?: Refs;
};

interface FixerRefs {
	matchingToken: TokenValueMap;
	nodesToReplace: Property[];
	tokensImportNode: ImportDeclaration | undefined;
	themeImportNode: ImportDeclaration | undefined;
	shouldAddFallback: boolean;
	shouldAddFallbackImport: Refs['shouldAddFallbackImport'];
	fontWeightReplacement: StringableASTNode<Property> | undefined;
	fontFamilyReplacement: StringableASTNode<Property> | undefined;
	fontStyleReplacement: StringableASTNode<Property> | undefined;
}

export const StyleObject = {
	lint(node: Rule.Node, { context, config }: MetaData) {
		// To force the correct node type
		if (!isNodeOfType(node, 'ObjectExpression')) {
			return { success: false };
		}

		// Check whether all criteria needed to make a transformation are met
		const { success, refs } = StyleObject._check(node, { context, config });
		if (!success || !refs) {
			return;
		}
		const {
			fontSizeNode,
			fontSizeRaw,
			tokensImportNode,
			themeImportNode,
			shouldAddFallback,
			shouldAddFallbackImport,
		} = refs;

		const fontSizeValue = normaliseValue('fontSize', fontSizeRaw);

		// -- Font weight --
		const fontWeightNode = ASTObject.getEntryByPropertyName(node, 'fontWeight');
		let fontWeightRaw = fontWeightNode && getValueForPropertyNode(fontWeightNode, context);

		// If fontWeightRaw is a token we find the token name and treat it like a raw value for simplicity.
		// e.g. token('font.weight.bold', '700') ends up as '700' after this if-block.
		// That way the token matching logic still runs and the font weight declaration can be removed and re-added after the main font token.
		if (
			fontWeightRaw &&
			typeof fontWeightRaw === 'string' &&
			fontWeightRaw.includes('font.weight.')
		) {
			const fontWeightTokenSuffix = fontWeightRaw.match(/font\.weight\.(\w*)/)?.[1] || 'regular'; // ${token('font.weight.bold', '700')} -> 'bold'
			if (Object.keys(fontWeightMap).includes(fontWeightTokenSuffix)) {
				fontWeightRaw = fontWeightMap[fontWeightTokenSuffix as keyof FontWeightMap];
			}
		}

		// If no fontWeight value exists, default to 400 to avoid matching with a bolder token resulting in a visual change
		let fontWeightValue: string =
			(fontWeightRaw && normaliseValue('fontWeight', fontWeightRaw)) || defaultFontWeight;
		fontWeightValue =
			fontWeightValue.length === 3
				? fontWeightValue
				: fontWeightMap[fontWeightValue as keyof FontWeightMap] || defaultFontWeight;

		// -- Line height --
		const lineHeightNode = ASTObject.getEntryByPropertyName(node, 'lineHeight');
		const lineHeightRaw = lineHeightNode && getValueForPropertyNode(lineHeightNode, context);

		let shouldAddFontWeight = false;
		let lineHeightValue =
			(lineHeightRaw && normaliseValue('lineHeight', lineHeightRaw)) || undefined;
		if (lineHeightValue === fontSizeValue) {
			lineHeightValue = '1';
		}

		// -- Match tokens --
		// Check if fontSize is a token (this is invalid syntax but unfortunately a common occurence)
		// We may as well auto-fix `fontSize` to `font` and keep the token.
		// Other tokens like `fontSize: token('space.100')` will not autofix, but still report
		let matchingTokens: TokenValueMap[] = [];

		const isFontSizeAToken = isDecendantOfGlobalToken(fontSizeNode.value);
		if (isFontSizeAToken) {
			// Specifically match for valid, non-deprecated font.heading|body|code tokens
			const match = fontSizeValue.match(/font.(body|heading|code)[^']*/);
			if (match) {
				const matchedTokenName = match[0];
				// This is really just a double check to be 100% certain the token exists
				// and that we're not trying to apply a deprecated fontSize token to the font property
				if (isValidTypographyToken(matchedTokenName)) {
					matchingTokens = [
						{
							tokenName: matchedTokenName,
						} as TokenValueMap,
					];
				}
			}
		} else {
			// Standard matching against fontSize/lineHeight values
			matchingTokens = findTypographyTokenForValues(fontSizeValue, lineHeightValue);

			if (matchingTokens.length) {
				// If we have multiple matching tokens, try matching fontWeight
				let matchingTokensWithWeight = matchingTokens.filter((token) =>
					fontWeightValue ? token.values.fontWeight === fontWeightValue : token,
				);

				if (matchingTokensWithWeight.length) {
					// Possibly narrowed down tokens
					matchingTokens = matchingTokensWithWeight;
				} else {
					// Ended up with 0 matches by matching fontWeight
					// return body token and add fontWeight manually
					matchingTokens = matchingTokens.filter((token) => token.tokenName.includes('.body'));
					shouldAddFontWeight = true;
				}
			}
		}

		// Get other font-* nodes that we can replace/remove.
		// These aren't needed for token matching.

		// -- Font family --
		const fontFamilyNode = ASTObject.getEntryByPropertyName(node, 'fontFamily');
		const fontFamilyRaw = fontFamilyNode && getValueForPropertyNode(fontFamilyNode, context);
		let fontFamilyValue =
			(fontFamilyRaw && normaliseValue('fontFamily', fontFamilyRaw)) || undefined;

		// If font family is already a token, we remove and re-add it
		// Only need to do this for non-default font stacks as the defaults can be safely removed
		if (
			fontFamilyValue &&
			fontFamilyValue.includes('font.family.') &&
			!(
				fontFamilyValue.includes('font.family.heading') ||
				fontFamilyValue.includes('font.family.body')
			)
		) {
			fontFamilyValue = undefined;
		}

		let fontFamilyToAdd: 'heading' | 'body' | 'original' | undefined;
		// If font family uses the Charlie font we can't replace; exit
		if (fontFamilyValue) {
			if (fontFamilyValue.toLowerCase().includes('charlie display')) {
				fontFamilyToAdd = 'heading';
			} else if (fontFamilyValue.toLowerCase().includes('charlie text')) {
				fontFamilyToAdd = 'body';
			}
		} else {
			// Font family node exists but we can't resolve its value
			// Will need to re-add it below the font property to ensure it still applies
			fontFamilyToAdd = fontFamilyNode ? 'original' : undefined;
		}

		// -- Font style --
		const fontStyleNode = ASTObject.getEntryByPropertyName(node, 'fontStyle');
		const fontStyleRaw = fontStyleNode && getValueForPropertyNode(fontStyleNode, context);
		const fontStyleValue = (fontStyleRaw && normaliseValue('fontStyle', fontStyleRaw)) || undefined;

		let fontStyleToAdd: 'italic' | undefined;
		if (fontStyleValue === 'italic') {
			fontStyleToAdd = 'italic';
		}

		// -- Letter spacing --
		const letterSpacingNode = ASTObject.getEntryByPropertyName(node, 'letterSpacing');

		// A single matching token
		// TOOD: Maybe suggest options if > 1 matching token
		if (matchingTokens.length === 1) {
			const matchingToken = matchingTokens[0];

			// fontSize node is always first
			const nodesToReplace = [
				fontSizeNode,
				fontWeightNode,
				lineHeightNode,
				fontFamilyNode,
				fontStyleNode,
				letterSpacingNode,
			].filter(notUndefined);

			const fontFamilyTokenName = fontFamilyToAdd ? `font.family.brand.${fontFamilyToAdd}` : '';

			const fontWeightReplacementToken = shouldAddFontWeight
				? findFontWeightTokenForValue(fontWeightValue)
				: undefined;
			const fontWeightReplacement =
				fontWeightReplacementToken &&
				getTokenProperty(
					'fontWeight',
					fontWeightReplacementToken.tokenName,
					shouldAddFallback ? fontWeightValue : undefined,
				);

			const fontFamilyReplacement =
				fontFamilyToAdd &&
				(fontFamilyToAdd === 'original'
					? convertPropertyNodeToStringableNode(
							// This will always exist if fontFamilyToAdd === 'original', TS can't figure that out.
							fontFamilyNode!,
						)
					: getTokenProperty(
							'fontFamily',
							fontFamilyTokenName,
							shouldAddFallback ? findFontFamilyValueForToken(fontFamilyTokenName) : undefined,
						));

			const fontStyleReplacement =
				fontStyleToAdd && getLiteralProperty('fontStyle', fontStyleToAdd);

			const fixerRefs = {
				matchingToken,
				nodesToReplace,
				tokensImportNode,
				themeImportNode,
				shouldAddFallback,
				shouldAddFallbackImport,
				fontWeightReplacement,
				fontFamilyReplacement,
				fontStyleReplacement,
			};

			const fix = StyleObject._fix(fixerRefs, context);
			context.report({
				node: fontSizeNode,
				messageId: 'noRawTypographyValues',
				data: {
					payload: `fontSize:${fontSizeRaw}`,
				},
				...(config.enableUnsafeAutofix
					? { fix }
					: { suggest: [{ desc: `Convert to font token`, fix }] }),
			});
		} else if (!matchingTokens.length) {
			context.report({
				node: fontSizeNode,
				messageId: 'noRawTypographyValues',
				data: {
					payload: `fontSize:${fontSizeRaw}`,
				},
			});
		}

		return;
	},

	_check(node: ObjectExpression & Rule.NodeParentExtension, { context, config }: MetaData): Check {
		if (!config.patterns.includes('style-object')) {
			return { success: false };
		}

		if (!isDecendantOfStyleBlock(node) && !isDecendantOfType(node, 'JSXExpressionContainer')) {
			return { success: false };
		}

		// -- Font size --
		const fontSizeNode = ASTObject.getEntryByPropertyName(node, 'fontSize');
		if (!fontSizeNode || !isValidPropertyNode(fontSizeNode)) {
			return { success: false };
		}
		const fontSizeRaw = getValueForPropertyNode(fontSizeNode, context);

		// Without a valid fontSize value we can't be certain what token should be used; exit
		if (fontSizeRaw === undefined || fontSizeRaw === null) {
			return { success: false };
		}

		const tokensImportDeclaration = Root.findImportsByModule(
			getSourceCode(context).ast.body,
			'@atlaskit/tokens',
		);

		// If there is more than one `@atlaskit/tokens` import, then it becomes difficult to determine which import to transform
		if (tokensImportDeclaration.length > 1) {
			return { success: false };
		}

		const shouldAddFallback = Boolean(config.shouldEnforceFallbacks);
		// This exists purely because we're not inlining the fallback values
		// and instead referencing a `fontFallback` object that exists in @atlaskit/theme/typography.
		// This is a temporary measure until fallbacks are no longer required
		let shouldAddFallbackImport: Refs['shouldAddFallbackImport'] = shouldAddFallback && 'full';

		const themeImportDeclaration = Root.findImportsByModule(
			getSourceCode(context).ast.body,
			'@atlaskit/theme/typography',
		);

		if (themeImportDeclaration.length && shouldAddFallback) {
			// Import exists, check if specifier exists
			shouldAddFallbackImport = 'specifier';

			const fallbackImport = themeImportDeclaration[0].specifiers.find((specifier) => {
				// @atlaskit/theme/typography has no default export so we can safely narrow this type
				if (!isNodeOfType(specifier, 'ImportSpecifier')) {
					return false;
				}
				if (specifier.imported.name === 'fontFallback') {
					return true;
				}
				return false;
			}) as ImportSpecifier;

			// Exact import already exists, no need to add
			if (fallbackImport) {
				shouldAddFallbackImport = false;
			}
		}

		return {
			success: true,
			refs: {
				fontSizeNode,
				fontSizeRaw,
				tokensImportNode: tokensImportDeclaration[0],
				themeImportNode: themeImportDeclaration[0],
				shouldAddFallback,
				shouldAddFallbackImport,
			},
		};
	},

	_fix(refs: FixerRefs, context: Rule.RuleContext) {
		return (fixer: Rule.RuleFixer) => {
			const {
				matchingToken,
				nodesToReplace,
				tokensImportNode,
				themeImportNode,
				shouldAddFallback,
				shouldAddFallbackImport,
				fontWeightReplacement,
				fontFamilyReplacement,
				fontStyleReplacement,
			} = refs;
			const fontSizeNode = nodesToReplace[0];

			const root = getSourceCode(context).ast.body;

			let fallbackImport;
			if (shouldAddFallbackImport === 'full') {
				fallbackImport = insertFallbackImportFull(root, fixer);
			} else if (shouldAddFallbackImport === 'specifier') {
				fallbackImport = insertFallbackImportSpecifier(fixer, themeImportNode!);
			}

			const fallbackName = (
				matchingToken.tokenName === 'font.body' ? 'font.body.medium' : matchingToken.tokenName
			).replace('font', 'fontFallback');

			return (!tokensImportNode ? [insertTokensImport(root, fixer)] : []).concat(
				fallbackImport ? [fallbackImport] : [],
				nodesToReplace.map((node, index) => {
					// Replace first node with token, delete remaining nodes. Guaranteed to be fontSize
					if (index === 0) {
						return fixer.replaceText(
							node,
							`${getTokenProperty(
								'font',
								matchingToken.tokenName,
								shouldAddFallback ? fallbackName : undefined,
								true,
							)}`,
						);
					}

					// We don't replace fontWeight/fontFamily/fontStyle here in case it occurs before the font property.
					// Instead delete the original property and add below
					return ObjectEntry.deleteEntry(node, context, fixer);
				}),
				// Make sure font weight/family/style properties are added AFTER font property to ensure they override corectly
				fontWeightReplacement
					? [fixer.insertTextAfter(fontSizeNode, `,\n${fontWeightReplacement}`)]
					: [],
				fontFamilyReplacement
					? [fixer.insertTextAfter(fontSizeNode, `,\n${fontFamilyReplacement}`)]
					: [],
				fontStyleReplacement
					? [fixer.insertTextAfter(fontSizeNode, `,\n${fontStyleReplacement}`)]
					: [],
			);
		};
	},
};
