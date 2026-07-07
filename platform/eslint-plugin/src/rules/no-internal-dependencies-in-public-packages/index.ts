// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';
import { getObjectPropertyAsLiteral, getObjectPropertyAsObject } from '../util/handle-ast-object';

type RuleOptions = {
	// Package names that are exempt from this rule.
	exceptions?: string[];
};

// Scope prefixes that identify a *public* (published to the public npm registry) package.
const PUBLIC_PREFIXES = ['@atlaskit'];
// Scope prefixes that identify an *internal* (Atlassian-only) package.
const INTERNAL_PREFIXES = ['@atlassian', '@atlassiansox', '@af'];

/**
 * Returns true when a dependency `name` belongs to a scope `prefix` at a package-name boundary.
 *
 * Boundary-aware to avoid false positives: `@af` matches `@af/foo` (and the bare scope `@af`) but
 * must NOT match a differently-named scope such as `@affoo`.
 */
const matchesScopePrefix = (name: string, prefix: string): boolean =>
	name === prefix || name.startsWith(`${prefix}/`);

// Install-affecting dependency fields. `devDependencies` is deliberately excluded because it
// does not reach consumer lockfiles (consistent with `ensure-no-private-dependencies`).
const INSTALL_AFFECTING_FIELDS = [
	'dependencies',
	'peerDependencies',
	'optionalDependencies',
] as const;

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Blocks public (e.g. @atlaskit) packages from declaring install-affecting dependencies on internal-only packages (e.g. @atlassian, @atlassiansox, @af), which external consumers cannot resolve from the public npm registry.',
			recommended: true,
		},
		hasSuggestions: false,
		schema: [
			{
				type: 'object',
				properties: {
					exceptions: {
						type: 'array',
						items: { type: 'string' },
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			internalDependencyInPublicPackage:
				"Public package '{{packageName}}' declares a dependency on internal package '{{dependency}}' in {{field}}. External consumers cannot resolve internal packages from the public npm registry. Remove the dependency or make the package internal.",
		},
	},
	create(context) {
		const options = (context.options?.[0] as RuleOptions) ?? {};
		const exceptions = options.exceptions ?? [];

		// @ts-ignore - Jira's ESLint v10 types expose filename, platform still checks with ESLint v9.
		const filename: string = context.filename ?? context.getFilename();
		if (!filename.endsWith('package.json')) {
			return {};
		}

		return {
			ObjectExpression: (node: Rule.Node) => {
				if (node.type !== 'ObjectExpression') {
					return;
				}

				const packageName = getObjectPropertyAsLiteral(node, 'name');
				if (typeof packageName !== 'string') {
					return;
				}

				// Only enforce for public-prefixed packages.
				if (!PUBLIC_PREFIXES.some((prefix) => matchesScopePrefix(packageName, prefix))) {
					return;
				}

				// Skip private packages: `private: true` packages are never published to the public
				// npm registry, so an internal dependency cannot break an external install.
				if (getObjectPropertyAsLiteral(node, 'private') === true) {
					return;
				}

				// Skip allowlisted packages.
				if (exceptions.includes(packageName)) {
					return;
				}

				for (const field of INSTALL_AFFECTING_FIELDS) {
					const dependencies = getObjectPropertyAsObject(node, field);
					if (!dependencies) {
						continue;
					}

					for (const property of dependencies.properties) {
						if (property.type !== 'Property' || property.key.type !== 'Literal') {
							continue;
						}

						const dependency = property.key.value;
						if (typeof dependency !== 'string') {
							continue;
						}

						if (INTERNAL_PREFIXES.some((prefix) => matchesScopePrefix(dependency, prefix))) {
							context.report({
								// Report on the specific dependency property for precise line/column info.
								node: property as unknown as Rule.Node,
								messageId: 'internalDependencyInPublicPackage',
								data: {
									packageName,
									dependency,
									field,
								},
							});
						}
					}
				}
			},
		};
	},
};

export default rule;
