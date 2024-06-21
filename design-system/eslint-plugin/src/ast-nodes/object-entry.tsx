/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import { isNodeOfType, type Property, type SpreadElement } from 'eslint-codemod-utils';

export const ObjectEntry = {
	getProperty(
		node: Property,
	):
		| { type: 'Identifier'; value: string }
		| { type: 'Literal'; value: string }
		| { type: undefined; value: undefined } {
		if (isNodeOfType(node.key, 'Identifier')) {
			return {
				type: 'Identifier',
				value: node.key.name,
			};
		}

		if (isNodeOfType(node.key, 'Literal') && node.key.value) {
			return {
				type: 'Literal',
				value: node.key.value.toString(),
			};
		}

		return { type: undefined, value: undefined };
	},

	getValue(node: Property): string | number | bigint | true | RegExp | undefined {
		// The value is a number, like `-3`
		if (
			isNodeOfType(node.value, 'UnaryExpression') &&
			isNodeOfType(node.value.argument, 'Literal') &&
			node.value.argument.raw
		) {
			if (node.value.operator === '-') {
				return -1 * Number.parseInt(node.value.argument.raw);
			}
			return Number.parseInt(node.value.argument.raw);
		}

		// The value is a string, like `'4px'`
		if (isNodeOfType(node.value, 'Literal') && node.value.value) {
			return node.value.value;
		}

		return undefined;
	},

	deleteEntry(
		node: Property | SpreadElement,
		context: Rule.RuleContext,
		fixer: Rule.RuleFixer,
	): Rule.Fix {
		// context.getSourceCode() is deprecated in favour of context.sourceCode, however this returns undefined for some reason
		const sourceCode = context.getSourceCode();

		// fixer.remove() doesn't account for things like commas or newlines within an ObjectExpression and will result in invalid output.
		// This approach specifically removes the node and trailing comma, and should work for single- and multi-line objects.
		// From https://github.com/eslint/eslint/issues/9576#issuecomment-341737453
		let prevToken = sourceCode.getTokenBefore(node);
		while (prevToken?.value !== ',' && prevToken?.value !== '{') {
			prevToken = sourceCode.getTokenBefore(node);
		}
		let lastToken = sourceCode.getTokenAfter(node);
		if (lastToken?.value !== ',') {
			lastToken = sourceCode.getTokenBefore(lastToken!);
		}

		return fixer.removeRange([prevToken.range[1], lastToken!.range[1]]);
	},

	getPropertyName(node: Property | SpreadElement): string | undefined {
		// SpreadElements don't really have a property name
		if (!isNodeOfType(node, 'Property')) {
			return undefined;
		}

		if (isNodeOfType(node.key, 'Literal')) {
			return node.key.value?.toString();
		}
		if (isNodeOfType(node.key, 'Identifier')) {
			return node.key.name;
		}
	},
};
