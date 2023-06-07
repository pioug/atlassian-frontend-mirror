import { ESLintUtils } from '@typescript-eslint/utils';
import type { Rule } from 'eslint';

/**
 * We are moving to our own small abstraction to create a lint rule that we have the power
 * to change and mold to our own needs.
 *
 * @see createLintRule
 *
 * @private
 * @deprecated
 */
export const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://atlassian.design/components/eslint-plugin-design-system/usage#${name}`,
);

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
   */
  name: string;
  docs: {
    /**
     * Short description of what this rule does.
     */
    description: string;
    /**
     * Specifies the URL at which the full documentation can be accessed
     */
    url?: string | undefined;
    /**
     * If this rule should be in the recommended preset or not.
     * Set to `false` to exclude it from the recommended preset.
     */
    recommended: boolean;
    /**
     * The severity level to be applied to this rule.
     * When setting to `"error"` it will mean releasing a breaking change.
     */
    severity: 'error' | 'warn';
  };
}

/**
 * Tiny wrapped over the ESLint rule module type that ensures
 * there is a docs link to our ESLint plugin documentation page,
 * as well as improving type support.
 */
export const createLintRule = (rule: LintRule) => {
  const url = `https://atlassian.design/components/eslint-plugin-design-system/usage#${rule.meta.name}`;

  (rule.meta.docs as Record<string, unknown>).url = url;

  return rule as Rule.RuleModule;
};
