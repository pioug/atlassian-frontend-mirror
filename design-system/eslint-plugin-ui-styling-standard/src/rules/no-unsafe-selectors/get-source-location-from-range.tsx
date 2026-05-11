import type { AST, Rule } from 'eslint';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

type Range = [number, number];

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
