import type { Slice } from '@atlaskit/editor-prosemirror/model';

/**
 * Context object passed to each `PasteMenuRule`.
 * Provides lazy accessors over the current paste state so that rule
 * implementations remain decoupled from the plugin's internal state shape.
 */
export interface PasteMenuRuleContext {
	/**
	 * Returns the names of ancestor nodes at the paste insertion point
	 * (e.g. `['table', 'tableRow', 'tableCell']`).
	 */
	getAncestorNodeNames: () => string[];

	/**
	 * Returns the set of ProseMirror node-type names present in the pasted
	 * content (derived from the rich-text slice).
	 */
	getNodeTypes: () => string[];

	/** Returns the rich-text `Slice` that was pasted, if available. */
	getPastedSlice: () => Slice | undefined;

	/** Returns the raw pasted text content. */
	getPastedText: () => string;

	/**
	 * Returns the paste source identifier, e.g. `'external'`, `'internal'`,
	 * `'markdown'`, etc.  Returns `undefined` when the source is unknown.
	 */
	getPasteSource: () => string | undefined;

	/** Returns the character length of the pasted plain-text string. */
	getPlaintextLength: () => number;
}

/**
 * Internal rule function that receives an explicit context object.
 * Used only within this package — external callers see `PasteMenuRule`.
 */
export type PasteMenuRuleWithContext = (context: PasteMenuRuleContext) => boolean;

/**
 * A rule function returned by `getPasteMenuRules()`.  The context is already
 * bound by the plugin, so callers simply invoke it with no arguments.
 */
export type PasteMenuRule = () => boolean;

/**
 * The collection of rule factories exposed via the plugin API.
 * External plugins consume this object through
 * `api?.pasteOptionsToolbarPlugin?.actions.getPasteMenuRules()`.
 * Every rule already has the paste context pre-bound — callers do not need to
 * construct or pass a context object.
 */
export interface PasteMenuRuleFactories {
	/**
	 * Combines multiple rules with short-circuit evaluation: returns `true`
	 * (hidden) as soon as the first rule returns `true`.
	 */
	allRules: (...rules: PasteMenuRuleWithContext[]) => PasteMenuRule;

	/**
	 * A rule that hides the button when the pasted content contains a table
	 * node as an ancestor at the insertion point.
	 */
	containsTableRule: PasteMenuRule;

	/**
	 * Returns a rule that hides the button when any of the specified node
	 * names appear in the ancestor list at the insertion point.
	 */
	excludedAncestorRule: (excludedNames: string[]) => PasteMenuRule;

	/**
	 * A rule that hides the button when the pasted content contains more than
	 * one node type.
	 */
	hideIfMixedNodesRule: PasteMenuRule;

	/**
	 * A rule that hides the button when the pasted content contains only a
	 * single node type.
	 */
	hideIfSingleNodeRule: PasteMenuRule;

	/**
	 * A rule that hides the button when the pasted content IS a single
	 * standalone link (the inverse of `notSingleLinkRule`).
	 *
	 * Use this to hide buttons that should NOT appear for single-link pastes,
	 * e.g. Improve Writing, Fix Spelling — leaving only Ask Rovo visible.
	 */
	isSingleLinkRule: PasteMenuRule;

	/**
	 * Returns a rule that hides the button when the pasted plain-text is
	 * longer than `maxChars` characters.
	 */
	maxCharsRule: (maxChars: number) => PasteMenuRule;

	/**
	 * Returns a rule that hides the button when the pasted plain-text is
	 * shorter than `minChars` characters.
	 */
	minCharsRule: (minChars: number) => PasteMenuRule;

	/**
	 * A rule that hides the button when the paste source is NOT an external
	 * application (i.e. the content was pasted from within the Fabric editor
	 * or renderer rather than from a third-party source).
	 */
	notExternalPasteRule: PasteMenuRule;

	/**
	 * A rule that hides the button when the pasted content is plain text
	 * (i.e. not rich-text / prose).
	 */
	notProseRule: PasteMenuRule;

	/**
	 * A rule that hides the button when the pasted content is a single
	 * standalone link — i.e. a bare URL link (text equals href) alone in a
	 * paragraph, or a single inline card (smartlink) alone in a paragraph.
	 *
	 * Returns `true` (hidden) when the paste is NOT a single link — e.g. a
	 * link with a custom label, a link with sibling text or nodes, or
	 * multiple paragraphs.
	 */
	notSingleLinkRule: PasteMenuRule;
}
