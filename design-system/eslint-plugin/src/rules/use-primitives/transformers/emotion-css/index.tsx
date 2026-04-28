/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import {
	getIdentifierInParentScope,
	isNodeOfType,
	type JSXAttribute,
	type JSXElement,
} from 'eslint-codemod-utils';

import { getScope, getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import { FunctionCall } from '../../../../ast-nodes/function-call';
import { JSXAttribute as JSXAttributeHelper } from '../../../../ast-nodes/jsx-attribute';
import { JSXElement as JSXElementHelper } from '../../../../ast-nodes/jsx-element';
import { Root } from '../../../../ast-nodes/root';
import type { RuleConfig } from '../../config';
import { getVariableDefinitionValue } from '../../utils/get-variable-definition-value';
import { getVariableUsagesCount } from '../../utils/get-variable-usage-count';
import { isValidCssPropertiesToTransform } from '../../utils/is-valid-css-properties-to-transform';
import { validateStyles } from '../../utils/validate-styles';
import { cssToXcssTransformer } from '../css-to-xcss';

import { attributes } from './attributes';
import { elements } from './elements';

interface MetaData {
	context: Rule.RuleContext;
	config: RuleConfig;
}

export const EmotionCSS = {
	lint(node: Rule.Node, { context, config }: MetaData): void {
		if (!isNodeOfType(node, 'JSXElement')) {
			return;
		}

		// Check whether all criteria needed to make a transformation are met
		if (!EmotionCSS._check(node, { context, config })) {
			return;
		}

		context.report({
			node: node.openingElement,
			messageId: 'preferPrimitivesBox',
			suggest: [
				{
					desc: `Convert to Box`,
					fix: EmotionCSS._fix(node, { context }),
				},
			],
		});
	},

	_check(node: Rule.Node, { context, config }: MetaData): boolean {
		if (!config.patterns.includes('compiled-css-function')) {
			return false;
		}

		if (!isNodeOfType(node, 'JSXElement')) {
			return false;
		}

		const elementName = JSXElementHelper.getName(node);
		if (!elementName) {
			return false;
		}

		// Currently we only support `div`. This may change in future.
		if (!elements.includes(elementName)) {
			return false;
		}

		// Ignore elements that contain dangerous attributes like `id`.
		if (!JSXElementHelper.hasAllowedAttrsOnly(node, attributes)) {
			return false;
		}

		// Currently we don't transform anything to `Box` unless it defines styles
		const cssAttr = JSXElementHelper.getAttributeByName(node, 'css');
		if (!cssAttr) {
			return false;
		}

		// Get `myStyles` in `css={myStyles}` as a string so we can search for the `const myStyles` VariableDefinition
		const cssAttrValue = JSXAttributeHelper.getValue(cssAttr);

		if (cssAttrValue?.type !== 'ExpressionStatement') {
			return false;
		}

		// TODO: Everything below this line could be refactored to use `ast-nodes`.

		// Bail if the styles are used on multiple JSXElements
		if (getVariableUsagesCount(cssAttrValue.value, context) !== 1) {
			return false;
		}

		// Find where `myStyles` is defined. We're looking for `const myStyles = css({...})`
		const cssVariableDefinition = getIdentifierInParentScope(
			getScope(context, node),
			cssAttrValue.value,
		);

		const cssVariableValue = getVariableDefinitionValue(cssVariableDefinition);
		// Check if `cssVariableValue` is a function called `css()`
		if (FunctionCall.getName(cssVariableValue?.node.init) !== 'css') {
			return false;
		}

		if (
			!(config.patterns.includes('string-style-property-fix')
				? validateStyles(cssVariableValue?.node.init, config)
				: isValidCssPropertiesToTransform(cssVariableValue?.node.init, config))
		) {
			return false;
		}

		const importDeclaration = Root.findImportsByModule(
			getSourceCode(context).ast.body,
			'@atlaskit/primitives',
		);

		// If there is more than one `@atlaskit/primitives` import, then it becomes difficult to determine which import to transform
		if (importDeclaration.length > 1) {
			return false;
		}

		return true;
	},

	_fix(node: JSXElement, { context }: { context: Rule.RuleContext }): Rule.ReportFixer {
		return (fixer) => {
			const importFix = Root.upsertNamedImportDeclaration(
				{
					module: '@atlaskit/primitives',
					specifiers: ['Box', 'xcss'],
				},
				context,
				fixer,
			);

			const cssAttr = JSXElementHelper.getAttributeByName(node, 'css') as JSXAttribute; // Can strongly assert the type here, because we validated it exists in `check()`.
			const attributeFix = JSXAttributeHelper.updateName(cssAttr, 'xcss', fixer);
			const elementNameFixes = JSXElementHelper.updateName(node, 'Box', fixer);
			const cssToXcssTransform = cssToXcssTransformer(node, context, fixer);

			return [importFix, attributeFix, ...elementNameFixes, ...cssToXcssTransform].filter(
				(fix): fix is Rule.Fix => Boolean(fix),
			); // Some of the transformers can return arrays with undefined, so filter them out
		};
	},
};
