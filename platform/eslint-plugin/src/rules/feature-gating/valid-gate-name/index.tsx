import type { Rule } from 'eslint';
import { FEATURE_API_IMPORT_SOURCES } from '../../constants';
import { isIdentifierImportedFrom, type Node } from '../utils';

const IMPORT_SOURCES = new Set([
	...FEATURE_API_IMPORT_SOURCES,
	'@atlassian/jira-feature-flagging-utils',
	'@atlassian/jira-feature-gate-component',
]);

const FUNCTION_NAMES = new Set([
	'ff',
	'fg',
	'getFeatureFlagValue',
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

/**
 * Valid gate names must only contain lowercase letters (a-z), numbers (0-9),
 * underscores (_), hyphens (-), and dots (.).
 * No spaces, capital letters, or other characters are allowed.
 */
const VALID_GATE_NAME_PATTERN = /^[a-z0-9_.-]+$/;

function isValidGateName(name: string): boolean {
	return VALID_GATE_NAME_PATTERN.test(name);
}

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Ensure feature gate names contain only lowercase letters, numbers, underscores, and hyphens',
		},
		messages: {
			invalidGateName:
				'Feature gate name "{{name}}" is invalid. Gate names must contain only lowercase letters (a-z), numbers (0-9), underscores (_), hyphens (-), and dots (.).',
		},
	},
	create(context) {
		return {
			'CallExpression[callee.type="Identifier"][arguments.length>0][arguments.0.type="Literal"]': (
				node: Node<any>,
			) => {
				if (node.type !== 'CallExpression') {
					return;
				}

				if (
					node.callee.type === 'Identifier' &&
					(!FUNCTION_NAMES.has(node.callee.name) ||
						!isIdentifierImportedFrom(node.callee.name, IMPORT_SOURCES, context, node))
				) {
					return;
				}

				const nameArgument = node.arguments[0];
				if (nameArgument.type !== 'Literal' || typeof nameArgument.value !== 'string') {
					return;
				}

				const gateName = nameArgument.value;
				if (!isValidGateName(gateName)) {
					context.report({
						node: nameArgument,
						messageId: 'invalidGateName',
						data: { name: gateName },
					});
				}
			},
		};
	},
};

export default rule;
