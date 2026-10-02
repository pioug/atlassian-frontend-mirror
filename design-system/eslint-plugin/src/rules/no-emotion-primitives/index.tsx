import type { Rule } from 'eslint';
import { literal } from 'eslint-codemod-utils';
import type * as ESTree from 'eslint-codemod-utils';
import type { FromSchema, JSONSchema } from 'json-schema-to-ts';

import { createLintRule } from '../utils/create-lint-rule';

const schema = {
	type: 'array',
	items: [
		{
			type: 'object',
			properties: {
				autofix: {
					type: 'boolean',
				},
			},
			additionalProperties: false,
		},
	],
} as const satisfies JSONSchema;

type Config = {
	autofix: boolean;
};

const defaultConfig: Config = {
	autofix: false,
};

function readConfig(context: Rule.RuleContext): Config {
	const [config] = context.options as FromSchema<typeof schema>;
	return Object.assign({}, defaultConfig, config);
}

const PACKAGE_NAME = '@atlaskit/primitives';
const COMPILED_PACKAGE_NAME = '@atlaskit/primitives/compiled';

/**
 * The set of Emotion entrypoints that have a direct Compiled equivalent under
 * `@atlaskit/primitives/compiled/<subpath>`. Imports from these entrypoints can be
 * safely autofixed by prefixing the subpath with `compiled/`.
 */
const AUTOFIXABLE_ENTRYPOINTS = new Set([
	'anchor',
	'bleed',
	'box',
	'flex',
	'grid',
	'hide',
	'inline',
	'media-helper',
	'metric-text',
	'pressable',
	'show',
	'stack',
	'text',
]);

/**
 * Named exports with a supported dedicated Compiled component entrypoint.
 */
const COMPILED_COMPONENT_ENTRYPOINTS: Record<string, string> = {
	Anchor: 'anchor',
	Bleed: 'bleed',
	Box: 'box',
	Flex: 'flex',
	Grid: 'grid',
	Inline: 'inline',
	MetricText: 'metric-text',
	Pressable: 'pressable',
	Stack: 'stack',
	Text: 'text',
};

function getCompiledRootImports(
	node: ESTree.ImportDeclaration,
	context: Rule.RuleContext,
): string | null {
	const sourceCode = context.getSourceCode();
	const isTypeImport = /^import\s+type\b/.test(sourceCode.getText(node));
	if (sourceCode.getCommentsInside(node).length) {
		return null;
	}
	const imports = new Map<string, string[]>();
	for (const specifier of node.specifiers) {
		if (specifier.type !== 'ImportSpecifier' || specifier.imported.type !== 'Identifier') {
			return null;
		}
		const name = specifier.imported.name;
		const componentName = name.endsWith('Props') ? name.slice(0, -5) : name;
		const subpath = COMPILED_COMPONENT_ENTRYPOINTS[componentName];
		// Legacy styling APIs have no equivalent Compiled export. Leave them for manual migration.
		if (!subpath) {
			return null;
		}
		const bindings = imports.get(subpath) ?? [];
		bindings.push(sourceCode.getText(specifier));
		imports.set(subpath, bindings);
	}
	return imports.size
		? Array.from(
				imports,
				([subpath, bindings]) =>
					`import ${isTypeImport ? 'type ' : ''}{ ${bindings.join(', ')} } from '${COMPILED_PACKAGE_NAME}/${subpath}';`,
			).join('\n')
		: null;
}

/**
 * Determines whether an import source points at an Emotion `@atlaskit/primitives` entrypoint
 * that should be migrated to Compiled.
 *
 * Returns the suggested Compiled import source to use for the autofix, or `null` when the
 * import should be ignored (i.e. it is not an `@atlaskit/primitives` import, or it is already
 * a Compiled entrypoint).
 *
 * When the import is an Emotion entrypoint that has no direct Compiled equivalent, the rule
 * still reports a violation but there is no safe autofix; in that case the original source is
 * returned so the fixer becomes a no-op replacement.
 */
function getCompiledSource(importSource: string): string | null {
	// The barrel import, e.g. `@atlaskit/primitives`.
	if (importSource === PACKAGE_NAME) {
		return COMPILED_PACKAGE_NAME;
	}

	// Ignore anything that isn't scoped to `@atlaskit/primitives/...`.
	if (!importSource.startsWith(`${PACKAGE_NAME}/`)) {
		return null;
	}

	const subpath = importSource.slice(`${PACKAGE_NAME}/`.length);

	// Compiled entrypoints (`@atlaskit/primitives/compiled` and `@atlaskit/primitives/compiled/*`)
	// are already valid and should be ignored.
	if (subpath === 'compiled' || subpath.startsWith('compiled/')) {
		return null;
	}

	// Emotion entrypoint with a known Compiled equivalent — safe to autofix.
	if (AUTOFIXABLE_ENTRYPOINTS.has(subpath)) {
		return `${COMPILED_PACKAGE_NAME}/${subpath}`;
	}

	// Emotion entrypoint without a direct Compiled equivalent (e.g. `xcss`, `constants`,
	// `responsive/*`). Report the violation but leave the source unchanged so no broken
	// autofix is produced.
	return importSource;
}

export const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-emotion-primitives',
		type: 'problem',
		fixable: 'code',
		docs: {
			description: 'Ensures usage of Compiled Primitives import instead of Emotion entrypoint.',
			severity: 'warn',
			recommended: false,
		},
		messages: {
			'no-emotion-primitives':
				'Use a dedicated @atlaskit/primitives/compiled/<component> entrypoint instead of @atlaskit/primitives. Refer to go/akcss for more information.',
		},
		schema,
	},
	create(context) {
		const config = readConfig(context);

		return {
			ImportDeclaration(node: ESTree.ImportDeclaration) {
				const importSource = node.source.value as string;

				const compiledSource = getCompiledSource(importSource);
				if (compiledSource === null) {
					return;
				}

				context.report({
					node: node.source,
					messageId: 'no-emotion-primitives',
					fix(fixer) {
						// No safe autofix when there is no Compiled equivalent for this entrypoint.
						if (!config.autofix || compiledSource === importSource) {
							return null;
						}

						if (importSource === PACKAGE_NAME) {
							const imports = getCompiledRootImports(node, context);
							return imports ? fixer.replaceText(node, imports) : null;
						}

						const newSource = literal(compiledSource);
						return fixer.replaceText(node.source, newSource.raw || `'${compiledSource}'`);
					},
				});
			},
		};
	},
});

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export default rule;
