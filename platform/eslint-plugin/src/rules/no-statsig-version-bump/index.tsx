// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import type { ObjectExpression } from 'estree';
import semver from 'semver';
import { getObjectPropertyAsObject } from '../util/handle-ast-object';

/**
 * The statsig client packages that are affected by the CPU regression.
 * Both packages are always released together and must be kept in sync.
 */
const BANNED_STATSIG_PACKAGES = ['@statsig/js-client', '@statsig/client-core'] as const;

/**
 * Returns true if the given semver range could ever resolve to a version
 * higher than the safe max version.
 *
 * We treat any range that is NOT a strict subset of <=3.30.x as dangerous.
 * Concretely we check that the upper bound of the range does not exceed 3.30.x:
 *  - exact pin to <=3.30.x patch: ok
 *  - "~3.30.0" / "~3.30.2": ok (patch bumps within 3.30 are fine)
 *  - "3.30.2": ok (exact pin)
 *  - "^3.30.x", "^3.x", ">=3.x", "*", ">3.30.x": NOT ok
 */
const canExceedSafeMax = (versionRange: string): boolean => {
	// Ignore special protocol prefixes used in the monorepo (root:*, workspace:^, etc.)
	if (
		versionRange.startsWith('root:') ||
		versionRange.startsWith('workspace:') ||
		versionRange.startsWith('npm:') ||
		versionRange === '*' ||
		versionRange === 'latest'
	) {
		return false; // Not a version constraint we can evaluate statically
	}

	const parsed = semver.validRange(versionRange);
	if (!parsed) {
		// Unparseable range — can't evaluate, don't flag
		return false;
	}

	// Check if any version above the safe max could satisfy this range.
	// We test a set of "dangerously high" versions to see if they match the range.
	const dangerousVersions = ['3.31.0', '3.33.0', '3.33.2', '4.0.0'];
	return dangerousVersions.some((v) => semver.satisfies(v, versionRange));
};

const getDependencyProperties = (
	depObject: ObjectExpression | null,
): Array<{ name: string; version: string; node: Rule.Node }> => {
	if (!depObject) {
		return [];
	}
	const results: Array<{ name: string; version: string; node: Rule.Node }> = [];
	for (const prop of depObject.properties) {
		if (
			prop.type === 'Property' &&
			prop.key.type === 'Literal' &&
			typeof prop.key.value === 'string' &&
			prop.value.type === 'Literal' &&
			typeof prop.value.value === 'string'
		) {
			results.push({
				name: prop.key.value,
				version: prop.value.value,
				node: prop.value as unknown as Rule.Node,
			});
		}
	}
	return results;
};

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Prevent bumping @statsig/js-client or @statsig/client-core to versions with a known CPU regression (HOT-303669). Keep these packages pinned to <=3.30.x.',
			url: 'https://opsj.atlassian.net/browse/PIRA-7020',
		},
		messages: {
			bannedStatsigVersion:
				'The package "{{pkg}}" must not be set to a version range that can resolve above 3.30.x. ' +
				'Versions above 3.30.x contain a significant CPU regression in feature gate serialization ' +
				'(see HOT-303669 / PIR-301987). Use an exact pin or a range that is strictly <=3.30.x (e.g. "3.30.2" or "~3.30.2").',
		},
		schema: [],
		hasSuggestions: false,
	},
	create(context) {
		// @ts-ignore - Jira's ESLint v10 types expose filename, platform still checks with ESLint v9.
		const fileName = context.filename ?? context.getFilename();

		return {
			ObjectExpression: (node: Rule.Node) => {
				if (!fileName.endsWith('package.json') || node.type !== 'ObjectExpression') {
					return;
				}

				const depSections = [
					getObjectPropertyAsObject(node as unknown as ObjectExpression, 'dependencies'),
					getObjectPropertyAsObject(node as unknown as ObjectExpression, 'devDependencies'),
					getObjectPropertyAsObject(node as unknown as ObjectExpression, 'peerDependencies'),
					getObjectPropertyAsObject(node as unknown as ObjectExpression, 'resolutions'),
				];

				for (const depSection of depSections) {
					const entries = getDependencyProperties(depSection);
					for (const { name, version, node: valueNode } of entries) {
						if (
							(BANNED_STATSIG_PACKAGES as readonly string[]).includes(name) &&
							canExceedSafeMax(version)
						) {
							context.report({
								node: valueNode,
								messageId: 'bannedStatsigVersion',
								data: { pkg: name },
							});
						}
					}
				}
			},
		};
	},
};

export default rule;
