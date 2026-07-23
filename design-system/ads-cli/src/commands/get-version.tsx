/**
 * Resolve the CLI version from package.json.
 *
 * A failed package lookup must not prevent the CLI from running, so fall back to the development
 * version used by the package source.
 */
export const getVersion = (): string => {
	try {
		// Read our own package.json at runtime via the package-name subpath. This is depth-independent,
		// so it resolves in both the source layout and the published build.
		// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires -- this uses require because not all supported node versions use the same import assertions/attributes
		const pkgJson = require('@atlaskit/ads-cli/package.json') as { version?: string };
		return pkgJson.version ?? '0.0.0';
	} catch {
		return '0.0.0';
	}
};
