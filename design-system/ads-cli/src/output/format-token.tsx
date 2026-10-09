/**
 * Human-readable renderer for a single ADS design token's detail view.
 *
 * Exact token lookups include the full metadata record. The detail view renders its guidance and
 * adds an actionable `token('…')` usage line; the same structured fields remain available via
 * `--json`.
 */

/**
 * A token payload as returned by `searchTokensTool` / `getAllTokensTool`.
 */
type TokenPayload = {
	name?: string;
	description?: string;
	exampleValue?: string;
	usageGuidelines?: {
		usage?: string;
		cssProperties?: string[];
	};
	usage?: string;
};

const oneLine = (text: string): string => text.replace(/\s+/g, ' ').trim();

/**
 * Render a single token payload as a detail view. Returns `null` when the data is not a
 * recognisable token object, so the caller can fall back to generic rendering.
 */
export const formatToken = (data: unknown): string | null => {
	// `token <name>` returns a ranked candidate array; the command transform selects the detail.
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

	// Prefer the canonical per-token description over the broader category guidance.
	const guidance =
		token.description ||
		(token.usageGuidelines?.usage ? oneLine(token.usageGuidelines.usage) : undefined);
	if (guidance) {
		sections.push('', 'Guidelines:', `  ${guidance}`);
	}

	if (token.usageGuidelines?.cssProperties?.length) {
		sections.push(
			'',
			'CSS properties:',
			...token.usageGuidelines.cssProperties.map((item) => `  ${item}`),
		);
	}

	// The actionable bit: how to consume the token from `@atlaskit/tokens`.
	sections.push('', 'Usage:', `  ${token.usage ?? `token('${token.name}')`}`);

	return sections.join('\n');
};
