import type { Rule } from 'eslint';
import cssSelectorParser from 'postcss-selector-parser';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

const cssSelectorProcessor: ReturnType<typeof cssSelectorParser> = cssSelectorParser();

/**
 * Structural stand-in for postcss-selector-parser's Root AST. Avoid returning the
 * library's Selector/Container types — under TSRS they expand into an infinite cycle.
 */
export type ParsedSelector = {
	nodes: Array<{
		nodes: unknown[];
		first: {
			type: string;
			sourceIndex: number;
			value: string;
			prev: () => unknown;
			next: () => unknown;
		};
		walk: (callback: (node: unknown) => false | undefined) => void;
	}>;
};

const selectorCache = new WeakMap<object, Map<string, ParsedSelector>>();

/**
 * Parse each selector once per linted source file. Consumers treat the returned AST as read-only.
 */
export function parseSelector(context: Rule.RuleContext, selectorText: string): ParsedSelector {
	const sourceCode = getSourceCode(context);
	let sourceFileCache = selectorCache.get(sourceCode);
	if (!sourceFileCache) {
		sourceFileCache = new Map();
		selectorCache.set(sourceCode, sourceFileCache);
	}

	const cachedSelector = sourceFileCache.get(selectorText);
	if (cachedSelector) {
		return cachedSelector;
	}

	const selector = cssSelectorProcessor.astSync(selectorText) as unknown as ParsedSelector;
	sourceFileCache.set(selectorText, selector);
	return selector;
}
