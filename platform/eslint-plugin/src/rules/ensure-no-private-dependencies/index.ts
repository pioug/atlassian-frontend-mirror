// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import { getObjectPropertyAsObject, getObjectPropertyAsLiteral } from '../util/handle-ast-object';
import { getPackagesSync, type Package } from '@manypkg/get-packages';
import { findRootSync } from '@manypkg/find-root';

let root: string | undefined;
let pkgs: Package[] | undefined;
let pkgMap: Map<string, Package>;

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
		if (!context.filename.endsWith('package.json')) {
			return {};
		}

		root ??= findRootSync(process.cwd());
		pkgs ??= getPackagesSync(root).packages;
		pkgMap ??= new Map(pkgs.map((pkg) => [pkg.packageJson.name, pkg]));

		return {
			ObjectExpression: (node) => {
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
