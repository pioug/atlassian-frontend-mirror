// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import { getObjectPropertyAsObject, getObjectPropertyAsLiteral } from '../util/handle-ast-object';
import { getPackagesSync } from '@manypkg/get-packages';
import { findRootSync } from '@manypkg/find-root';

const root = findRootSync(process.cwd());
const pkgs = getPackagesSync(root).packages;
const pkgMap = new Map(pkgs.map((pkg) => [pkg.packageJson.name, pkg]));

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description: `Ensures that private dependencies are not used in published packages.`,
			recommended: true,
		},
		hasSuggestions: false,
		messages: {
			invalidPrivateDependency: `Published package has private dependency '{{ pkgName }}'. To resolve this error, remove the private dependency or set this package to private.`,
		},
	},
	create(context) {
		return {
			ObjectExpression: async (node: Rule.Node) => {
				// Only run this rule on package.json files
				if (!context.filename.endsWith('package.json') || node.type !== 'ObjectExpression') {
					return;
				}

				// Private dependencies can be used in private packages
				const isPrivatePkg = getObjectPropertyAsLiteral(node, 'private') === true;
				if (isPrivatePkg === true) {
					return;
				}

				// Check for private dependencies in dependencies and peerDependencies
				// Note: devDependencies are not checked here as they don't end up in consumer lockfiles
				const dependencies = getObjectPropertyAsObject(node, 'dependencies');
				const peerDependencies = getObjectPropertyAsObject(node, 'peerDependencies');

				for (const obj of [dependencies, peerDependencies]) {
					for (const p of obj?.properties || []) {
						if (p.type === 'Property' && p.key.type === 'Literal') {
							const key = p.key.value;
							if (typeof key === 'string' && pkgMap.has(key)) {
								const isPrivateDependency = pkgMap.get(key)?.packageJson.private === true;
								if (isPrivateDependency) {
									context.report({
										node,
										messageId: 'invalidPrivateDependency',
										data: { pkgName: key },
									});
								}
							}
						}
					}
				}
			},
		};
	},
};

export default rule;
