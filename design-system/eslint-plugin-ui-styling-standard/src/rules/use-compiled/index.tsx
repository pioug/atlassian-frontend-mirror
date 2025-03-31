import type { Rule } from 'eslint';
import { identifier, importDeclaration, importSpecifier, literal } from 'eslint-codemod-utils';
import type * as ESTree from 'eslint-codemod-utils';
import type { FromSchema, JSONSchema } from 'json-schema-to-ts';

import { getAllComments } from '@atlaskit/eslint-utils/context-compat';
import { findVariable } from '@atlaskit/eslint-utils/find-variable';

import { createLintRule } from '../utils/create-rule';

import { isSafeStyled, isSafeUsage } from './is-safe';
import {
	getFirstImportFromSource,
	isImportDefaultSpecifier,
	isImportNamespaceSpecifier,
	isImportSpecifier,
} from './utils';

const SUPPORTED_EMOTION_IMPORTS = new Set(['css', 'keyframes', 'ClassNames', 'jsx']);

const SUPPORTED_IMPORT_MAP = {
	'@emotion/core': SUPPORTED_EMOTION_IMPORTS,
	'@emotion/react': SUPPORTED_EMOTION_IMPORTS,
	'@emotion/styled': new Set(['default']),
	'styled-components': new Set(['default', 'css', 'keyframes']),
};

type SupportedImportSource = keyof typeof SUPPORTED_IMPORT_MAP;

function isSupportedImportSource(importSource: string): importSource is SupportedImportSource {
	return importSource in SUPPORTED_IMPORT_MAP;
}

const schema = {
	type: 'array',
	items: [
		{
			type: 'object',
			properties: {
				canAutoFix: {
					type: 'boolean',
				},
			},
			additionalProperties: false,
		},
	],
} as const satisfies JSONSchema;

type Config = {
	canAutoFix: boolean;
};

const defaultConfig: Config = {
	canAutoFix: false,
};

function readConfig(context: Rule.RuleContext): Config {
	const [config] = context.options as FromSchema<typeof schema>;
	return Object.assign({}, defaultConfig, config);
}

export const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'use-compiled',
		type: 'problem',
		fixable: 'code',
		docs: {
			description: 'Ensures usage of `@compiled/react` instead of other CSS-in-JS libraries',
			recommended: true,
			severity: 'error',
		},
		messages: {
			'use-compiled': `Use '@compiled/react' instead of '{{importSource}}'`,
		},
		schema,
	},
	create(context) {
		const config = readConfig(context);

		return {
			Program() {
				const pragma = getAllComments(context).find((n) =>
					n.value.includes('@jsxImportSource @emotion/react'),
				);

				if (!pragma) {
					return;
				}

				context.report({
					messageId: 'use-compiled',
					data: {
						importSource: '@emotion/react',
					},
					loc: pragma.loc!,
					*fix(fixer) {
						if (!config.canAutoFix) {
							return;
						}

						const importDeclarations = context
							.getSourceCode()
							.ast.body.filter(
								(node): node is ESTree.ImportDeclaration => node.type === 'ImportDeclaration',
							);

						const hasEmotionImport = importDeclarations.some((importDeclaration) => {
							const importSource = importDeclaration.source.value as string;
							return importSource.startsWith('@emotion/');
						});
						const hasCompiledImport = importDeclarations.some(
							(importDeclaration) => importDeclaration.source.value === '@compiled/react',
						);

						if (hasEmotionImport || !hasCompiledImport) {
							// Considering this unsafe to auto-fix
							return;
						}

						yield fixer.replaceText(
							// TODO: JFP-2823 - this type cast was added due to Jira's ESLint v9 migration
							// @ts-ignore - types don't accept comment nodes
							pragma,
							`/** @jsxImportSource @compiled/react */`,
						);
					},
				});
			},
			ImportDeclaration(node: ESTree.ImportDeclaration) {
				const importSource = node.source.value as string;
				if (!isSupportedImportSource(importSource)) {
					return;
				}

				context.report({
					node: node.source,
					messageId: 'use-compiled',
					data: {
						importSource,
					},
					*fix(fixer) {
						if (!config.canAutoFix) {
							return;
						}

						const specifiers = getSpecifiers({ context, node, importSource });

						if (!specifiers) {
							// Cannot safely auto-fix
							return;
						}

						yield* fixImport({
							context,
							fixer,
							node,
							specifiers,
						});
					},
				});
			},
		};
	},
});

export default rule;

function getSpecifiers({
	context,
	node,
	importSource,
}: {
	context: Rule.RuleContext;
	node: ESTree.ImportDeclaration;
	importSource: SupportedImportSource;
}) {
	const supportedImports = SUPPORTED_IMPORT_MAP[importSource];

	// We aren't supporting namespace imports
	if (node.specifiers.some(isImportNamespaceSpecifier)) {
		return;
	}

	const defaultSpecifier = node.specifiers.find(isImportDefaultSpecifier);
	if (defaultSpecifier) {
		if (!supportedImports.has('default')) {
			return;
		}
		const styled = findVariable({
			identifier: defaultSpecifier.local,
			sourceCode: context.getSourceCode(),
		});
		if (!styled || !isSafeStyled(styled)) {
			return;
		}
	}

	const namedSpecifiers = node.specifiers.filter(isImportSpecifier);
	if (
		!namedSpecifiers.every((specifier) =>
			isSafeUsage({
				context,
				specifier,
				supportedImports,
			}),
		)
	) {
		return;
	}

	if (defaultSpecifier) {
		return [
			...namedSpecifiers,
			// ASSUMPTION: the default import, if allowed, is for `styled`
			importSpecifier({
				imported: identifier('styled'),
				local: node.specifiers[0].local,
			}),
		];
	}

	return namedSpecifiers;
}

function* fixImport({
	context,
	fixer,
	node,
	specifiers,
}: {
	context: Rule.RuleContext;
	fixer: Rule.RuleFixer;
	node: ESTree.ImportDeclaration;
	specifiers: ESTree.ImportSpecifier[];
}): Generator<Rule.Fix> {
	const compiledImport = getFirstImportFromSource(context, '@compiled/react');

	if (compiledImport) {
		yield fixer.remove(node);
		yield fixer.replaceText(
			compiledImport,
			buildImportDeclaration(compiledImport.specifiers.concat(specifiers), '@compiled/react'),
		);
	} else {
		yield fixer.replaceText(node, buildImportDeclaration(specifiers, '@compiled/react'));
	}
}

function buildImportDeclaration(
	specifiers: ESTree.ImportDeclaration['specifiers'],
	source: string,
) {
	return `${importDeclaration({ specifiers, source: literal(source) })};`;
}
