import type { Rule } from 'eslint';

export interface LintRule extends Omit<Rule.RuleModule, 'meta'> {
	/**
	 * Including this for backwards compat moving from the typescript-eslint util.
	 */
	name?: never;
	meta: LintRuleMeta;
}

export interface LintRuleMeta extends Omit<Rule.RuleMetaData, 'docs'> {
	/**
	 * Name of the rule.
	 * Must match the folder it is in exactly else build will throw.
	 * Add an exception in codegen.tsx for nested rules.
	 */
	name: string;
	docs: {
		/**
		 * Short description of what this rule does.
		 */
		description: string;
		/**
		 * Specifies the URL at which the full documentation can be accessed.
		 */
		url?: string | undefined;
		/**
		 * If this rule should be removed from all presets entirely (regardless of `recommended` setting).
		 * This rule will still show up in documentation, etc., just not in the preset configs.
		 */
		removeFromPresets?: true | never;
		/**
		 * If this rule should be in the recommended preset or not.
		 * Set to `false` to exclude it from the recommended preset.
		 */
		recommended?: boolean;
		/**
		 * The severity level to be applied to this rule.
		 * When setting to `"error"` it will mean releasing a breaking change.
		 */
		severity?: 'error' | 'warn';
		/**
		 * This is configuration passed into the plugin to configure the rule.
		 *
		 * Eg. `{ excludeReactComponents: true }` would be passed into the plugin config
		 */
		pluginConfig?: Record<string, any>;
	} & (
		| { removeFromPresets?: never; recommended: boolean; severity: 'error' | 'warn' }
		| { removeFromPresets: true; recommended?: never; severity?: never }
	);
}

/**
 * Tiny wrapped over the ESLint rule module type that ensures
 * there is a docs link to our ESLint plugin documentation page,
 * as well as improving type support.
 */
export const getCreateLintRule = (getRuleUrl: (ruleName: string) => string) => (rule: LintRule) => {
	(rule.meta.docs as Record<string, unknown>).url = getRuleUrl(rule.meta.name);

	return rule as Rule.RuleModule;
};

/**
 * If it's a nested rule, ensure the url is clean and safe for urls, file paths, etc.
 */
export function getPathSafeName(ruleName: string) {
	return ruleName.replace('/', '-');
}
