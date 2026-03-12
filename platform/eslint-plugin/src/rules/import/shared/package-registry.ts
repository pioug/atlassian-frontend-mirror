import { join } from 'path';

import { DEFAULT_TARGET_FOLDERS } from './file-system';
import { perfInc, perfTime } from './perf';
import type { FileSystem, PackageRegistryCache } from './types';

/**
 * The folder paths used for package resolution.
 * All packages under these folders can be resolved regardless of applyToImportsFrom.
 * applyToImportsFrom is only used to filter which packages the lint rules apply to.
 */
const PACKAGE_RESOLUTION_ROOTS = ['platform/packages'];

/**
 * Get yarn.lock modification time for cache invalidation.
 * Returns 0 if yarn.lock doesn't exist.
 */
function getYarnLockMtime({
	workspaceRoot,
	fs,
}: {
	workspaceRoot: string;
	fs: FileSystem;
}): number {
	const yarnLockPath = join(workspaceRoot, 'yarn.lock');
	try {
		if (fs.existsSync(yarnLockPath)) {
			const stats = fs.statSync(yarnLockPath);
			return stats.mtimeMs ?? 0;
		}
	} catch {
		// Ignore errors
	}
	return 0;
}

/**
 * Check if the cache is valid for the given workspace root.
 * Cache is invalid if:
 * - The cache is not fully initialized
 * - The workspace root has changed
 * - The yarn.lock file has been modified
 */
function isCacheValid({
	cache,
	workspaceRoot,
	fs,
}: {
	cache: Partial<PackageRegistryCache>;
	workspaceRoot: string;
	fs: FileSystem;
}): boolean {
	// Cache is invalid if not initialized
	if (!cache.packageNameToDir || !cache.scannedDirectories) {
		return false;
	}

	// Cache is invalid if workspace root changed
	if (cache.workspaceRoot !== workspaceRoot) {
		return false;
	}

	// Cache is invalid if yarn.lock mtime changed
	const currentMtime = getYarnLockMtime({ workspaceRoot, fs });
	return currentMtime === cache.yarnLockMtime;
}

/**
 * Read package name from a package.json file.
 * Returns null if the file doesn't exist or doesn't have a valid name.
 */
function readPackageName({
	packageJsonPath,
	fs,
}: {
	packageJsonPath: string;
	fs: FileSystem;
}): string | null {
	try {
		if (!fs.existsSync(packageJsonPath)) {
			return null;
		}
		const content = fs.readFileSync(packageJsonPath, 'utf-8');
		const pkg = JSON.parse(content);
		if (pkg.name && typeof pkg.name === 'string') {
			return pkg.name;
		}
	} catch {
		// Ignore errors (invalid JSON, etc.)
	}
	return null;
}

/**
 * Recursively scan a directory for packages and update the cache.
 * Directories are cached (including those without packages) to avoid re-scanning.
 *
 * Once a package.json is found, subdirectories are not scanned since packages
 * don't contain nested packages. The exception is target folder roots (e.g., 'platform')
 * which may have a package.json but still contain packages in subdirectories.
 */
function scanDirectoryForPackages({
	dir,
	cache,
	fs,
	isTargetRoot = false,
	nestedTargetRoots,
}: {
	dir: string;
	cache: PackageRegistryCache;
	fs: FileSystem;
	/** If true, continue scanning subdirectories even if this directory has a package.json */
	isTargetRoot?: boolean;
	/**
	 * Directories whose *immediate children* should be treated as target roots.
	 * Example: `<workspaceRoot>/platform/packages` where children like `ai-mate/` may have
	 * a package.json but still contain nested packages.
	 */
	nestedTargetRoots: Set<string>;
}): void {
	// Skip if already scanned
	if (cache.scannedDirectories.has(dir)) {
		return;
	}

	// Mark as scanned (even if it doesn't contain a package)
	cache.scannedDirectories.add(dir);

	try {
		// Check for package.json in current directory
		const packageJsonPath = join(dir, 'package.json');
		const packageName = readPackageName({ packageJsonPath, fs });
		if (packageName) {
			cache.packageNameToDir.set(packageName, dir);
			// Don't scan subdirectories - packages don't contain nested packages
			// Exception: target folder roots (e.g., 'platform') may have packages in subdirectories
			if (!isTargetRoot) {
				return;
			}
		}

		// Recursively scan subdirectories
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		for (const entry of entries) {
			// Skip node_modules, hidden directories, and non-directories
			if (!entry.isDirectory() || entry.name === 'node_modules' || entry.name.startsWith('.')) {
				continue;
			}
			scanDirectoryForPackages({
				dir: join(dir, entry.name),
				cache,
				fs,
				// Only certain directory levels are treated as "target roots"
				isTargetRoot: nestedTargetRoots.has(dir),
				nestedTargetRoots,
			});
		}
	} catch {
		// Directory doesn't exist or not readable, skip
	}
}

/**
 * Ensure all packages under platform/packages have been scanned.
 * Initializes or updates the cache on fs.cache as needed.
 * Package resolution is not constrained by applyToImportsFrom - any package can be resolved.
 */
function ensureCachePopulated({
	workspaceRoot,
	fs,
}: {
	workspaceRoot: string;
	fs: FileSystem;
}): void {
	// Check if cache is still valid
	if (isCacheValid({ cache: fs.cache, workspaceRoot, fs })) {
		return;
	}

	perfInc({ fs, key: 'packageRegistry.rebuild' });
	return perfTime({
		fs,
		key: 'packageRegistry.rebuildMs',
		fn: () => {
			// Initialize fresh cache
			fs.cache.packageNameToDir = new Map();
			fs.cache.scannedDirectories = new Set();
			fs.cache.yarnLockMtime = getYarnLockMtime({ workspaceRoot, fs });
			fs.cache.workspaceRoot = workspaceRoot;
			// When the workspace graph changes, clear derived caches as well
			fs.cache.packageExportsByDir = new Map();

			// Scan all packages under the resolution roots
			// This is not constrained by applyToImportsFrom - any package can be resolved
			// The immediate children of each root (e.g., ai-mate, search) are treated as
			// "nested target roots" - they may have a package.json but still contain nested packages
			for (const resolutionRoot of PACKAGE_RESOLUTION_ROOTS) {
				const targetPath = join(workspaceRoot, resolutionRoot);
				scanDirectoryForPackages({
					dir: targetPath,
					cache: fs.cache as PackageRegistryCache,
					fs,
					isTargetRoot: true,
					nestedTargetRoots: new Set([targetPath]),
				});
			}
		},
	});
}

/**
 * Find the package directory for a given package name.
 * Returns the absolute path to the package directory or null if not found.
 *
 * This function uses lazy scanning - it will scan platform/packages on first lookup
 * and cache results in fs.cache for subsequent lookups.
 *
 * Note: Package resolution is NOT constrained by applyToImportsFrom. Any package under
 * platform/packages can be resolved. Use isPackageInApplyToImportsFrom to check if a
 * package should be processed by the lint rule.
 */
export function findPackageInRegistry({
	packageName,
	workspaceRoot,
	fs,
}: {
	packageName: string;
	workspaceRoot: string;
	fs: FileSystem;
}): string | null {
	// Ensure cache is populated
	ensureCachePopulated({ workspaceRoot, fs });

	// Look up the package
	return fs.cache.packageNameToDir?.get(packageName) ?? null;
}

/**
 * Check if a package is within one of the applyToImportsFrom folders.
 * This can be used to quickly filter out packages that shouldn't be checked.
 */
export function isPackageInApplyToImportsFrom({
	packageDir,
	workspaceRoot,
	applyToImportsFrom = DEFAULT_TARGET_FOLDERS,
}: {
	packageDir: string;
	workspaceRoot: string;
	applyToImportsFrom?: string[];
}): boolean {
	return applyToImportsFrom.some((folder) => {
		const targetPath = join(workspaceRoot, folder);
		return packageDir.startsWith(targetPath);
	});
}
