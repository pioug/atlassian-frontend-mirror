import { hasTableNode } from './hasTableNode';
import { isNotProse } from './isNotProse';
import type {
	PasteMenuRule,
	PasteMenuRuleContext,
	PasteMenuRuleFactories,
	PasteMenuRuleWithContext,
} from './types';

/**
 * Returns a rule that hides the paste-menu button when the pasted plain-text
 * is shorter than `minChars` characters.
 */
const minCharsRule =
	(minChars: number): PasteMenuRuleWithContext =>
	(context) =>
		context.getPlaintextLength() < minChars;

/**
 * A rule that hides the paste-menu button when the pasted content is plain
 * text (i.e. not rich-text / prose).
 */
const notProseRule: PasteMenuRuleWithContext = (context) => {
	// The pasted slice being empty or missing indicates plain-text paste.
	const slice = context.getPastedSlice();
	const pastedText = context.getPastedText();
	return slice === undefined && isNotProse(pastedText);
};

/**
 * A rule that hides the paste-menu button when the pasted content contains a
 * table node as an ancestor at the insertion point.
 */
const containsTableRule: PasteMenuRuleWithContext = (context) =>
	hasTableNode(context.getPastedSlice());

/**
 * Returns a rule that hides the paste-menu button when any of the provided
 * node names appear in the ancestor list at the insertion point.
 */
const excludedAncestorRule =
	(excludedNames: string[]): PasteMenuRuleWithContext =>
	(context) =>
		context.getAncestorNodeNames().some((name) => excludedNames.includes(name));

/**
 * Combines multiple context-aware rules with short-circuit evaluation.
 * Returns `true` (hidden) as soon as the first rule returns `true`; returns
 * `false` only when all rules return `false`.
 * Context is injected by `createPasteMenuRuleFactories` — callers never
 * construct or pass a context object.
 */
const allRules =
	(...rules: PasteMenuRuleWithContext[]): PasteMenuRuleWithContext =>
	(context) => {
		for (const rule of rules) {
			if (rule(context)) {
				return true;
			}
		}
		return false;
	};

/**
 * Binds a `PasteMenuRuleWithContext` to a context supplier, returning a
 * no-argument `PasteMenuRule` that re-reads the context on every invocation.
 */
const bind =
	(getContext: () => PasteMenuRuleContext, rule: PasteMenuRuleWithContext): PasteMenuRule =>
	() =>
		rule(getContext());

/**
 * Creates the `PasteMenuRuleFactories` object with every rule pre-bound to the
 * given context supplier.  Called inside `getPasteMenuRules()` so the plugin
 * API and paste state are already available in the closure — external callers
 * never need to construct or pass a context object.
 */
export const createPasteMenuRuleFactories = (
	getContext: () => PasteMenuRuleContext,
): PasteMenuRuleFactories => ({
	allRules: (...rules) => bind(getContext, allRules(...rules)),
	containsTableRule: bind(getContext, containsTableRule),
	excludedAncestorRule: (excludedNames) => bind(getContext, excludedAncestorRule(excludedNames)),
	minCharsRule: (minChars) => bind(getContext, minCharsRule(minChars)),
	notProseRule: bind(getContext, notProseRule),
});
