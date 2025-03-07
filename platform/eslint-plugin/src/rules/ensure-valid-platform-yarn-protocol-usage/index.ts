// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import type { ObjectExpression } from 'estree';
import { getObjectPropertyAsObject, getObjectPropertyAsLiteral } from '../util/handle-ast-object';

const workspaceProtocolRegex = /^workspace:[\^~\*]$/;
const rootProtocolRegex = /^root:[\^~\*]$/;

// Hard coded list is not ideal, but it's temporary until we've migrated all packages to use workspace protocols
// Exclude check at the package level
const EXCLUDED_PACKAGES = [
	'@atlaskit/dummy-pkg-a',
	'@atlaskit/dummy-pkg-b',
	'@atlassian/dummy-pkg-c',
	'@atlaskit/react-select',
	'@atlassian/search-client',
	'@atlassian/search-page',
	'@atlassian/data-classification-level',
];

/**
 * Checks if the 'workspace:' and 'root:' protocol are used as either dependencies or devDependencies
 */
function getYarnProtocolsUsed(node: ObjectExpression) {
	const protocolsUsed = { workspace: false, root: false };

	const dependencies = getObjectPropertyAsObject(node, 'dependencies');
	const devDependencies = getObjectPropertyAsObject(node, 'devDependencies');
	const peerDependencies = getObjectPropertyAsObject(node, 'peerDependencies');

	for (const obj of [dependencies, devDependencies, peerDependencies]) {
		for (const p of obj?.properties || []) {
			if (p.type === 'Property' && p.value.type === 'Literal') {
				if (typeof p.value.value === 'string') {
					if (workspaceProtocolRegex.test(p.value.value)) {
						protocolsUsed.workspace = true;
					}
					if (rootProtocolRegex.test(p.value.value)) {
						protocolsUsed.root = true;
					}
				}
			}
		}
	}

	return protocolsUsed;
}

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description: `Ensures that yarn protocols 'workspace:' and 'root:' are used correctly.`,
			recommended: true,
		},
		hasSuggestions: false,
		messages: {
			invalidWorkspaceProtocolUsage: `The 'workspace:' protocol is not allowed in public packages. To resolve this error, either set the package to private or replace the 'workspace:' protocol with specific package versions (e.g. '^1.0.0').`,
			invalidRootProtocolUsage: `The 'root:' protocol is not allowed in platform packages. To resolve this error, replace the 'root:' protocol with specific package versions (e.g. '^1.0.0').`,
		},
	},
	create(context) {
		return {
			ObjectExpression: (node: Rule.Node) => {
				if (!context.filename.endsWith('package.json') || node.type !== 'ObjectExpression') {
					return;
				}

				const packageName = getObjectPropertyAsLiteral(node, 'name');

				if (typeof packageName === 'string' && EXCLUDED_PACKAGES.includes(packageName)) {
					return;
				}

				const yarnProtocolsUsed = getYarnProtocolsUsed(node);

				// The 'root:' protocol can not be used in any platform packages
				if (yarnProtocolsUsed.root) {
					context.report({
						node,
						messageId: 'invalidRootProtocolUsage',
					});
				}

				// The 'workspace:' protocol can not be used in public packages
				const isPrivatePackage = getObjectPropertyAsLiteral(node, 'private') === true;
				if (!isPrivatePackage && yarnProtocolsUsed.workspace) {
					context.report({
						node,
						messageId: 'invalidWorkspaceProtocolUsage',
					});
				}
			},
		};
	},
};

export default rule;
