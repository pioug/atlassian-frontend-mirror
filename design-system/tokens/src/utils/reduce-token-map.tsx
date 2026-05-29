import tokens from '../artifacts/token-names';

type Token = keyof typeof tokens;

export function reduceTokenMap(
	tokenMap: { [key in Token]?: number | string },
	themeRamp: string[],
): string {
	return Object.entries(tokenMap).reduce<string>((acc: string, [key, value]) => {
		const cssVar = tokens[key as Token];
		return cssVar
			? `${acc}\n  ${cssVar}: ${typeof value === 'string' ? value : themeRamp[value]};`
			: acc;
	}, '');
}
