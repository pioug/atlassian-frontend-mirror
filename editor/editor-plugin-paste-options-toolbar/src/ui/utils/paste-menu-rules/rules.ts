import { hasMixedNodes } from './hasMixedNodes';
import { hasTableNode } from './hasTableNode';
import { isNotProse } from './isNotProse';
import { isNotSingleLink } from './isNotSingleLink';
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
 * Returns a rule that hides the paste-menu button when the pasted plain-text
 * is longer than `maxChars` characters.
 */
const maxCharsRule =
	(maxChars: number): PasteMenuRuleWithContext =>
	(context) =>
		context.getPlaintextLength() > maxChars;

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
 * Returns a rule that hides the paste-menu button when the pasted content contains
 * more than one node type (e.g. a mix of paragraphs and headings, or a table
 * with multiple cell types).
 */
const hideIfMixedNodesRule: PasteMenuRuleWithContext = (context) => {
	const slice = context.getPastedSlice();
	if (!slice) {
		return false;
	}
	return hasMixedNodes(slice);
};

/**
 * Returns a rule that hides the paste-menu button when the pasted content contains
 * only a single node type (e.g. a single paragraph, or a table with only one cell type).
 * This is the inverse of `hideIfMixedNodesRule` and can be used in combination with it
 * to target pastes that contain either exactly one node type or more than one node type.
 */
const hideIfSingleNodeRule: PasteMenuRuleWithContext = (context) => {
	const slice = context.getPastedSlice();
	if (!slice) {
		return false;
	}
	return !hasMixedNodes(slice);
};

/**
 * A rule that hides the paste-menu button when the paste source is NOT an
 * external application (i.e. the content was pasted from within the Fabric
 * editor or renderer rather than from a third-party source).
 */
const notExternalPasteRule: PasteMenuRuleWithContext = (context) => {
	const source = context.getPasteSource();
	return source === 'fabric-editor' || source === 'fabric-renderer';
};

/**
 * A rule that hides the paste-menu button when the pasted content is a single
 * standalone link — i.e. a bare URL link (text equals href) alone in a
 * paragraph, or a single inline card (smartlink) alone in a paragraph.
 *
 * Returns `true` (hidden) when the paste is NOT a single link — e.g. a link
 * with a custom label, a link accompanied by other text or sibling nodes, or
 * multiple paragraphs.
 */
const notSingleLinkRule: PasteMenuRuleWithContext = (context) =>
	isNotSingleLink(context.getPastedSlice());

/**
 * A rule that hides the paste-menu button when the pasted content IS a single
 * standalone link (the inverse of `notSingleLinkRule`).
 *
 * Use this to suppress buttons (e.g. Improve Writing, Fix Spelling) that
 * should not appear for single-link pastes.
 */
const isSingleLinkRule: PasteMenuRuleWithContext = (context) =>
	!isNotSingleLink(context.getPastedSlice());

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
	hideIfMixedNodesRule: bind(getContext, hideIfMixedNodesRule),
	hideIfSingleNodeRule: bind(getContext, hideIfSingleNodeRule),
	isSingleLinkRule: bind(getContext, isSingleLinkRule),
	maxCharsRule: (maxChars) => bind(getContext, maxCharsRule(maxChars)),
	minCharsRule: (minChars) => bind(getContext, minCharsRule(minChars)),
	notExternalPasteRule: bind(getContext, notExternalPasteRule),
	notProseRule: bind(getContext, notProseRule),
	notSingleLinkRule: bind(getContext, notSingleLinkRule),
});
