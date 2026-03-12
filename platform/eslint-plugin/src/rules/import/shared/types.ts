import { execSync } from 'child_process';
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from 'fs';

/**
 * Directory entry returned by readdirSync with withFileTypes option.
 */
export interface DirectoryEntry {
	name: string;
	isDirectory(): boolean;
	isFile(): boolean;
}

/**
 * State for the package registry cache.
 * This is used to cache package name to directory mappings for efficient lookups.
 */
export interface PackageRegistryCache {
	/** Map of package name to absolute directory path */
	packageNameToDir: Map<string, string>;
	/** Set of directories that have been scanned (including those without packages) */
	scannedDirectories: Set<string>;
	/** yarn.lock mtime when cache was built (for invalidation) */
	yarnLockMtime: number;
	/** The workspace root this cache was built for (from package registry perspective) */
	workspaceRoot: string | null;
}

/**
 * Cache structure for file system operations.
 * Contains both package registry cache and workspace root cache.
 */
export interface FileSystemCache extends Partial<PackageRegistryCache> {
	/** Cached git repository root (from git rev-parse --show-toplevel) */
	gitRepoRoot?: string;
	/**
	 * Cache of parsed package.json exports maps keyed by absolute package directory.
	 * This avoids repeated reads/parses during IDE lint runs.
	 */
	packageExportsByDir?: Map<
		string,
		{
			/** mtimeMs of package.json when this entry was computed. null means unknown (forces re-read). */
			packageJsonMtimeMs: number | null;
			exportsMap: Map<string, string>;
		}
	>;

	/**
	 * Cache of read file contents keyed by absolute file path.
	 * Used by barrel parsing to avoid repeated reads in IDE lint runs.
	 */
	fileContentByPath?: Map<
		string,
		{
			/** mtimeMs when this entry was cached. null means unknown (forces re-read). */
			mtimeMs: number | null;
			content: string;
		}
	>;

	/**
	 * Cache of parsed barrel exports keyed by barrel file path.
	 * Stores the barrel file mtime at time of parsing to support invalidation.
	 */
	barrelExportsByPath?: Map<
		string,
		{
			mtimeMs: number;
			exports: Map<string, ExportInfo>;
		}
	>;

	/**
	 * Cache for resolveImportPath results keyed by basedir + importPath.
	 */
	resolvedImportPathByKey?: Map<string, string | null>;

	/**
	 * Optional perf counters and timers for debugging and optimization.
	 * Enabled by setting INTERNAL_ESLINT_BARREL_PERF.
	 */
	perf?: {
		installedExitHook: boolean;
		counters: Record<string, number>;
		timers: Record<string, number>;
	};
}

/**
 * File system abstraction for testability.
 * This interface allows the core logic to be tested with mock file systems.
 * The cache property holds package resolution state and can be passed as an empty
 * object for tests to ensure fresh state for each test case.
 */
export interface FileSystem {
	existsSync(path: string): boolean;
	readFileSync(path: string, encoding: 'utf-8'): string;
	realpathSync(path: string): string;
	statSync(path: string): { isFile(): boolean; mtimeMs?: number };
	readdirSync(path: string, options: { withFileTypes: true }): DirectoryEntry[];
	/** Execute a command synchronously and return stdout. Returns null on error. */
	execSync(command: string, options?: { cwd?: string }): string | null;
	/** Cache for package resolution and workspace root - will be populated lazily */
	cache: FileSystemCache;
}

/**
 * Real file system implementation using Node.js fs module.
 */
export const realFileSystem: FileSystem = {
	existsSync,
	readFileSync,
	realpathSync,
	statSync,
	readdirSync: (path: string, options: { withFileTypes: true }) => readdirSync(path, options),
	execSync: (command: string, options?: { cwd?: string }): string | null => {
		try {
			return execSync(command, { ...options, encoding: 'utf-8' }).trim();
		} catch {
			return null;
		}
	},
	cache: {},
};

/**
 * Information about cross-package re-export origin.
 */
export interface CrossPackageSource {
	/** The package name (e.g., '@atlassian/package-b') */
	packageName: string;
	/** The export path within the package (e.g., '.' or './utils') */
	exportPath: string;
}

/**
 * Information about where an export originates.
 */
export interface ExportInfo {
	/** The absolute path to the file where this export originates */
	path: string;
	/** Whether this is a type-only export */
	isTypeOnly: boolean;
	/** Whether this is a re-export of a default export */
	isDefaultExport?: boolean;
	/** The original name of the symbol in the source file (for aliased exports) */
	originalName?: string;
	/** Information about cross-package re-export origin, if applicable */
	crossPackageSource?: CrossPackageSource;
}

/**
 * Context for package resolution operations.
 */
export interface PackageResolutionContext {
	packageName: string;
	packageDir: string;
	exportPath: string;
	entryFilePath: string;
	exportsMap: Map<string, string>;
}
