import { dirname, join } from 'path';

import * as ts from 'typescript';

import { isRelativeImport, readFileContent, resolveImportPath } from './file-system';
import { findPackageInRegistry } from './package-registry';
import type { FileSystem } from './types';

const ENTRY_POINT_FOLDER_NAMES = new Set([
	'entry-points',
	'entrypoints',
	'entrypoint',
	'entry-point',
]);

function isInEntryPointsFolder(filePath: string): boolean {
	const parts = filePath.split(/[/\\]/);
	return parts.some((part) => ENTRY_POINT_FOLDER_NAMES.has(part));
}

interface EntryPointReExport {
	sourcePath: string;
	/** Maps source export name → entry-point export name.
	 * E.g. `export { default as Foo }` → Map { 'default' → 'Foo' }
	 * Empty for star exports (`export * from`). */
	nameMap: Map<string, string>;
}

/**
 * Parse an entry-point wrapper file and resolve the source files it re-exports from,
 * along with name mappings (source export name → entry-point export name).
 */
function resolveEntryPointReExports({
	entryPointFilePath,
	fs,
}: {
	entryPointFilePath: string;
	fs: FileSystem;
}): EntryPointReExport[] {
	const content = readFileContent({ filePath: entryPointFilePath, fs });
	if (!content) {
		return [];
	}

	try {
		const sourceFile = ts.createSourceFile(
			entryPointFilePath,
			content,
			ts.ScriptTarget.Latest,
			true,
		);
		const basedir = dirname(entryPointFilePath);
		const results: EntryPointReExport[] = [];

		for (const statement of sourceFile.statements) {
			if (
				ts.isExportDeclaration(statement) &&
				statement.moduleSpecifier &&
				ts.isStringLiteral(statement.moduleSpecifier)
			) {
				const modulePath = statement.moduleSpecifier.text;
				if (!isRelativeImport(modulePath)) {
					continue;
				}

				const resolved = resolveImportPath({ basedir, importPath: modulePath, fs });
				if (!resolved) {
					continue;
				}

				const nameMap = new Map<string, string>();
				if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
					for (const element of statement.exportClause.elements) {
						const exportedName = element.name.text;
						const sourceName = element.propertyName
							? element.propertyName.text
							: exportedName;
						nameMap.set(sourceName, exportedName);
					}
				}

				results.push({ sourcePath: resolved, nameMap });
			}
		}

		return results;
	} catch {
		return [];
	}
}

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

export interface ExportMatchResult {
	exportPath: string;
	/**
	 * When resolved through an entry-point wrapper, the name under which
	 * the symbol is exported from the entry-point file.
	 * Callers use this to override the barrel's `originalName` so the
	 * generated import matches the entry-point's export shape.
	 */
	entryPointExportName?: string;
}

/**
 * Find a matching export entry for a given source file path.
 * Returns the export path (e.g., "./controllers/analytics") or null if not found.
 *
 * When `fs` is provided, also checks entry-point wrapper files. If an export resolves
 * to a file inside a recognized entry-points folder (entry-points, entrypoints, etc.),
 * the wrapper is parsed to see if it re-exports from `sourceFilePath`.
 *
 * `sourceExportName` is the name under which the symbol is exported from the source file
 * (e.g. `'default'`). Used to look up the corresponding entry-point export name so the
 * caller can generate the correct import style.
 */
export function findExportForSourceFile({
	sourceFilePath,
	exportsMap,
	fs,
	sourceExportName,
}: {
	sourceFilePath: string;
	exportsMap: Map<string, string>;
	fs?: FileSystem;
	sourceExportName?: string;
}): ExportMatchResult | null {
	for (const [exportPath, resolvedPath] of exportsMap) {
		if (resolvedPath === sourceFilePath) {
			return { exportPath };
		}
	}

	if (fs) {
		for (const [exportPath, resolvedPath] of exportsMap) {
			if (isInEntryPointsFolder(resolvedPath)) {
				const reExports = resolveEntryPointReExports({
					entryPointFilePath: resolvedPath,
					fs,
				});
				for (const reExport of reExports) {
					if (reExport.sourcePath === sourceFilePath) {
						let entryPointExportName: string | undefined;
						if (
							sourceExportName !== undefined &&
							reExport.nameMap.has(sourceExportName)
						) {
							entryPointExportName = reExport.nameMap.get(sourceExportName);
						}
						return { exportPath, entryPointExportName };
					}
				}
			}
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
