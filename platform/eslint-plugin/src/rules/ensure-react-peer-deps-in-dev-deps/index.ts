// Ensures React peerDependencies are also available in devDependencies for local tests/builds.
// Only `react` and `react-dom` are checked. If they are already listed in dependencies,
// they are ignored to avoid duplicate dependency entries. The expected devDependency range
// is `root:*` for `*`; otherwise it is the highest segment from the peer dependency's
// `||` range, converted to `root:*` when root protocol enforcement would require it.
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import semver from 'semver';

const ROOT_DEPENDENCY_RANGE = 'root:*';
const CHECKED_DEPENDENCIES = new Set(['react', 'react-dom']);

type PackageJson = {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	optionalDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
};

const getRootDependencyRange = (rootPkg: PackageJson, dependencyName: string) =>
	rootPkg.dependencies?.[dependencyName] ??
	rootPkg.devDependencies?.[dependencyName] ??
	rootPkg.optionalDependencies?.[dependencyName];

const getHighestRange = (range: string) => {
	const ranges = range.split('||').map((rangePart) => rangePart.trim());
	return ranges.reduce((highestRange, currentRange) => {
		const highestMinVersion = semver.minVersion(highestRange);
		const currentMinVersion = semver.minVersion(currentRange);
		if (!highestMinVersion || !currentMinVersion) {
			return highestRange;
		}
		return semver.gt(currentMinVersion, highestMinVersion) ? currentRange : highestRange;
	}, ranges[0] ?? range);
};

const isSubsetRange = (range: string | undefined, targetRange: string | undefined) =>
	range !== undefined &&
	targetRange !== undefined &&
	semver.validRange(range) !== null &&
	semver.validRange(targetRange) !== null &&
	semver.subset(range, targetRange);

const applyRootProtocolIfRequired = (
	candidateRange: string,
	rootDependencyRange: string | undefined,
) => (isSubsetRange(candidateRange, rootDependencyRange) ? ROOT_DEPENDENCY_RANGE : candidateRange);

const getExpectedDevDependencyVersion = (
	rootPkg: PackageJson,
	dependencyName: string,
	peerVersion: string,
) =>
	peerVersion === '*'
		? ROOT_DEPENDENCY_RANGE
		: applyRootProtocolIfRequired(
				getHighestRange(peerVersion),
				getRootDependencyRange(rootPkg, dependencyName),
			);

const loadRootPackageJson = (): PackageJson => {
	// eslint-disable-next-line import/no-dynamic-require, global-require
	return require(`${process.cwd()}/package.json`);
};

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Ensures peerDependencies are duplicated in devDependencies',
			recommended: false,
		},
		fixable: 'code',
		messages: {
			invalidPeerDevDependency:
				'Peer dependencies must be duplicated in devDependencies: {{relationships}}',
		},
	},
	create(context) {
		return {
			'Program > ExpressionStatement > AssignmentExpression > ObjectExpression': (
				node: Rule.Node,
			) => {
				const sourceCode = context.getSourceCode();
				const packageJsonText = sourceCode.getText(node);
				let packageJson: PackageJson;

				try {
					packageJson = JSON.parse(packageJsonText);
				} catch {
					return;
				}

				const peerDependencies = packageJson.peerDependencies ?? {};
				const dependencies = packageJson.dependencies ?? {};
				const devDependencies = packageJson.devDependencies ?? {};
				const rootPackageJson = loadRootPackageJson();

				const invalidRelationships = Object.entries(peerDependencies).flatMap(
					([peerDependencyName, peerVersion]) => {
						if (!CHECKED_DEPENDENCIES.has(peerDependencyName)) {
							return [];
						}

						const devDependencyName = peerDependencyName;
						if (dependencies[devDependencyName] !== undefined) {
							return [];
						}

						const expectedDevVersion = getExpectedDevDependencyVersion(
							rootPackageJson,
							devDependencyName,
							peerVersion,
						);
						const actualDevVersion = devDependencies[devDependencyName];

						return actualDevVersion === expectedDevVersion
							? []
							: [
									{
										message: `${peerDependencyName} -> ${devDependencyName}@${expectedDevVersion}`,
										devDependencyName,
										expectedDevVersion,
									},
								];
					},
				);

				if (invalidRelationships.length === 0) {
					return;
				}

				context.report({
					data: {
						relationships: invalidRelationships.map(({ message }) => message).join(', '),
					},
					fix(fixer) {
						const fixedPackageJson: PackageJson = {
							...packageJson,
							devDependencies: {
								...(packageJson.devDependencies ?? {}),
							},
						};
						invalidRelationships.forEach(({ devDependencyName, expectedDevVersion }) => {
							fixedPackageJson.devDependencies![devDependencyName] = expectedDevVersion;
						});

						return fixer.replaceText(node, JSON.stringify(fixedPackageJson, null, '\t'));
					},
					messageId: 'invalidPeerDevDependency',
					node,
				});
			},
		};
	},
};

export default rule;
