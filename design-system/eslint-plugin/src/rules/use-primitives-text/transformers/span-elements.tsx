/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType, type JSXElement } from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import * as ast from '../../../ast-nodes';

import {
	addColorInheritAttributeFix,
	allowedAttrs,
	hasTextChildrenOnly,
	type MetaData,
	updateTestIdAttributeFix,
} from './common';

type CheckResult = { success: boolean; autoFixable?: boolean };

export const SpanElements = {
	lint(node: Rule.Node, { context, config }: MetaData): void {
		if (!isNodeOfType(node, 'JSXElement')) {
			return;
		}

		// Check whether all criteria needed to make a transformation are met
		const { success, autoFixable } = SpanElements._check(node, { context, config });
		if (success && autoFixable) {
			const fix = SpanElements._fix(node, { context, config });
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
		if (!config.patterns.includes('span-elements')) {
			return { success: false };
		}

		const elementName = ast.JSXElement.getName(node);
		if (elementName !== 'span') {
			return { success: false };
		}

		if (!node.children.length) {
			return { success: false };
		}

		// Only allow elements with strings as children
		if (!hasTextChildrenOnly(node)) {
			return { success: false };
		}

		// Element has no unallowed props
		if (!ast.JSXElement.hasAllowedAttrsOnly(node, allowedAttrs)) {
			return { success: true, autoFixable: false };
		}

		// If there is more than one `@atlaskit/primitives` import, then it becomes difficult to determine which import to transform
		const importDeclaration = ast.Root.findImportsByModule(
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
			const importFix = ast.Root.upsertNamedImportDeclaration(
				{
					module: '@atlaskit/primitives',
					specifiers: ['Text'],
				},
				context,
				fixer,
			);

			const elementNameFixes = ast.JSXElement.updateName(node, 'Text', fixer);
			const colorAttributeFix = addColorInheritAttributeFix(node, config, fixer);
			const testAttributeFix = updateTestIdAttributeFix(node, fixer);

			return [importFix, ...elementNameFixes, colorAttributeFix, testAttributeFix].filter(
				(fix): fix is Rule.Fix => Boolean(fix),
			); // Some of the transformers can return arrays with undefined, so filter them out
		};
	},
};
