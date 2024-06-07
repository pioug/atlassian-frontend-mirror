export type Domains = ('color' | 'spacing' | 'shape')[];

export type RuleConfig = {
	domains: Domains;
	applyImport?: boolean;
	shouldEnforceFallbacks: boolean;
	/**
	 * List of exceptions that can be configured for the rule to always ignore.
	 */
	exceptions?: string[];
	failSilently?: boolean;
};
