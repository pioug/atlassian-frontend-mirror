/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType, type JSXElement } from 'eslint-codemod-utils';

import * as ast from '../../../ast-nodes';

import {
	addColorInheritAttributeFix,
	allowedAttrs,
	type MetaData,
	updateTestIdAttributeFix,
} from './common';

export const EmphasisElements = {
	lint(node: Rule.Node, { context, config }: MetaData) {
		if (!isNodeOfType(node, 'JSXElement')) {
			return;
		}

		// Check whether all criteria needed to make a transformation are met
		if (!EmphasisElements._check(node, { context, config })) {
			return;
		}

		const fix = EmphasisElements._fix(node, { context, config });
		context.report({
			node: node.openingElement,
			messageId: 'preferPrimitivesText',
			...(config.enableUnsafeAutofix ? { fix } : { suggest: [{ desc: `Convert to Text`, fix }] }),
		});
	},

	_check(node: JSXElement, { context, config }: MetaData): boolean {
		if (!config.patterns.includes('emphasis-elements')) {
			return false;
		}

		const elementName = ast.JSXElement.getName(node);
		if (elementName !== 'em') {
			return false;
		}

		if (!node.children.length) {
			return false;
		}

		// Element has no unallowed props
		if (!ast.JSXElement.hasAllowedAttrsOnly(node, allowedAttrs)) {
			return false;
		}

		// If there is more than one `@atlaskit/primitives` import, then it becomes difficult to determine which import to transform
		const importDeclaration = ast.Root.findImportsByModule(
			context.getSourceCode().ast.body,
			'@atlaskit/primitives',
		);
		if (importDeclaration.length > 1) {
			return false;
		}

		return true;
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

			const asAttributeFix = ast.JSXElement.addAttribute(node, 'as', 'em', fixer);
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
