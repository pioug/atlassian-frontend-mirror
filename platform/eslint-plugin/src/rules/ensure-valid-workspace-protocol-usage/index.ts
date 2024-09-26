// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import type { ObjectExpression } from 'estree';
import { getObjectPropertyAsObject, getObjectPropertyAsLiteral } from '../util/handle-ast-object';

const workspaceProtocolRegex = /^workspace:[\^~\*]$/;

/**
 * Checks if the workspace protocol is used in either dependencies or devDependencies
 */
function checkIsWorkspaceProtocolUsed(node: ObjectExpression) {
	const dependencies = getObjectPropertyAsObject(node, 'dependencies');
	const devDependencies = getObjectPropertyAsObject(node, 'devDependencies');
	return [dependencies, devDependencies].some((obj) => {
		return (
			obj !== null &&
			obj.properties.some((p) => {
				if (p.type === 'Property' && p.value.type === 'Literal') {
					return typeof p.value.value === 'string' && workspaceProtocolRegex.test(p.value.value);
				}
			})
		);
	});
}

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description: `Ensures the workspace protocol is only used in private packages.`,
			recommended: true,
		},
		hasSuggestions: false,
		messages: {
			invalidWorkspaceProtocolUsage: `The workspace protocol can not be used in public packages.`,
		},
	},
	create(context) {
		const fileName = context.getFilename();
		return {
			ObjectExpression: (node: Rule.Node) => {
				if (!fileName.endsWith('package.json') || node.type !== 'ObjectExpression') {
					return;
				}

				// Exit early if we are linting a private package
				const isPrivatePackage = getObjectPropertyAsLiteral(node, 'private') === true;
				if (isPrivatePackage) {
					return;
				}

				// Check if the workspace protocol is used in either dependencies or devDependencies
				const isWorkspaceProtocolused = checkIsWorkspaceProtocolUsed(node);
				if (!isWorkspaceProtocolused) {
					return;
				}

				return context.report({
					node,
					messageId: 'invalidWorkspaceProtocolUsage',
				});
			},
		};
	},
};

export default rule;
