import path from 'path';

const BARREL_BASENAMES = new Set(['index.ts', 'index.tsx', 'index.js', 'index.jsx']);

/**
 * Pure, path-shape-only check for a root package barrel. The file must be
 * `<pkgRoot>/src/index.{ts,tsx,js,jsx}`. Returns the candidate package-root
 * directory (the parent of `src`) when the shape matches, otherwise `null`.
 *
 * Exposed separately so it can be unit-tested without touching the filesystem
 * and reused by the filesystem-backed `isRootPackageBarrel` check.
 *
 * The shape requires:
 *   1. the file is named `index` with a `.ts`/`.tsx`/`.js`/`.jsx` extension, AND
 *   2. its immediate parent directory is `src`, AND
 *   3. there is a package-root directory above that `src` folder.
 */
export function getPackageRootForBarrel(filename: string): string | null {
	if (!filename) {
		return null;
	}
	// Normalise both POSIX and Windows separators so the same logic works
	// cross-platform regardless of the OS the linter runs on. (Relying on
	// `path.sep` alone would not split backslash paths when running on POSIX.)
	const normalised = filename.split(/[\\/]+/).join('/');
	const basename = normalised.slice(normalised.lastIndexOf('/') + 1);
	if (!BARREL_BASENAMES.has(basename)) {
		return null;
	}
	const dir = path.posix.dirname(normalised);
	// Immediate parent directory must be `src`.
	if (path.posix.basename(dir) !== 'src') {
		return null;
	}
	const packageRoot = path.posix.dirname(dir);
	// Guard against degenerate paths like `src/index.ts` with no package root.
	if (packageRoot === '' || packageRoot === '.' || packageRoot === '/') {
		return null;
	}
	return packageRoot;
}
