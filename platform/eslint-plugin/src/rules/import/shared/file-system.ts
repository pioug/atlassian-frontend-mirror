import { dirname, join, resolve } from 'path';

import type { FileSystem } from './types';

/**
 * The default folder paths that barrel import rules apply to.
 * Only imports from packages within these folders will be checked.
 * This can be overridden via lint rule options.
 */
export const DEFAULT_TARGET_FOLDERS: string[] = [
	'platform/packages/ai-mate',
	'platform/packages/search',
];

/**
 * Try to read file contents with error handling.
 * Returns null if file cannot be read.
 */
export function readFileContent({
	filePath,
	fs,
}: {
	filePath: string;
	fs: FileSystem;
}): string | null {
	if (!fs.cache.fileContentByPath) {
		fs.cache.fileContentByPath = new Map();
	}

	try {
		if (!fs.existsSync(filePath)) {
			return null;
		}

		let currentMtimeMs: number | null = null;
		try {
			currentMtimeMs = fs.statSync(filePath).mtimeMs ?? null;
		} catch {
			// If stat fails, use null to force a re-read (don't use cached value)
			currentMtimeMs = null;
		}

		const cached = fs.cache.fileContentByPath.get(filePath);
		// Only use cache if we have a valid mtime and it matches
		if (cached && currentMtimeMs !== null && cached.mtimeMs === currentMtimeMs) {
			return cached.content;
		}

		const content = fs.readFileSync(filePath, 'utf-8');
		fs.cache.fileContentByPath.set(filePath, {
			mtimeMs: currentMtimeMs,
			content,
		});
		return content;
	} catch {
		// Silently fail if file cannot be read
	}
	return null;
}

/**
 * Check if a path is a relative import (starts with ./ or ../)
 */
export function isRelativeImport(importPath: string): boolean {
	return importPath.startsWith('./') || importPath.startsWith('../');
}

/**
 * Resolve the actual file path from an import path.
 * Handles extension inference and index file resolution.
 */
export function resolveImportPath({
	basedir,
	importPath,
	fs,
}: {
	basedir: string;
	importPath: string;
	fs: FileSystem;
}): string | null {
	if (!fs.cache.resolvedImportPathByKey) {
		fs.cache.resolvedImportPathByKey = new Map();
	}
	const cacheKey = `${basedir}::${importPath}`;
	if (fs.cache.resolvedImportPathByKey.has(cacheKey)) {
		return fs.cache.resolvedImportPathByKey.get(cacheKey) ?? null;
	}

	const possibleExtensions = ['.ts', '.tsx', '.js', '.jsx'];
	const absolutePath = resolve(basedir, importPath);

	// Check exact path first (for explicit extensions)
	if (fs.existsSync(absolutePath)) {
		try {
			const stats = fs.statSync(absolutePath);
			if (stats.isFile()) {
				const resolvedPath = fs.realpathSync(absolutePath);
				fs.cache.resolvedImportPathByKey.set(cacheKey, resolvedPath);
				return resolvedPath;
			}
		} catch {
			// Ignore errors
		}
	}

	// Try with extensions
	for (const ext of possibleExtensions) {
		const pathWithExt = absolutePath + ext;
		if (fs.existsSync(pathWithExt)) {
			try {
				const resolvedPath = fs.realpathSync(pathWithExt);
				fs.cache.resolvedImportPathByKey.set(cacheKey, resolvedPath);
				return resolvedPath;
			} catch {
				fs.cache.resolvedImportPathByKey.set(cacheKey, pathWithExt);
				return pathWithExt;
			}
		}
	}

	// Try as directory with index
	for (const ext of possibleExtensions) {
		const indexPath = join(absolutePath, `index${ext}`);
		if (fs.existsSync(indexPath)) {
			try {
				const resolvedPath = fs.realpathSync(indexPath);
				fs.cache.resolvedImportPathByKey.set(cacheKey, resolvedPath);
				return resolvedPath;
			} catch {
				fs.cache.resolvedImportPathByKey.set(cacheKey, indexPath);
				return indexPath;
			}
		}
	}

	fs.cache.resolvedImportPathByKey.set(cacheKey, null);
	return null;
}

/**
 * Find the workspace root using git rev-parse --show-toplevel.
 * The result is cached on fs.cache.gitRepoRoot to avoid repeated shell calls.
 * Falls back to directory traversal if git command fails.
 */
export function findWorkspaceRoot({
	startPath,
	fs,
	applyToImportsFrom = DEFAULT_TARGET_FOLDERS,
}: {
	startPath: string;
	fs: FileSystem;
	applyToImportsFrom?: string[];
}): string {
	// Return cached value if available
	if (fs.cache.gitRepoRoot) {
		return fs.cache.gitRepoRoot;
	}

	// Try to get the git repository root
	const gitRoot = fs.execSync('git rev-parse --show-toplevel', { cwd: startPath });
	if (gitRoot) {
		fs.cache.gitRepoRoot = gitRoot;
		return gitRoot;
	}

	// Fallback: traverse up looking for workspace markers
	let current = startPath;
	const maxDepth = 20;
	let depth = 0;

	while (depth < maxDepth) {
		// Check if we've found the platform folder (which contains the target folders)
		if (applyToImportsFrom.some((folder) => fs.existsSync(join(current, folder)))) {
			fs.cache.gitRepoRoot = current;
			return current;
		}

		// Check for root-level indicators
		const hasRootPackageJson = fs.existsSync(join(current, 'package.json'));
		const hasYarnLock = fs.existsSync(join(current, 'yarn.lock'));

		if (hasRootPackageJson && hasYarnLock) {
			fs.cache.gitRepoRoot = current;
			return current;
		}

		const parent = dirname(current);
		if (parent === current) {
			// Reached filesystem root
			return startPath;
		}
		current = parent;
		depth++;
	}

	return startPath;
}
