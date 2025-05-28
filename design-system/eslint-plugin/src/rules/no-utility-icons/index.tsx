import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

import { createChecks } from './checks';

const rule = createLintRule({
	meta: {
		name: 'no-utility-icons',
		fixable: 'code',
		hasSuggestions: true,
		type: 'problem',
		schema: [
			{
				type: 'object',
				properties: {
					enableAutoFixer: {
						type: 'boolean',
					},
				},
				additionalProperties: false,
			},
		],
		docs: {
			description:
				'Disallow use of deprecated utility icons, in favor of core icons with `size="small"`.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noUtilityIconsJSXElement: `Utility icons are deprecated. Please use core icons instead with the size prop set to small.`,
			noUtilityIconsImport: `Utility icons are deprecated. Please do not import them, use core icons instead.`,
			noUtilityIconsReference: `Utility icons are deprecated. To replace them, please use core icons with the size prop set to small instead.`,
		},
	},
	create(context: Rule.RuleContext) {
		const { checkImportDeclarations, checkJSXElement, checkIconReference, throwErrors } =
			createChecks(context);

		return {
			ImportDeclaration: checkImportDeclarations,

			JSXElement: checkJSXElement,

			Identifier: checkIconReference,

			'Program:exit': throwErrors,
		};
	},
});

export default rule;
