/**
 * Shared parser for the `get-lint-rules` payload.
 *
 * `getLintRulesTool` double-encodes its rule records: each is a JSON *string literal* (a bare
 * string for a single match, or an array of such strings for multiple matches), so the generic
 * unwrap yields a value that still looks like JSON. This module undoes that second layer so both
 * the human renderer (`format-lint-rules`) and the `lint-rules` command's disambiguation logic
 * work against real rule objects rather than raw strings.
 */

/**
 * A single lint-rule record as returned by `getLintRulesTool`. Only the fields the CLI needs are
 * modelled.
 */
export type LintRule = {
	ruleName?: string;
	description?: string;
	content?: string;
};

/**
 * Parse a value that may be a JSON string literal into its underlying object/array, leaving
 * non-JSON strings (and non-strings) untouched.
 */
const parseIfJsonString = (value: unknown): unknown => {
	if (typeof value === 'string' && /^\s*[[{]/.test(value)) {
		try {
			return JSON.parse(value);
		} catch {
			// Leave as-is; callers guard the resulting shape.
		}
	}
	return value;
};

/**
 * Parse the get-lint-rules payload into rule records, undoing the double-encoded JSON layer.
 *
 * For a single match `data` is one JSON string literal; for multiple matches it is an array whose
 * elements are each a JSON string literal — so parse both the top-level value and every array
 * element. Elements that are not JSON strings are left untouched (callers guard the shape).
 */
export const parseLintRuleRecords = (data: unknown): LintRule[] => {
	const normalised = parseIfJsonString(data);
	return Array.isArray(normalised)
		? (normalised.map(parseIfJsonString) as LintRule[])
		: [normalised as LintRule];
};
