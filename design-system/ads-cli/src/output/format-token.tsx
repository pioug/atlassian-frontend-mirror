/**
 * Human-readable renderer for a single ADS design token's detail view.
 *
 * The token dataset is intentionally small — each record has only `name` and `exampleValue` —
 * so the detail view adds the actionable `token('…')` usage line on top of those two fields.
 * Full structured data remains available via `--json`.
 */

/**
 * A token payload as returned by `searchTokensTool` / `getAllTokensTool`.
 */
type TokenPayload = {
	name?: string;
	exampleValue?: string;
};

/**
 * Render a single token payload as a detail view. Returns `null` when the data is not a
 * recognisable token object, so the caller can fall back to generic rendering.
 */
export const formatToken = (data: unknown): string | null => {
	// `token <name>` reuses token search with limit 1, so `data` is a one-element array.
	const token: TokenPayload | undefined = Array.isArray(data)
		? (data[0] as TokenPayload | undefined)
		: (data as TokenPayload);

	if (!token || typeof token !== 'object' || typeof token.name !== 'string') {
		return null;
	}

	const sections: string[] = [token.name, '='.repeat(token.name.length)];

	if (token.exampleValue) {
		sections.push('', `Example value: ${token.exampleValue}`);
	}

	// The actionable bit: how to consume the token from `@atlaskit/tokens`.
	sections.push('', 'Usage:', `  token('${token.name}')`);

	return sections.join('\n');
};
