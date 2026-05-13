/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType, type JSXElement } from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import { JSXElementHelper } from '../../../ast-nodes/jsx-element-helper';
import { Root } from '../../../ast-nodes/root';

import { addColorInheritAttributeFix } from './add-color-inherit-attribute-fix';
import { allowedAttrs } from './allowed-attrs';
import type { MetaData } from './common';
import { updateTestIdAttributeFix } from './update-test-id-attribute-fix';

type CheckResult = { success: boolean; autoFixable?: boolean };

export const EmphasisElements = {
	lint(node: Rule.Node, { context, config }: MetaData): void {
		if (!isNodeOfType(node, 'JSXElement')) {
			return;
		}

		// Check whether all criteria needed to make a transformation are met
		const { success, autoFixable } = EmphasisElements._check(node, { context, config });
		if (success && autoFixable) {
			const fix = EmphasisElements._fix(node, { context, config });
			context.report({
				node: node.openingElement,
				messageId: 'preferPrimitivesText',
				...(config.enableUnsafeAutofix ? { fix } : { suggest: [{ desc: `Convert to Text`, fix }] }),
			});
		} else if (success && config.enableUnsafeReport) {
			context.report({ node: node.openingElement, messageId: 'preferPrimitivesText' });
		}
	},

	_check(node: JSXElement, { context, config }: MetaData): CheckResult {
		if (!config.patterns.includes('emphasis-elements')) {
			return { success: false };
		}

		const elementName = JSXElementHelper.getName(node);
		if (elementName !== 'em') {
			return { success: false };
		}

		if (!node.children.length) {
			return { success: false };
		}

		// Element has no unallowed props
		if (!JSXElementHelper.hasAllowedAttrsOnly(node, allowedAttrs)) {
			return { success: true, autoFixable: false };
		}

		// If there is more than one `@atlaskit/primitives` import, then it becomes difficult to determine which import to transform
		const importDeclaration = Root.findImportsByModule(
			getSourceCode(context).ast.body,
			'@atlaskit/primitives',
		);
		if (importDeclaration.length > 1) {
			return { success: true, autoFixable: false };
		}

		return { success: true, autoFixable: true };
	},

	_fix(node: JSXElement, { context, config }: MetaData): Rule.ReportFixer {
		return (fixer) => {
			const importFix = Root.upsertNamedImportDeclaration(
				{
					module: '@atlaskit/primitives',
					specifiers: ['Text'],
				},
				context,
				fixer,
			);

			const elementNameFixes = JSXElementHelper.updateName(node, 'Text', fixer);

			const asAttributeFix = JSXElementHelper.addAttribute(node, 'as', 'em', fixer);
			const colorAttributeFix = addColorInheritAttributeFix(node, config, fixer);
			const testAttributeFix = updateTestIdAttributeFix(node, fixer);

			return [
				importFix,
				...elementNameFixes,
				asAttributeFix,
				colorAttributeFix,
				testAttributeFix,
			].filter((fix): fix is Rule.Fix => Boolean(fix)); // Some of the transformers can return arrays with undefined, so filter them out
		};
	},
};
