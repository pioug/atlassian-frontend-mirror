import type { EntryPointConfig } from '../src/types';

export type LocatedPackage = {
	name: string;
	packageDir: string;
	packageJsonPath: string;
	packageJson: {
		name?: string;
		exports?: Record<string, string | Record<string, string>>;
	};
};

export type DetectedBarrel = {
	barrelKey: string;
	filePath: string;
	symbols: Array<{
		exportName: string;
		/**
		 * Name the symbol has inside `sourceFilePath`. `default` when the barrel
		 * re-exports a default export under a new name (`export { default as Foo }`),
		 * which is the only case where a named barrel export may legitimately resolve
		 * to an entry-point's default export.
		 */
		localName: string;
		kind: EntryPointConfig[string][string][string]['type'];
		sourceFilePath: string | null;
	}>;
};

/**
 * How an entry-point exposes a symbol, and therefore which import form consumers must write.
 * A barrel may rename what it re-exports, so neither the import form nor the name at the
 * barrel is a reliable guide to the import form at the entry-point.
 */
export type SymbolMatch = { shape: 'named'; exportedAs: string } | { shape: 'default' };

export type SubpathCandidate = {
	/**
	 * Public subpath as used in imports, e.g. `/box` or `/compiled/box`.
	 */
	entryPoint: string;
	/**
	 * Absolute path of the file behind this export key.
	 */
	filePath: string;
	/**
	 * Symbols exported by this entry-point file.
	 */
	symbols: Set<string>;
	/**
	 * Underlying modules re-exported by this entry-point (plus the entry file itself).
	 */
	underlyingSources: Set<string>;
};

export type CodegenAmbiguousItem = {
	packageName: string;
	barrelKey: string;
	symbolName: string;
	candidates: string[];
};

export type CodegenReport = {
	ambiguous: CodegenAmbiguousItem[];
};
