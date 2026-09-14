import type { Rule, SourceCode } from 'eslint';
import type * as ESTree from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';
import { importSources } from '@atlaskit/eslint-utils/schema';

import { createLintRuleWithTypedConfig } from '../utils/create-rule-with-typed-config';
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

function findContainingCall(value: NodeWithParent): ESTree.CallExpression | null {
	let property = value.parent as NodeWithParent | null;
	if (property?.type !== 'Property' || property.value !== value) {
		return null;
	}

	let object = property.parent as NodeWithParent | null;
	if (object?.type !== 'ObjectExpression') {
		return null;
	}

	while (object) {
		const parent = object.parent as NodeWithParent | null;
		if (parent?.type === 'Property' && parent.value === object) {
			property = parent;
			object = property.parent as NodeWithParent | null;
			if (object?.type !== 'ObjectExpression') {
				return null;
			}
			continue;
		}

		if (parent?.type === 'CallExpression' && parent.arguments.includes(object)) {
			return parent;
		}

		if (
			parent?.type === 'ArrowFunctionExpression' &&
			parent.body === object &&
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
