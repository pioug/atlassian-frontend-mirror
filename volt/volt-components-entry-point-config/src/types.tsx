/**
 * Package-level Volt migration readiness from
 * `platform/volt-preset-packages.json`.
 */
export type PackageVoltReadiness = {
	voltCompliant: boolean;
	consumersMigrated: boolean;
};

/**
 * Package → barrel path (`""` for root) → export name → recommended entry-point.
 */
export type EntryPointSymbolConfig = {
	/**
	 * Recommended subpath relative to the package name, e.g. `/box`.
	 * Omitted when no confident mapping exists yet.
	 */
	'entry-point'?: string;
	/**
	 * Set when `entry-point` exposes the symbol as its default export, meaning consumers
	 * must write `import Name from '<entry-point>'` rather than a named import. A barrel
	 * commonly renames a default (`export { default as Foo }`), so the import form at the
	 * barrel is not a reliable guide to the import form at the entry-point.
	 *
	 * Overrides that change `entry-point` must restate this; codegen validation fails on
	 * any mapping whose symbol is not reachable in the recorded form.
	 */
	isDefaultExport?: boolean;
	/**
	 * Name the entry-point exports the symbol under, when the barrel renamed it
	 * (`export { Props as TextFieldProps }`). Absent means the entry-point uses `name`.
	 */
	entryPointName?: string;
	/**
	 * Canonical local name (for default exports, the recommended binding name).
	 */
	name: string;
	type: 'component' | 'type' | 'value';
	/**
	 * Stage 1. When true, tooling may report and suggest rewriting barrel imports
	 * to `entry-point`. When false, tooling stays silent for this symbol.
	 *
	 * Package-level readiness is applied from the Volt preset (`voltCompliant`);
	 * permanent per-symbol exemptions are `voltCompliant: false` overrides.
	 */
	voltCompliant: boolean;
	/**
	 * Stage 2. When true, consumers have been migrated off deprecated barrel
	 * shims. Reserved for future lint severity (warn → error); not used for
	 * suggestion eligibility today.
	 */
	consumersMigrated: boolean;
};

/**
 * Package → barrel path (`""` for root) → export name → recommended entry-point.
 */
export type EntryPointConfig = {
	[packageName: string]: {
		[barrelPath: string]: {
			[exportName: string]: EntryPointSymbolConfig;
		};
	};
};

/**
 * Hand-authored patches merged over codegen output. Fields may be supplied
 * individually to tweak a generated symbol without restating it.
 */
export type EntryPointConfigOverrides = {
	[packageName: string]: {
		[barrelPath: string]: {
			[exportName: string]: Partial<EntryPointSymbolConfig>;
		};
	};
};
