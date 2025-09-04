import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

import { physicalLogicalMap } from './logical-physical-map';

const rule = createLintRule({
	meta: {
		name: 'no-physical-properties',
		fixable: 'code',
		docs: {
			description: 'Disallow physical properties and values in `css` and `cssMap` function calls.',
			recommended: false,
			severity: 'error',
		},
		messages: {
			noPhysicalProperties:
				'Physical properties are not allowed in `css` and `cssMap` functions as they do not support different reading modes. Use a logical property instead.',
			noPhysicalValues: 'Physical values are not allowed in `css` and `cssMap` functions.',
		},
	},
	create(context) {
		return {
			// Handle css() calls
			'CallExpression[callee.name=css] > ObjectExpression Property,CallExpression[callee.name=xcss] > ObjectExpression Property':
				(node: Rule.Node) => {
					if (!isNodeOfType(node, 'Property')) {
						return;
					}

					if (!isNodeOfType(node.key, 'Identifier')) {
						return;
					}

					const { key } = node;

					if (key.name in physicalLogicalMap) {
						context.report({
							node: key,
							messageId: 'noPhysicalProperties',
							fix: (fixer) => {
								const logicalProperty =
									physicalLogicalMap[key.name as keyof typeof physicalLogicalMap];

								return fixer.replaceText(key, logicalProperty);
							},
						});
					}
				},
			// Handle cssMap() calls
			'CallExpression[callee.name=cssMap] > ObjectExpression Property > ObjectExpression Property':
				(node: Rule.Node) => {
					if (!isNodeOfType(node, 'Property')) {
						return;
					}

					if (!isNodeOfType(node.key, 'Identifier')) {
						return;
					}

					const { key } = node;

					if (key.name in physicalLogicalMap) {
						context.report({
							node: key,
							messageId: 'noPhysicalProperties',
							fix: (fixer) => {
								const logicalProperty =
									physicalLogicalMap[key.name as keyof typeof physicalLogicalMap];

								return fixer.replaceText(key, logicalProperty);
							},
						});
					}
				},
		};
	},
});

export default rule;
