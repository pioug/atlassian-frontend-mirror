import type { Rule, SourceCode } from 'eslint';
import type * as ESTree from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';
import { importSources } from '@atlaskit/eslint-utils/schema';

import { createLintRuleWithTypedConfig } from '../utils/create-rule-with-typed-config';
import { isTypeWrapper } from '../utils/is-type-wrapper';
import { getStyleCalls } from '../utils/style-calls';

const rule: import('eslint').Rule.RuleModule = createLintRuleWithTypedConfig({
	meta: {
		name: 'no-important-styles',
		docs: {
			description: 'Disallows important style declarations',
			recommended: true,
			severity: 'error',
		},
		messages: {
			'no-important-styles':
				'Important style declarations are disallowed. Refactor so the `!important` flag is not needed.',
		},
		type: 'problem',
		schema: {
			type: 'object',
			properties: {
				importSources,
			},
		},
	},
	create(context, { importSources }) {
		const sourceCode = getSourceCode(context);
		if (!sourceCode.text.includes('important')) {
			return {};
		}

		return {
			Program() {
				const { text } = sourceCode;
				const reportedValues = new Set<ESTree.Node>();
				let importantIndex = text.indexOf('important');

				while (importantIndex !== -1) {
					const value = findStyleValue(sourceCode, importantIndex);
					if (
						value &&
						!reportedValues.has(value) &&
						isImportant(value) &&
						isInSupportedStyleCall(context, value, importSources)
					) {
						reportedValues.add(value);
						context.report({ node: value, messageId: 'no-important-styles' });
					}
					importantIndex = text.indexOf('important', importantIndex + 9);
				}
			},
		};
	},
});

export default rule;

function isImportant(node: ESTree.Node): boolean {
	if (node.type === 'Literal') {
		return typeof node.value === 'string' && hasImportantSuffix(node.value);
	}

	if (node.type === 'TemplateLiteral') {
		const lastQuasi = node.quasis[node.quasis.length - 1];
		return Boolean(lastQuasi && hasImportantSuffix(lastQuasi.value.raw));
	}

	return false;
}

type NodeWithParent = ESTree.Node & Rule.NodeParentExtension;

function findStyleValue(sourceCode: SourceCode, index: number): NodeWithParent | null {
	let node = sourceCode.getNodeByRangeIndex(index) as NodeWithParent | null;

	while (node && node.type !== 'Literal' && node.type !== 'TemplateLiteral') {
		node = node.parent as (ESTree.Node & Rule.NodeParentExtension) | null;
	}

	return node;
}

function isInSupportedStyleCall(
	context: Rule.RuleContext,
	value: NodeWithParent,
	importSources: readonly string[],
): boolean {
	const call = findContainingCall(value);
	return Boolean(
		call &&
		getStyleCalls(context).some(
			(styleCall) => styleCall.node === call && importSources.includes(styleCall.importSource),
		),
	);
}

/**
 * Step up from `node` past any TypeScript wrappers (`as`, `satisfies`, `<T>`, `!`). Returns the
 * outermost wrapper, which is what the next parent refers to, and that parent.
 */
function climbTypeWrappers(node: NodeWithParent): {
	node: NodeWithParent;
	parent: NodeWithParent | null;
} {
	let current = node;
	let parent = current.parent as NodeWithParent | null;
	while (parent && isTypeWrapper(parent)) {
		current = parent;
		parent = current.parent as NodeWithParent | null;
	}
	return { node: current, parent };
}

/**
 * Find the style call a value belongs to, looking through TypeScript wrappers at every level:
 * `color: 'red !important' as const`, `'&:hover': {…} as const` and `css({…} as const)`.
 */
function findContainingCall(value: NodeWithParent): ESTree.CallExpression | null {
	const { node: wrappedValue, parent: property } = climbTypeWrappers(value);
	if (property?.type !== 'Property' || property.value !== wrappedValue) {
		return null;
	}

	let object = property.parent as NodeWithParent | null;
	if (object?.type !== 'ObjectExpression') {
		return null;
	}

	while (object) {
		const { node: wrappedObject, parent } = climbTypeWrappers(object);
		if (parent?.type === 'Property' && parent.value === wrappedObject) {
			object = parent.parent as NodeWithParent | null;
			if (object?.type !== 'ObjectExpression') {
				return null;
			}
			continue;
		}

		if (
			parent?.type === 'CallExpression' &&
			(parent.arguments as readonly ESTree.Node[]).includes(wrappedObject)
		) {
			return parent;
		}

		if (
			parent?.type === 'ArrowFunctionExpression' &&
			parent.body === wrappedObject &&
			parent.parent?.type === 'CallExpression' &&
			parent.parent.arguments.includes(parent)
		) {
			return parent.parent;
		}

		return null;
	}

	return null;
}

function hasImportantSuffix(value: string): boolean {
	let index = value.length - 1;
	while (index >= 0 && isWhitespace(value.charCodeAt(index))) {
		index--;
	}

	const importantStart = index - 8;
	if (importantStart < 0 || value.slice(importantStart, index + 1) !== 'important') {
		return false;
	}

	index = importantStart - 1;
	while (index >= 0 && isWhitespace(value.charCodeAt(index))) {
		index--;
	}

	return value.charCodeAt(index) === 33;
}

function isWhitespace(character: number): boolean {
	return character === 32 || (character >= 9 && character <= 13);
}
