export type TokenFilterOptions = {
	excludeExperimental?: boolean;
};

type TokenWithState = {
	attributes: { state: string };
};

// Forge opts out of experimental tokens; internal ADS consumers keep them by default.
export function filterTokensForCodegen<T extends TokenWithState>(
	tokens: T[],
	{ excludeExperimental = false }: TokenFilterOptions = {},
): T[] {
	return excludeExperimental
		? tokens.filter((token) => token.attributes.state !== 'experimental')
		: tokens;
}
