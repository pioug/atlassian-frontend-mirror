import readPkgUp from 'read-pkg-up';
import path from 'path';
import Fuse from 'fuse.js';

// defines a "getter" to "type" map, if more types are required for feature flags (like string) add it here!
// if you don't want to verify the type use `null` as the value
export const getterIdentifierToFlagTypeMap = {
	getBooleanFF: 'boolean' as const,
	ffTest: 'boolean' as const,
	fg: 'boolean' as const,
} as const;

export type PlatformFeatureFlagRegistrationSection = {
	[key: string]: {
		// get the values of the object above
		type: (typeof getterIdentifierToFlagTypeMap)[keyof typeof getterIdentifierToFlagTypeMap];
	};
};

export type EnhancedPackageJson = readPkgUp.PackageJson & {
	'platform-feature-flags'?: PlatformFeatureFlagRegistrationSection;
};

export type PkgJsonMetaData = {
	pkgJson: EnhancedPackageJson;
	fuse: Fuse<string> | null;
};
// make sure we cache reading the package.json so we don't end up reading it for every instance of this rule.
const pkgJsonCache = new Map<string, PkgJsonMetaData>();
// get the ancestor package.json for a given file
export const getMetadataForFilename = (filename: string): PkgJsonMetaData => {
	const splitFilename = filename.split(path.sep);
	for (let i = 0; i < splitFilename.length; i++) {
		// attempt to search using the filename in the cache to see if we've read the package.json for a sibling file before
		const searchPath = path.join(...splitFilename.splice(0, i));
		const cachedMetaData = pkgJsonCache.get(searchPath);

		if (cachedMetaData) {
			return cachedMetaData;
		}
	}

	const { packageJson, path: pkgJsonPath } = readPkgUp.sync({
		cwd: filename,
		normalize: false,
	})!;

	const pkgJson = packageJson as EnhancedPackageJson;

	const fuse =
		packageJson['platform-feature-flags'] == null
			? null
			: new Fuse(Object.keys(pkgJson['platform-feature-flags']!));

	const metaData = { pkgJson, fuse };

	pkgJsonCache.set(pkgJsonPath, metaData);
	return metaData;
};
