/**
 * Synchronously read the value of a `<meta name="...">` tag from the current
 * document, with per-name in-process caching to avoid repeated DOM lookups.
 *
 * Mirrors the convention used by `@atlassian/eoc-fetch`'s `getMeta` helper:
 * Atlassian product pages (Confluence, Jira, etc.) render a stable set of
 * meta tags (e.g. `<meta name="ajs-cloud-id" content="...">`) at SSR time,
 * which client code can read directly from the DOM without any provider,
 * network call, or host migration.
 *
 * Browser-only. Returns `undefined` under SSR or when the tag is absent.
 */
const cache = new Map<string, string | undefined>();

export const getMeta = (name: string): string | undefined => {
	if (typeof document === 'undefined') {
		return undefined;
	}

	if (cache.has(name)) {
		return cache.get(name);
	}

	// `name` is interpolated into a CSS attribute selector
	const escapedName = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(name) : name;
	const value =
		document
			.querySelector<HTMLMetaElement>(`meta[name="${escapedName}"]`)
			?.getAttribute('content') ?? undefined;

	cache.set(name, value);
	return value;
};

/**
 * Test-only: clear the cache so each test starts with a clean slate.
 */
export const __clearMetaCacheForTests = (): void => {
	cache.clear();
};
