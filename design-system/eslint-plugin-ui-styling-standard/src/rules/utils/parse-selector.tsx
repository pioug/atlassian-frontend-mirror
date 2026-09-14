import type { Rule } from 'eslint';
import cssSelectorParser from 'postcss-selector-parser';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

const cssSelectorProcessor: ReturnType<typeof cssSelectorParser> = cssSelectorParser();
type ParsedSelector = ReturnType<typeof cssSelectorProcessor.astSync>;
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

	const selector = cssSelectorProcessor.astSync(selectorText);
	sourceFileCache.set(selectorText, selector);
	return selector;
}
