import type { AST, Rule } from 'eslint';
import type * as ESTree from 'eslint-codemod-utils';
import { type Node as SelectorNode } from 'postcss-selector-parser';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

type Range = [number, number];

export function getRangeFromNode({
	node,
	sourceNode,
}: {
	/**
	 * The selector AST node to get the range of.
	 */
	node: SelectorNode & { value: string };
	/**
	 * The source ESTree node whose value was parsed to obtain the selector AST.
	 *
	 * The range is calculated relative to this node's range.
	 */
	sourceNode: ESTree.Node;
}): Range {
	/**
	 * The adjustment required to align the selector AST source position
	 * with the ESTree source position.
	 */
	const adjustment =
		/**
		 * Using a non-null `!` is safe here because ESLint requires the parser to
		 * include a range value on nodes.
		 *
		 * https://eslint.org/docs/latest/extend/custom-parsers#all-nodes
		 */
		sourceNode.range![0] +
		/**
		 * We add +1 if it's a literal to account for the opening `'` or `"` character.
		 */
		(sourceNode.type === 'Literal' ? 1 : 0);

	const start = adjustment + node.sourceIndex;
	const end = start + node.value.length;

	return [start, end];
}

export function getSourceLocationFromRange(
	context: Rule.RuleContext,
	[start, end]: Range,
): AST.SourceLocation {
	const sourceCode = getSourceCode(context);
	return {
		start: sourceCode.getLocFromIndex(start),
		end: sourceCode.getLocFromIndex(end),
	};
}
