/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType, type JSXElement } from 'eslint-codemod-utils';

import * as ast from '../../../ast-nodes';

import { type MetaData } from './common';

export const UnsafeSmallText = {
	lint(node: Rule.Node, { context, config }: MetaData): void {
		if (!isNodeOfType(node, 'JSXElement')) {
			return;
		}

		// Check whether all criteria needed to make a transformation are met
		const success = UnsafeSmallText._check(node, { context, config });

		if (success) {
			const fix = UnsafeSmallText._fix(node);
			context.report({
				node: node.openingElement,
				messageId: 'noUnsafeSmallText',
				fix,
			});
		}
	},

	_check(node: JSXElement, { config }: MetaData): boolean {
		if (!config.patterns.includes('unsafe-small-text')) {
			return false;
		}

		const elementName = ast.JSXElement.getName(node);
		if (elementName !== 'Text') {
			return false;
		}

		const sizeAttribute = ast.JSXElement.getAttributeByName(node, 'size');
		if (sizeAttribute?.value && isNodeOfType(sizeAttribute.value, 'Literal')) {
			return sizeAttribute.value.value === 'UNSAFE_small';
		}

		return false
	},

	_fix(node: JSXElement): Rule.ReportFixer {
		return (fixer) => {
			const sizeAttribute = ast.JSXElement.getAttributeByName(node, 'size');

			if (sizeAttribute?.value && isNodeOfType(sizeAttribute.value, 'Literal')) {
				const valueNode = sizeAttribute.value;
				const valueFix = fixer.replaceText(valueNode, `"small"`);
				return [valueFix];
			}

			return [
			]
		};
	},
};
