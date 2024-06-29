import type { Rule } from 'eslint';
import { FEATURE_API_IMPORT_SOURCES } from '../constants';
import { getDef, isIdentifierImportedFrom, type Node } from '../utils';

const IMPORT_SOURCES = new Set([
	...FEATURE_API_IMPORT_SOURCES,
	'@atlassian/jira-feature-flagging-utils',
	'@atlassian/jira-feature-gate-component',
	'@atlassian/jira-feature-gates-test-mocks',
	'@atlassian/jira-feature-gates-storybook-mocks',
]);

// Any functions not in this list should be skipped for performance.
const FUNCTION_NAMES = new Set([
	'ff',
	'fg',
	'getFeatureFlagValue',
	'getMultivariateFeatureFlag',
	'componentWithFF',
	'componentWithFG',
	'passGate',
	'withGate',
	'expVal',
	'expValEquals',
	'UNSAFE_noExposureExp',
	'mockExp',
	'withExp',
	'wasExperimentManuallyExposed',
]);

const STATSIG_ONLY_FUNCTION_NAMES = new Set([
	'fg',
	'componentWithFG',
	'passGate',
	'withGate',
	'expVal',
	'expValEquals',
	'UNSAFE_noExposureExp',
	'mockExp',
	'withExp',
	'wasExperimentManuallyExposed',
]);

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			url: 'https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/browse/platform/packages/platform/eslint-plugin/src/rules/ff/static-feature-flags/README.md',
			description: 'Ensure feature flags or gates are static string literals',
		},
		fixable: 'code',
		messages: {
			FFLiteral:
				'Use static string literal for `featureFlagName`. See https://team.atlassian.com/project/ATLAS-46997/about',
		},
	},
	create(context) {
		const targetedFunctionsSwitch =
			context.options[0] === 'ssOnly' ? STATSIG_ONLY_FUNCTION_NAMES : FUNCTION_NAMES;

		return {
			// When they're not literals, show a message
			'CallExpression[callee.type="Identifier"][arguments.length>0][arguments.0.type!="Literal"]': (
				node: Node<any>,
			) => {
				if (node.type !== 'CallExpression') {
					return;
				}

				if (
					node.callee.type === 'Identifier' &&
					(!targetedFunctionsSwitch.has(node.callee.name) ||
						!isIdentifierImportedFrom(node.callee.name, IMPORT_SOURCES, context))
				) {
					return;
				}

				const nameArgument = node.arguments[0];
				if (nameArgument.type === 'Identifier') {
					const def = getDef(nameArgument.name, context);
					if (def != null && def.type === 'Variable') {
						const { value } = def.node.init as any;

						context.report({
							node: nameArgument,
							messageId: 'FFLiteral',
							fix: (fixer) => fixer.replaceText(nameArgument, `'${value}'`),
						});

						return;
					}
				}

				context.report({
					node: nameArgument,
					messageId: 'FFLiteral',
				});
			},
		};
	},
};

export default rule;
