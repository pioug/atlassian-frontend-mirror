import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-lint-rule';
import { createModuleImportListener } from '../utils/create-module-import-listener';
import { isModuleFromPackage } from '../utils/is-module-from-package';
import { layeringLibraries } from './libraries';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-third-party-layering',
		type: 'problem',
		docs: {
			description:
				'Disallow third-party layering libraries, such as Popper.js and Floating UI. Use a Design System layering component or `@atlaskit/top-layer`.',
			recommended: false,
			severity: 'error',
		},
		messages: {
			noThirdPartyLayering:
				'Do not use `{{specifier}}`. Layers built with it are not in the Design System layer stack: top layer surfaces paint above them, and one press of Escape can close more than one layer. Use a Design System layering component, or `@atlaskit/top-layer` if no component fits.',
		},
	},

	create(context) {
		return createModuleImportListener({
			onModuleImport({ node, specifier }) {
				const isLayeringLibrary = layeringLibraries.some((packageName) =>
					isModuleFromPackage({ specifier, packageName }),
				);
				if (!isLayeringLibrary) {
					return;
				}
				context.report({
					node,
					messageId: 'noThirdPartyLayering',
					data: { specifier },
				});
			},
		});
	},
});

export default rule;
