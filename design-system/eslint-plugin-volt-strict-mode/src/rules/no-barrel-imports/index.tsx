import type { Rule } from 'eslint';

import { createLintRule } from '../utils/create-rule';

import { BarrelExport } from './transformers/barrel-export';
import { BarrelImport } from './transformers/barrel-import';
import { createBarrelImportListeners } from './utils/create-barrel-import-listeners';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-barrel-imports',
		type: 'problem',
		hasSuggestions: true,
		docs: {
			description:
				'Disallow importing from known package barrels; prefer mapped entry-point imports from @atlaskit/volt-components-entry-point-config.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			preferEntryPoint:
				'Importing from barrel "{{source}}" is not allowed. Import from the mapped package entry-point instead.',
			preferEntryPointSuggest: 'Rewrite import(s) to mapped package entry-point(s).',
		},
	},
	create(context) {
		return createBarrelImportListeners({
			onImport: (node) => {
				BarrelImport.lint(node, {
					context,
					readinessGate: 'voltCompliant',
					fixStyle: 'suggest',
				});
			},
			onExport: (node) => {
				BarrelExport.lint(node, {
					context,
					readinessGate: 'voltCompliant',
					fixStyle: 'suggest',
				});
			},
		});
	},
});

export default rule;
