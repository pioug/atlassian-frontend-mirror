/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType, type Property } from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import { Root } from '../../../ast-nodes';
import { getNodeSource } from '../../utils/get-node-source';
import { isDecendantOfStyleBlock, isDecendantOfType } from '../../utils/is-node';
import { type RuleConfig } from '../config';
import { findFontFamilyTokenForValue, insertTokensImport } from '../utils';

interface MetaData {
	context: Rule.RuleContext;
	config: RuleConfig;
}

export const FontFamily = {
	lint(node: Rule.Node, { context, config }: MetaData) {
		// Check whether all criteria needed to make a transformation are met
		const success = FontFamily._check(node, { context, config });
		if (success) {
			return context.report({
				node,
				messageId: 'noRawFontFamilyValues',
				fix: FontFamily._fix(node, context),
			});
		}
	},

	_check(
		node: Rule.Node,
		{ context, config }: MetaData,
	): node is Property & Rule.NodeParentExtension {
		if (!config.patterns.includes('font-family')) {
			return false;
		}

		if (!isNodeOfType(node, 'Property')) {
			return false;
		}

		if (!isDecendantOfStyleBlock(node) && !isDecendantOfType(node, 'JSXExpressionContainer')) {
			return false;
		}

		const isFontFamilyProperty =
			isNodeOfType(node.key, 'Identifier') && node.key.name === 'fontFamily';
		const valueNodeSource = getNodeSource(getSourceCode(context), node.value);
		if (isFontFamilyProperty && valueNodeSource.match(/(font\.family.|inherit)/)) {
			return false;
		}

		return true;
	},

	_fix(node: Property & Rule.NodeParentExtension, context: Rule.RuleContext) {
		return (fixer: Rule.RuleFixer) => {
			const fixes: Rule.Fix[] = [];

			// Type assertions to force the correct node type
			if (!isNodeOfType(node.value, 'Literal')) {
				return fixes;
			}
			if (!node.value.raw) {
				return fixes;
			}

			// Replace raw value with token if there is a token match
			const matchingToken = findFontFamilyTokenForValue(String(node.value.value));
			if (!matchingToken) {
				return fixes;
			}
			const fontWeightValueFix = fixer.replaceText(node.value, `token('${matchingToken}')`);
			fixes.push(fontWeightValueFix);

			// Add import if it doesn't exist
			const body = getSourceCode(context).ast.body;
			const tokensImportDeclarations = Root.findImportsByModule(body, '@atlaskit/tokens');

			// If there is more than one `@atlaskit/tokens` import, then it becomes difficult to determine which import to transform
			if (tokensImportDeclarations.length > 1) {
				return fixes;
			}

			const tokensImportDeclaration = tokensImportDeclarations[0];
			if (!tokensImportDeclaration) {
				fixes.push(insertTokensImport(body, fixer));
			}

			return fixes;
		};
	},
};
