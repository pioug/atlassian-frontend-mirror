/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import {
	isNodeOfType,
	type JSXElement,
	type JSXIdentifier,
	type JSXOpeningElement,
} from 'eslint-codemod-utils';

import * as ast from '../../../ast-nodes';

import { allowedAttrs, type MetaData, updateTestIdAttributeFix } from './common';

type ValidTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const tagSizeMap: Record<ValidTags, string> = {
	h1: 'xlarge',
	h2: 'large',
	h3: 'medium',
	h4: 'small',
	h5: 'xsmall',
	h6: 'xxsmall',
};

interface ValidHeadingElement extends JSXElement {
	parent: Rule.Node;
	openingElement: {
		name: JSXIdentifier & { name: ValidTags };
	} & JSXOpeningElement;
}

type CheckResult = { success: boolean; autoFixable?: boolean };

export const NativeElements = {
	lint(node: Rule.Node, { context, config }: MetaData) {
		// Check whether all criteria needed to make a transformation are met
		const { success, autoFixable } = NativeElements._check(node, { context, config });
		if (success && autoFixable) {
			const fix = NativeElements._fix(node as ValidHeadingElement, { context, config });
			context.report({
				node,
				messageId: 'preferHeading',
				...(config.enableUnsafeAutofix
					? { fix }
					: { suggest: [{ desc: `Convert to Heading`, fix }] }),
			});
		} else if (success && config.enableUnsafeReport) {
			context.report({ node, messageId: 'preferHeading' });
		}
	},

	_check(node: Rule.Node, { config }: MetaData): CheckResult {
		if (!config.patterns.includes('native-elements')) {
			return { success: false };
		}

		// @ts-ignore - Node type compatibility issue with EslintNode
		if (!isNodeOfType(node, 'JSXElement')) {
			return { success: false };
		}

		if (!node.children.length) {
			return { success: false };
		}

		// @ts-ignore - Node type compatibility issue with EslintNode
		const elementName = ast.JSXElement.getName(node);
		if (!Object.keys(tagSizeMap).includes(elementName)) {
			return { success: false };
		}

		if (!node.parent) {
			return { success: true, autoFixable: false };
		}

		// Element has to be first element of its siblings
		// @ts-ignore - Node type compatibility issue with EslintNode
		if (!(isNodeOfType(node.parent, 'JSXElement') || isNodeOfType(node.parent, 'JSXFragment'))) {
			return { success: true, autoFixable: false };
		}
		// @ts-ignore - Node type compatibility issue with EslintNode
		const siblings = ast.JSXElement.getChildren(node.parent);
		if (siblings.length > 1) {
			// Only report if element is first child element
			if (
				siblings[0].range?.[0] !== node.range?.[0] ||
				siblings[0].range?.[1] !== node.range?.[1]
			) {
				return { success: true, autoFixable: false };
			}
		}

		if (!ast.JSXElement.hasAllowedAttrsOnly(node, allowedAttrs)) {
			return { success: true, autoFixable: false };
		}

		return { success: true, autoFixable: true };
	},

	_fix(node: ValidHeadingElement, { context }: MetaData): Rule.ReportFixer {
		return (fixer) => {
			// change to default import
			const importFix = ast.Root.upsertDefaultImportDeclaration(
				{
					module: '@atlaskit/heading',
					localName: 'Heading',
				},
				context,
				fixer,
			);

			const elementName = ast.JSXElement.getName(node) as ValidTags;
			const elementNameFixes = ast.JSXElement.updateName(node, 'Heading', fixer);
			const size = tagSizeMap[elementName];
			const asAttributeFix = ast.JSXElement.addAttribute(node, 'size', size, fixer);
			const testAttributeFix = updateTestIdAttributeFix(node, fixer);

			return [importFix, ...elementNameFixes, asAttributeFix, testAttributeFix].filter(
				(fix): fix is Rule.Fix => Boolean(fix),
			); // Some of the transformers can return arrays with undefined, so filter them out
		};
	},
};
