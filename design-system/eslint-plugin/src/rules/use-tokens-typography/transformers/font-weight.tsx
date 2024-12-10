/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { Identifier, isNodeOfType } from 'eslint-codemod-utils';

import { Root } from '../../../ast-nodes';
import { getValueForPropertyNode } from '../../ensure-design-token-usage/utils';
import { isDecendantOfStyleBlock, isDecendantOfType } from '../../utils/is-node';
import { type RuleConfig } from '../config';
import { findFontWeightTokenForValue, insertTokensImport } from '../utils';

interface MetaData {
	context: Rule.RuleContext;
	config: RuleConfig;
}

export const FontWeight = {
	lint(node: Rule.Node, { context, config }: MetaData) {
		// To force the correct node type
		if (!isNodeOfType(node, 'Identifier')) {
			return;
		}

		// Check whether all criteria needed to make a transformation are met
		const success = FontWeight._check(node, { context, config });
		if (success) {
			return context.report({
				node,
				messageId: 'noRawFontWeightValues',
				fix: FontWeight._fix(node, context),
			});
		}
	},

	_check(node: Identifier & Rule.NodeParentExtension, { context, config }: MetaData) {
		if (!config.patterns.includes('font-weight')) {
			return false;
		}

		if (!isDecendantOfStyleBlock(node) && !isDecendantOfType(node, 'JSXExpressionContainer')) {
			return false;
		}

		if (!isNodeOfType(node.parent, 'Property')) {
			return false;
		}

		const fontWeightValue = getValueForPropertyNode(node.parent, context);
		if (typeof fontWeightValue === 'string' && fontWeightValue.includes('font.weight.')) {
			return false;
		}

		return true;
	},

	_fix(node: Identifier & Rule.NodeParentExtension, context: Rule.RuleContext) {
		return (fixer: Rule.RuleFixer) => {
			const fixes: Rule.Fix[] = [];

			// -- Type assertions to force the correct node type --

			if (!isNodeOfType(node.parent, 'Property')) {
				return [];
			}

			if (!isNodeOfType(node.parent.value, 'Literal')) {
				return [];
			}

			if (!node.parent.value.raw) {
				return [];
			}

			// -- Fix: Replace raw value with token --

			const matchingToken = findFontWeightTokenForValue(node.parent.value.raw)?.tokenName;

			if (!matchingToken) {
				return [];
			}

			const fontWeightValueFix = fixer.replaceText(node.parent.value, `token('${matchingToken}')`);
			fixes.push(fontWeightValueFix);

			// -- Fix: Add import if it doesn't exist --

			const body = context.sourceCode.ast.body;
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
