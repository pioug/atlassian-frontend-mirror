/**
 * Read a `<meta name="...">` tag's content from the current document, with
 * per-name caching. Browser-only: returns `undefined` under SSR or when absent.
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
