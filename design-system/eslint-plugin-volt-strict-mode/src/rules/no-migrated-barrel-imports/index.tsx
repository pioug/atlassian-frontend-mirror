import type { Rule } from 'eslint';

import { BarrelExport } from '../no-barrel-imports/transformers/barrel-export';
import { BarrelImport } from '../no-barrel-imports/transformers/barrel-import';
import { createBarrelImportListeners } from '../no-barrel-imports/utils/create-barrel-import-listeners';
import { createLintRule } from '../utils/create-rule';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-migrated-barrel-imports',
		type: 'problem',
		fixable: 'code',
		docs: {
			description:
				'Disallow importing from known package barrels once consumers have been migrated (`consumersMigrated: true` in @atlaskit/volt-components-entry-point-config); prefer mapped entry-point imports.',
			recommended: true,
			severity: 'error',
		},
		messages: {
			preferEntryPoint:
				'Importing from barrel "{{source}}" is not allowed. Import from the mapped package entry-point instead.',
		},
	},
	create(context) {
		return createBarrelImportListeners({
			onImport: (node) => {
				BarrelImport.lint(node, {
					context,
					readinessGate: 'consumersMigrated',
					fixStyle: 'autofix',
				});
			},
			onExport: (node) => {
				BarrelExport.lint(node, {
					context,
					readinessGate: 'consumersMigrated',
					fixStyle: 'autofix',
				});
			},
		});
	},
});

export default rule;
