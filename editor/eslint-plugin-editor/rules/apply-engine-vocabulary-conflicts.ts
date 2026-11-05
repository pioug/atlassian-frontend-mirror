/**
 * apply-engine-vocabulary-conflicts
 *
 * `@atlassian/editor-ai-apply-engine` declares the facts its rules share about
 * node types as `VocabularyPart`s, all in `src/rules/vocabulary.ts`, and
 * merges them at load time. This rule checks that file as it is written, so two
 * parts that disagree are reported in the editor and in CI instead of when the
 * engine loads:
 *
 * - `containerFor` / `itemFor`: two parts give different values for one node type;
 * - `variants`: a node type is in two different variant groups;
 * - anything the rule can't read (a spread, a computed key, a non-literal
 *   value), because a conflict hidden behind it could not be checked.
 *
 * The same fact given twice is not a conflict.
 */
import { ESLintUtils, type TSESLint, type TSESTree } from '@typescript-eslint/utils';

type MessageIds = 'conflict' | 'variantConflict' | 'notLiteral';
type Options = [];

/** Fields that map a node type to one fact. */
const MAP_FIELDS = new Set(['containerFor', 'itemFor']);
/** Fields that list node types. */
const LIST_FIELDS = new Set(['transportWrappers', 'relocatableAncestors']);
/** Fields the rule doesn't check (functions). */
const SKIPPED_FIELDS = new Set(['refusalHints']);

type Seen = { line: number; part: string; value: string };

function keyName(property: TSESTree.Property): string | null {
	if (property.computed) {
		return null;
	}
	if (property.key.type === 'Identifier') {
		return property.key.name;
	}
	return property.key.type === 'Literal' && typeof property.key.value === 'string'
		? property.key.value
		: null;
}

/** A string literal, or an array (of arrays) of string literals, as JSON; otherwise null. */
function literalJson(node: TSESTree.Node): string | null {
	if (node.type === 'Literal' && typeof node.value === 'string') {
		return JSON.stringify(node.value);
	}
	if (node.type === 'TSAsExpression' || node.type === 'TSSatisfiesExpression') {
		return literalJson(node.expression);
	}
	if (node.type === 'ArrayExpression') {
		const items: string[] = [];
		for (const element of node.elements) {
			const json = element && element.type !== 'SpreadElement' ? literalJson(element) : null;
			if (json === null) {
				return null;
			}
			items.push(json);
		}
		return `[${items.join(',')}]`;
	}
	return null;
}

function isVocabularyPartAnnotation(declarator: TSESTree.VariableDeclarator): boolean {
	const annotation =
		declarator.id.type === 'Identifier' ? declarator.id.typeAnnotation?.typeAnnotation : undefined;
	return (
		annotation?.type === 'TSTypeReference' &&
		annotation.typeName.type === 'Identifier' &&
		annotation.typeName.name === 'VocabularyPart'
	);
}

/** The part's object literal, for `const X: VocabularyPart = {…}` or `const X = {…} satisfies VocabularyPart`. */
function partObject(declarator: TSESTree.VariableDeclarator): TSESTree.ObjectExpression | null {
	const init = declarator.init;
	if (!init) {
		return null;
	}
	if (isVocabularyPartAnnotation(declarator) && init.type === 'ObjectExpression') {
		return init;
	}
	if (
		init.type === 'TSSatisfiesExpression' &&
		init.typeAnnotation.type === 'TSTypeReference' &&
		init.typeAnnotation.typeName.type === 'Identifier' &&
		init.typeAnnotation.typeName.name === 'VocabularyPart' &&
		init.expression.type === 'ObjectExpression'
	) {
		return init.expression;
	}
	return null;
}

export const rule: TSESLint.RuleModule<MessageIds> = ESLintUtils.RuleCreator.withoutDocs<
	Options,
	MessageIds
>({
	defaultOptions: [],
	meta: {
		type: 'problem',
		docs: {
			description:
				'Disallow apply engine vocabulary parts that give different facts for the same node type',
		},
		schema: [],
		messages: {
			conflict:
				'{{field}}.{{key}} is {{value}} here, but {{otherPart}} (line {{line}}) says {{otherValue}}. Two vocabulary parts must not give different facts for one node type: keep one, or make them agree.',
			variantConflict:
				'{{type}} is in the variant group {{value}} here, but in {{otherValue}} in {{otherPart}} (line {{line}}). A node type can be in one variant group only.',
			notLiteral:
				'Write vocabulary parts as plain literals (strings and arrays of strings, no spreads or computed keys), so conflicts between parts can be checked.',
		},
	},
	create(context) {
		const maps = new Map<string, Map<string, Seen>>();
		const variantOf = new Map<string, Seen>();

		const checkPart = (part: string, object: TSESTree.ObjectExpression) => {
			for (const property of object.properties) {
				if (property.type !== 'Property') {
					context.report({ node: property, messageId: 'notLiteral' });
					continue;
				}
				const field = keyName(property);
				if (field === null) {
					context.report({ node: property, messageId: 'notLiteral' });
					continue;
				}
				if (SKIPPED_FIELDS.has(field)) {
					continue;
				}
				if (MAP_FIELDS.has(field)) {
					if (property.value.type !== 'ObjectExpression') {
						context.report({ node: property.value, messageId: 'notLiteral' });
						continue;
					}
					const seen = maps.get(field) ?? new Map<string, Seen>();
					maps.set(field, seen);
					for (const entry of property.value.properties) {
						const key = entry.type === 'Property' ? keyName(entry) : null;
						const value = entry.type === 'Property' ? literalJson(entry.value) : null;
						if (entry.type !== 'Property' || key === null || value === null) {
							context.report({ node: entry, messageId: 'notLiteral' });
							continue;
						}
						const other = seen.get(key);
						if (other && other.value !== value) {
							context.report({
								node: entry,
								messageId: 'conflict',
								data: {
									field,
									key,
									value,
									otherPart: other.part,
									otherValue: other.value,
									line: String(other.line),
								},
							});
						} else if (!other) {
							seen.set(key, { part, value, line: entry.loc.start.line });
						}
					}
					continue;
				}
				if (field === 'variants') {
					if (property.value.type !== 'ArrayExpression') {
						context.report({ node: property.value, messageId: 'notLiteral' });
						continue;
					}
					for (const group of property.value.elements) {
						const value = group && group.type === 'ArrayExpression' ? literalJson(group) : null;
						if (!group || group.type !== 'ArrayExpression' || value === null) {
							context.report({ node: group ?? property.value, messageId: 'notLiteral' });
							continue;
						}
						for (const type of JSON.parse(value) as string[]) {
							const other = variantOf.get(type);
							if (other && other.value !== value) {
								context.report({
									node: group,
									messageId: 'variantConflict',
									data: {
										type,
										value,
										otherPart: other.part,
										otherValue: other.value,
										line: String(other.line),
									},
								});
							} else if (!other) {
								variantOf.set(type, { part, value, line: group.loc.start.line });
							}
						}
					}
					continue;
				}
				if (LIST_FIELDS.has(field) && literalJson(property.value) === null) {
					context.report({ node: property.value, messageId: 'notLiteral' });
				}
			}
		};

		return {
			VariableDeclarator(declarator) {
				const object = partObject(declarator);
				if (object && declarator.id.type === 'Identifier') {
					checkPart(declarator.id.name, object);
				}
			},
		};
	},
});

const ApplyEngineVocabularyConflictsRule: { rule: TSESLint.RuleModule<MessageIds> } = { rule };
export default ApplyEngineVocabularyConflictsRule;
