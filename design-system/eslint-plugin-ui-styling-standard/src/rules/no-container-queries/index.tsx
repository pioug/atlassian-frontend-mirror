import estraverse from 'estraverse';
import type { JSONSchema4 } from 'json-schema';

import { getScope, getSourceCode } from '@atlaskit/eslint-utils/context-compat';
import {
	getImportSources,
	isCss,
	isCssMap,
	isKeyframes,
	isStyled,
	isXcss,
} from '@atlaskit/eslint-utils/is-supported-import';

import { createLintRule } from '../utils/create-rule';

const schema: JSONSchema4 = [
	{
		type: 'object',
		properties: {
			importSources: {
				type: 'array',
				items: { type: 'string' },
				uniqueItems: true,
			},
		},
	},
];

type TypeScriptExpression = {
	type: string;
	expression?: TypeScriptExpression;
	expressions?: unknown[];
	quasis?: Array<{ value?: { raw?: string } }>;
	typeAnnotation?: {
		type: string;
		typeName?: { type: string; name?: string };
	};
};

const unwrapTypeScriptExpression = (node: TypeScriptExpression): TypeScriptExpression => {
	let expression = node;

	while (
		expression.type === 'TSAsExpression' ||
		expression.type === 'TSTypeAssertion' ||
		expression.type === 'TSNonNullExpression' ||
		expression.type === 'TSSatisfiesExpression'
	) {
		expression = expression.expression as TypeScriptExpression;
	}

	return expression;
};

const isStaticContainerKey = (node: TypeScriptExpression): boolean => {
	const expression = unwrapTypeScriptExpression(node);

	if (expression.type === 'Literal') {
		return typeof (expression as { value?: unknown }).value === 'string';
	}

	return expression.type === 'TemplateLiteral' && expression.expressions?.length === 0;
};

const getStaticString = (node: TypeScriptExpression | undefined): string | undefined => {
	if (!node) {
		return undefined;
	}

	const expression = unwrapTypeScriptExpression(node);
	if (expression.type === 'Literal') {
		const value = (expression as { value?: unknown }).value;
		return typeof value === 'string' ? value : undefined;
	}

	if (expression.type === 'TemplateLiteral' && expression.expressions?.length === 0) {
		return expression.quasis?.[0]?.value?.raw;
	}

	return undefined;
};

const getPropertyName = (node: TypeScriptExpression): string | undefined => {
	const expression = unwrapTypeScriptExpression(node);
	return expression.type === 'Identifier'
		? (expression as { name?: string }).name
		: getStaticString(expression);
};

const isDimensionQuery = (query: string): boolean => {
	// Policy source: https://hello.atlassian.net/wiki/spaces/~7012119e15ecf78c74278a34bd6681745f7bb/pages/2595609668/What+would+it+take+to+get+container+queries+working
	const condition = query.replace(/^@container\s+[-_a-zA-Z][-_a-zA-Z0-9]*\s*/, '');
	return (
		!condition.includes('style(') &&
		/\b(?:width|height|min-width|max-width|min-height|max-height)\b/i.test(condition)
	);
};

const getContainerName = (query: string): string | undefined => {
	const match = query.match(/^@container\s+([-_a-zA-Z][-_a-zA-Z0-9]*)\b/);
	return match?.[1];
};

const isContainerDeclaration = (node: TypeScriptExpression): boolean => {
	return getPropertyName(node) === 'containerName';
};

const isImportedContainerType = (
	node: TypeScriptExpression,
	context: import('eslint').Rule.RuleContext,
): boolean => {
	let expression = node;

	while (expression.type === 'TSSatisfiesExpression') {
		const { typeAnnotation } = expression;
		if (
			typeAnnotation?.type === 'TSTypeReference' &&
			typeAnnotation.typeName?.type === 'Identifier'
		) {
			const typeName = typeAnnotation.typeName.name;
			const isImported = getSourceCode(context).ast.body.some(
				(statement) =>
					statement.type === 'ImportDeclaration' &&
					statement.source.value === '@atlaskit/css/at-rules/container' &&
					statement.specifiers.some(
						(specifier) =>
							specifier.type === 'ImportDefaultSpecifier' && specifier.local.name === typeName,
					),
			);

			if (isImported) {
				return true;
			}
		}

		expression = expression.expression as TypeScriptExpression;
	}

	return false;
};

const isContainerQuery = (node: TypeScriptExpression): boolean => {
	const expression = unwrapTypeScriptExpression(node);

	if (
		expression.type === 'Literal' &&
		typeof (expression as { value?: unknown }).value === 'string'
	) {
		return (expression as unknown as { value: string }).value.includes('@container');
	}

	return (
		expression.type === 'TemplateLiteral' &&
		Boolean(expression.quasis?.some((quasi) => quasi.value?.raw?.includes('@container')))
	);
};

const rule: import('eslint').Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-container-queries',
		docs: {
			description: 'Prevents usage of @container query within css styling',
			recommended: true,
			severity: 'error',
		},
		messages: {
			'no-container-queries':
				'@container queries must use a named container declared in the same file and a width/height-based condition.',
			'no-container-style-queries':
				'Style queries are not allowed. Use a width/height-based @container query instead.',
			'no-unbound-container-queries':
				'Container queries must include a container name, for example @container card (min-width: 30rem).',
			'no-mismatched-container-name':
				'The @container name must match a containerName declared in the same file.',
			'no-non-dimension-container-queries':
				'Container queries must be dimension-based (width or height); style and other feature queries are not allowed.',
		},
		type: 'problem',
		schema,
	},
	create(context) {
		const importSources = getImportSources(context);
		const containerNames = new Set<string>();

		return {
			Program(node) {
				estraverse.traverse(node, {
					enter(child) {
						if (child.type !== 'Property') {
							return;
						}

						const property = child as unknown as {
							key: TypeScriptExpression;
							value?: TypeScriptExpression;
						};
						if (isContainerDeclaration(property.key)) {
							const id = getStaticString(property.value);
							if (id) {
								containerNames.add(id);
							}
						}
					},
					fallback: 'iteration',
				});
			},
			CallExpression(node) {
				const { references } = getScope(context, node);

				if (
					isCss(node.callee, references, importSources) ||
					isStyled(node.callee, references, importSources) ||
					isKeyframes(node.callee, references, importSources) ||
					isCssMap(node.callee, references, importSources) ||
					isXcss(node.callee, references, importSources)
				) {
					estraverse.traverse(node, {
						enter(node) {
							if (node.type !== 'Property') {
								return;
							}

							const key = node.key as unknown as TypeScriptExpression;
							if (!isContainerQuery(key)) {
								return;
							}

							const query = getStaticString(key);
							const queryName = query ? getContainerName(query) : undefined;
							const reportMessageId = !query
								? 'no-container-queries'
								: query.includes('style(')
									? 'no-container-style-queries'
									: !queryName
										? 'no-unbound-container-queries'
										: !containerNames.has(queryName)
											? 'no-mismatched-container-name'
											: !isDimensionQuery(query)
												? 'no-non-dimension-container-queries'
												: 'no-container-queries';
							if (
								isImportedContainerType(key, context) &&
								isStaticContainerKey(key.expression as TypeScriptExpression) &&
								query &&
								queryName &&
								containerNames.has(queryName) &&
								isDimensionQuery(query)
							) {
								return;
							}

							context.report({
								node: node.key,
								messageId: reportMessageId,
							});
						},
						/**
						 * This is needed to handle unknown node types. Otherwise an error is thrown.
						 */
						fallback: 'iteration',
					});
				}
			},
		};
	},
});

export default rule;
