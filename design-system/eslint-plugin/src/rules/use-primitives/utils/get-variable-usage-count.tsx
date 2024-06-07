import type { Rule } from 'eslint';

/**
 * TODO: Update this logic: https://product-fabric.atlassian.net/browse/DSP-16059
 * Using Regex here because otherwise we'd need to traverse the entire AST
 * We should harden this logic as we go.
 */
export const getVariableUsagesCount = (
	variableName: string | undefined,
	context: Rule.RuleContext,
): number => {
	if (!variableName) {
		return 0;
	}

	const source = context.getSourceCode().text;

	const matches = Array.from(source.matchAll(new RegExp(`[^a-z]${variableName}[^a-z]`, 'g')));

	// subtract 1 because one of the matches is the variable definition:
	// e.g. a regex will find two `beep`s in this: `const beep = 'hello'; console.log(beep)`
	return matches.length - 1;
};
