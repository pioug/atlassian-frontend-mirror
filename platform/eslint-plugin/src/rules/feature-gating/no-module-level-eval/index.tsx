import type { Rule } from 'eslint';
import type { Node } from 'estree';

import { EXPERIMENT_API_IMPORT_SOURCES, STATSIG_LIB_IMPORT_SOURCES } from '../../constants';
import { getScope } from '../../util/context-compat';
import { isAPIimport, isIdentifierImportedFrom } from '../utils';

// Member-style statsig APIs (e.g. `FeatureGates.checkGate(...)`) that resolve a
// gate/experiment value and therefore must not be evaluated at module level.
const STATSIG_MEMBER_FUNCTION_NAMES = new Set(['checkGate', 'getExperimentValue']);

const isInFunctionLevel = (context: Rule.RuleContext, node: Node) => {
	let scope: any = getScope(context, node);

	while (scope?.type !== 'module' && scope?.type !== 'global') {
		if (scope.type === 'function') {
			return true;
		}

		if (scope.type === 'class-field-initializer') {
			return !scope.block.parent.static;
		}

		scope = scope.upper;
	}

	return false;
};

const rule: Rule.RuleModule = {
	meta: {
		docs: {
			description: 'Disallow feature flag usage at module level',
			url: 'https://bitbucket.org/atlassian/atlassian-frontend-monorepo/src/master/platform/packages/platform/eslint-plugin/src/rules/feature-gating/no-module-level-eval/README.md',
		},
		messages: {
			noModuleLevelEval:
				'Move this gate or experiment evaluation into the function or component that uses its result, so it runs after flag initialization. Do not cache the evaluated result in a module-level constant; see platform/packages/platform/eslint-plugin/src/rules/feature-gating/no-module-level-eval/README.md.',
		},
	},
	create(context) {
		return {
			'CallExpression[callee.type="Identifier"]': (node: Node) => {
				if (
					node.type === 'CallExpression' &&
					node.callee.type === 'Identifier' &&
					(isAPIimport(node.callee.name, context, node) ||
						isIdentifierImportedFrom(
							node.callee.name,
							EXPERIMENT_API_IMPORT_SOURCES,
							context,
							node,
						)) &&
					!isInFunctionLevel(context, node)
				) {
					context.report({
						messageId: 'noModuleLevelEval',
						node,
					});
				}
			},
			// Catch member-style statsig calls such as `FeatureGates.checkGate('gate')`
			// imported from `@atlaskit/feature-gate-js-client`, which are not bare
			// identifier calls and therefore not covered by the visitor above.
			'CallExpression > MemberExpression': (node: Node) => {
				if (
					node.type === 'MemberExpression' &&
					node.property.type === 'Identifier' &&
					STATSIG_MEMBER_FUNCTION_NAMES.has(node.property.name) &&
					node.object.type === 'Identifier' &&
					isIdentifierImportedFrom(node.object.name, STATSIG_LIB_IMPORT_SOURCES, context, node) &&
					!isInFunctionLevel(context, node)
				) {
					context.report({
						messageId: 'noModuleLevelEval',
						node,
					});
				}
			},
		};
	},
};

export default rule;
