import { join } from 'path';

import { readFileContent, resolveImportPath } from './file-system';
import { findPackageInRegistry } from './package-registry';
import type { FileSystem } from './types';

/**
 * Parse the package.json exports field and return a map of export paths to resolved file paths.
 */
export function parsePackageExports({
	packageDir,
	fs,
}: {
	packageDir: string;
	fs: FileSystem;
}): Map<string, string> {
	// Memoize per-package to avoid repeated reads/parses during IDE lint runs.
	// Additionally, invalidate per-package if the package.json mtime changes
	// (covers unstaged local edits in IDE).
	if (!fs.cache.packageExportsByDir) {
		fs.cache.packageExportsByDir = new Map();
	}

	const packageJsonPath = join(packageDir, 'package.json');
	let currentMtimeMs: number | null = null;
	try {
		currentMtimeMs = fs.statSync(packageJsonPath).mtimeMs ?? null;
	} catch {
		// If package.json can't be stat'ed (missing/inaccessible), use null to force re-read
		currentMtimeMs = null;
	}

	const cached = fs.cache.packageExportsByDir.get(packageDir);
	// Only use cache if we have a valid mtime and it matches
	if (cached && currentMtimeMs !== null && cached.packageJsonMtimeMs === currentMtimeMs) {
		return cached.exportsMap;
	}

	const exportsMap = new Map<string, string>();

	try {
		const content = readFileContent({ filePath: packageJsonPath, fs });
		if (!content) {
			return exportsMap;
		}

		const packageJson = JSON.parse(content);
		const exports = packageJson.exports;

		if (!exports || typeof exports !== 'object') {
			return exportsMap;
		}

		for (const [exportPath, exportValue] of Object.entries(exports)) {
			// Handle both simple string values and conditional exports objects
			let resolvedPath: string | null = null;

			if (typeof exportValue === 'string') {
				resolvedPath = exportValue;
			} else if (typeof exportValue === 'object' && exportValue !== null) {
				// Handle conditional exports like { "import": "./...", "require": "./..." }
				// Prefer "import" or "default" or first available
				const condExports = exportValue as Record<string, string>;
				resolvedPath =
					condExports['import'] || condExports['default'] || Object.values(condExports)[0];
			}

			if (resolvedPath && typeof resolvedPath === 'string') {
				// Resolve the path relative to the package directory
				const absolutePath = resolveImportPath({
					basedir: packageDir,
					importPath: resolvedPath,
					fs,
				});
				if (absolutePath) {
					exportsMap.set(exportPath, absolutePath);
				}
			}
		}
	} catch {
		// Ignore parsing errors
	}

	// Cache even empty maps to avoid re-reading invalid/missing exports repeatedly.
	fs.cache.packageExportsByDir.set(packageDir, {
		packageJsonMtimeMs: currentMtimeMs,
		exportsMap,
	});
	return exportsMap;
}

/**
 * Find a matching export entry for a given source file path.
 * Returns the export path (e.g., "./controllers/analytics") or null if not found.
 */
export function findExportForSourceFile({
	sourceFilePath,
	exportsMap,
}: {
	sourceFilePath: string;
	exportsMap: Map<string, string>;
}): string | null {
	for (const [exportPath, resolvedPath] of exportsMap) {
		if (resolvedPath === sourceFilePath) {
			return exportPath;
		}
	}
	return null;
}

/**
 * Extract the package name and subpath from an import specifier.
 * Returns null if the import is not a scoped package import.
 */
export function extractPackageNameFromImport(
	moduleSpecifier: string,
): { packageName: string; subPath: string } | null {
	const match = moduleSpecifier.match(/^(@[^/]+\/[^/]+)(\/.*)?$/);
	if (!match) {
		return null;
	}
	return {
		packageName: match[1],
		subPath: match[2] || '',
	};
}

/**
 * Resolve a cross-package import to its package directory and export info.
 * Returns null if the package is not in the target folder or cannot be resolved.
 */
export function resolveCrossPackageImport({
	moduleSpecifier,
	workspaceRoot,
	fs,
}: {
	moduleSpecifier: string;
	workspaceRoot: string;
	fs: FileSystem;
}): {
	packageName: string;
	packageDir: string;
	exportPath: string;
	entryFilePath: string;
} | null {
	// Only handle @atlassian/* scoped packages
	const parsed = extractPackageNameFromImport(moduleSpecifier);
	if (!parsed) {
		return null;
	}

	const { packageName, subPath } = parsed;

	// Check if package is in target folder
	const packageDir = findPackageInRegistry({ packageName, workspaceRoot, fs });
	if (!packageDir) {
		return null;
	}

	// Parse package.json exports
	const exportsMap = parsePackageExports({ packageDir, fs });
	if (exportsMap.size === 0) {
		return null;
	}

	// Determine the export path (e.g., '.' or './utils')
	const exportPath = subPath ? '.' + subPath : '.';
	const entryFilePath = exportsMap.get(exportPath);

	if (!entryFilePath) {
		return null;
	}

	return {
		packageName,
		packageDir,
		exportPath,
		entryFilePath,
	};
}
