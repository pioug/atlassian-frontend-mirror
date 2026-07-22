/**
 * Human-readable renderer for the `lint-rules` payload.
 *
 * `getLintRulesTool` returns one record per matching ESLint rule, each with a `content` field
 * that is already Markdown documentation for the rule. The default output prints that Markdown
 * verbatim (joined across multiple rules) rather than dumping the raw JSON. Full structured data
 * remains available via `--json`.
 */

import { type LintRule, parseLintRuleRecords } from './parse-lint-rule-records';

/**
 * True when a value looks like a lint-rule record (an object carrying at least one known field).
 */
const isLintRuleRecord = (rule: unknown): rule is LintRule =>
	rule !== null &&
	typeof rule === 'object' &&
	('content' in rule || 'ruleName' in rule || 'description' in rule);

/**
 * Render a single rule: prefer its Markdown `content`; fall back to `ruleName` + `description`
 * when no content is present.
 */
const formatRule = (rule: LintRule): string => {
	if (typeof rule.content === 'string' && rule.content.trim()) {
		return rule.content.trim();
	}
	const name = rule.ruleName ?? '(unknown rule)';
	return rule.description ? `# ${name}\n\n${rule.description}` : `# ${name}`;
};

/**
 * Render the lint-rules payload as readable Markdown. Handles both the array form (multiple
 * matching rules) and the single-object form. Returns `null` for unrecognised shapes so the
 * caller can fall back to generic rendering.
 */
export const formatLintRules = (data: unknown): string | null => {
	const rules = parseLintRuleRecords(data);

	if (rules.length === 0 || !rules.every(isLintRuleRecord)) {
		return null;
	}

	// Separate multiple rules with a horizontal rule so they read as distinct docs.
	return rules.map(formatRule).join('\n\n---\n\n');
};
