import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { createModuleImportListener } from '../utils/create-module-import-listener';
import { isModuleFromPackage } from '../utils/is-module-from-package';
import { focusTrapLibraries } from './libraries';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-third-party-focus-traps',
		type: 'problem',
		docs: {
			description:
				'Disallow third-party focus trap libraries, such as `react-focus-lock` and `focus-trap`. Design System layering components manage focus.',
			recommended: false,
			severity: 'error',
		},
		messages: {
			noThirdPartyFocusTraps:
				'Do not use `{{specifier}}`. Its focus trap does not know about layers in the top layer, so it can pull focus out of a Design System layer that opens outside the trap. Design System layering components manage focus for you. Use one, or `@atlaskit/top-layer` if no component fits.',
		},
	},

	create(context) {
		return createModuleImportListener({
			onModuleImport({ node, specifier }) {
				const isFocusTrapLibrary = focusTrapLibraries.some((packageName) =>
					isModuleFromPackage({ specifier, packageName }),
				);
				if (!isFocusTrapLibrary) {
					return;
				}
				context.report({
					node,
					messageId: 'noThirdPartyFocusTraps',
					data: { specifier },
				});
			},
		});
	},
});

export default rule;
