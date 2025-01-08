export function isSSR(): boolean {
	try {
		return Boolean(
			// In most places there is no document when running on server-side
			typeof document === 'undefined' ||
				// When SSRing editor with full cycle mode we define the document
				// Check Confluence specific environment variable
				(typeof process !== 'undefined' && process.env.REACT_SSR),
		);
	} catch (e) {
		// Catch possible error that might occur and just return false
		return false;
	}
}
