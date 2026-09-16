import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { akEditorSmallZIndex } from '@atlaskit/editor-shared-styles/constants';
import { token } from '@atlaskit/tokens';

export const CONTRIBUTOR_TAG_TESTID = 'diff-contributor-tag';
export const CONTRIBUTOR_TAG_NAME_TESTID = 'diff-contributor-tag-name';

/**
 * Ceiling for the tag width. A constant rather than the width of the change: a change is routinely a
 * word or two, and clamping to it ellipsised the contributor's name — the one thing the tag exists to
 * show. Longer names are ellipsised into the tooltip.
 */
export const MAX_TAG_WIDTH = '200px';

/**
 * The tag sits on the line above the change, so it has to paint over that line to be readable —
 * including any diff highlight already on it, which would otherwise slice straight through the tag.
 * It also has to paint above table interaction overlays and sticky-capable header rows, which use
 * `akEditorSmallZIndex`. The change's own highlight is stacked one level below it — see
 * `stackBelowContributorTagStyle` in `createInlineChangedDecoration`.
 *
 * Painting above its own highlight is only safe because the tag can never reach it: `bottom: 100%`
 * puts the root's bottom edge exactly on the highlight's top edge, and the root's `overflow: clip`
 * keeps every pixel the tag paints inside it.
 */
export const CONTRIBUTOR_TAG_Z_INDEX: number = akEditorSmallZIndex + 1;

/**
 * The plugin's whole side of the tag's motion: the fade and the hidden state are
 * `contributorTagStyles` in both EditorContentContainer stylesheets, keyed on this literal and the
 * one below — rename in step. This package cannot import `@atlaskit/editor-core` at runtime, so the
 * plugin emits the hook and editor-core owns the rule, as `VanillaTooltip` does with
 * `VANILLA_TOOLTIP_DEFAULT_CLASS`.
 */
export const CONTRIBUTOR_TAG_CLASS = 'ak-editor-diff-contributor-tag';

/** Toggled by the controller to move the tag between the fade's two ends. */
export const CONTRIBUTOR_TAG_REVEALED_ATTRIBUTE = 'data-revealed';

/**
 * Backstop for removing a fading-out tag: a cancelled transition fires no `transitionend`. Must stay
 * above the fade's 600ms, which lives in another package's stylesheet and cannot be read back as a
 * number — hence the wide margin. Raise in step with that duration.
 */
export const TAG_EXIT_FALLBACK_MS = 1200;

/**
 * The tooltip's look, inline rather than through `VANILLA_TOOLTIP_DEFAULT_CLASS`: this tooltip is
 * hoisted out of the tag, and that class's rule is scoped under `.ProseMirror` — see
 * `resolveTooltipContainer`. Otherwise `vanillaTooltipDefaultStyles` in editor-core, which is the
 * look every other vanilla tooltip has; keep the two in step.
 */
export const CONTRIBUTOR_TAG_TOOLTIP_STYLES: Readonly<Record<string, string>> = {
	boxSizing: 'border-box',
	maxWidth: '240px',
	backgroundColor: token('color.background.neutral.bold'),
	// A `popover` is given one by the UA stylesheet.
	border: 'none',
	borderRadius: token('radius.small', '3px'),
	color: token('color.text.inverse'),
	font: token('font.body.small'),
	fontFamily: token('font.family.body'),
	overflowWrap: 'break-word',
	paddingBlock: token('space.050', '4px'),
	paddingInline: token('space.075', '6px'),
	whiteSpace: 'normal',
	// A tooltip is never a hit target — it hangs over the document's own content.
	pointerEvents: 'none',
};

// Positioned against the host widget its decoration renders on the change's first character:
// `bottom: 100%` lifts the tag onto the line above, `inset-inline-start` starts it on that
// character.
const constraintStyle = convertToInlineCss({
	// `flex`, not `block`: a block box lays the tag on a line box whose strut is the *paragraph's*
	// line-height (~24px) against the tag's ~20px, so `bottom: 100%` pins that leftover strut to the
	// change and the tag floats above it. A flex container has no line box.
	display: 'flex',
	position: 'absolute',
	bottom: '100%',
	insetInlineStart: 0,
	// On the root, since that is the absolutely positioned box; the tag below fills it.
	maxWidth: MAX_TAG_WIDTH,
	minWidth: 0,
	// This box's bottom edge is the join with the highlight, and the tag paints *above* that
	// highlight — so anything spilling past this edge would read as the tag laid on top of the change
	// rather than attached to it. The reveal's `translateY` is exactly that spill: it starts the tag
	// 4px low, and clipping the part that hangs over the highlight turns the rise into an unfurl out
	// of the join. `clip`, not `hidden`: `hidden` would make this a scroll container, and focusing the
	// tag mid-reveal would scroll it 4px out of alignment for good.
	//
	// The tooltip is unaffected — it is a `popover`, so it paints in the top layer, which no
	// ancestor's clip reaches.
	overflow: 'clip',
	zIndex: CONTRIBUTOR_TAG_Z_INDEX,
	// It renders inside the document and it is not content: dragging a selection across the change
	// must not select it.
	userSelect: 'none',
});

// `backgroundColor` comes from the model, and is set by the controller. `opacity`, `pointer-events`
// and the transition between their two states are in `contributorTagStyles` — see
// `CONTRIBUTOR_TAG_CLASS`.
const tagStyle = convertToInlineCss({
	display: 'inline-flex',
	alignItems: 'center',
	gap: token('space.050'),
	// Never wider than `MAX_TAG_WIDTH` on the root; overflow is ellipsised on the name below.
	maxWidth: '100%',
	minWidth: 0,
	overflow: 'hidden',
	paddingInline: token('space.050'),
	paddingBlock: token('space.025'),
	// Top corners only: the bottom edge butts onto the change, and a rounded corner there would let
	// the page background through at the join.
	borderTopLeftRadius: token('radius.small'),
	borderTopRightRadius: token('radius.small'),
	borderBottomLeftRadius: 0,
	borderBottomRightRadius: 0,
	// Deliberately no bottom border: the change already carries the accent as its own underline, and
	// a second rule directly above it reads as two objects rather than one label on one change.
	//
	// Deliberately no `elevation.shadow.overlay`: its `0 8px 12px` offset casts downwards onto the
	// change, which reads as a gap between the tag and the content it captions.
	font: token('font.body.small'),
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
});

const avatarsStyle = convertToInlineCss({
	display: 'inline-flex',
	alignItems: 'center',
	flexShrink: 0,
});

const nameStyle = convertToInlineCss({
	display: 'block',
	minWidth: 0,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

/** `@atlaskit/visually-hidden`, inlined. */
const srLabelStyle = convertToInlineCss({
	width: '1px',
	height: '1px',
	padding: 0,
	position: 'absolute',
	border: 0,
	clip: 'rect(1px, 1px, 1px, 1px)',
	overflow: 'hidden',
	userSelect: 'none',
	whiteSpace: 'nowrap',
});

/**
 * Ids for the hidden label that the tag's `aria-labelledby` points at. Namespaced and random because
 * the tag renders inside the document and shares the host page's id space — the same reason
 * `VanillaTooltip` does it this way. The counter is a fallback for non-secure contexts, where
 * `crypto.randomUUID` is unavailable.
 */
const generateLabelId = (() => {
	let count = 0;
	return () =>
		typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
			? `${CONTRIBUTOR_TAG_CLASS}-label-${crypto.randomUUID()}`
			: `${CONTRIBUTOR_TAG_CLASS}-label-${(count += 1)}`;
})();

const createSpan = (
	doc: Document,
	style: string,
	attributes: Record<string, string> = {},
): HTMLSpanElement => {
	const span = doc.createElement('span');
	span.setAttribute('style', style);
	for (const [name, value] of Object.entries(attributes)) {
		span.setAttribute(name, value);
	}

	return span;
};

export type ContributorTagDom = {
	avatars: HTMLSpanElement;
	name: HTMLSpanElement;
	root: HTMLSpanElement;
	/**
	 * The tag's single announcement: it names the tag via `aria-labelledby` and is the only child
	 * left in the accessibility tree.
	 *
	 * `VanillaTooltip` appends its popover to the tag as well, so this is the last *content* child
	 * rather than the last node.
	 */
	srLabel: HTMLSpanElement;
	tag: HTMLSpanElement;
};

/**
 * The tag's markup, with no model applied — see `ContributorTagController`.
 *
 * Built element by element rather than through `DOMSerializer.renderSpec`, which returns `Node` and
 * would need a cast per reference below.
 *
 * `anchorName` is the `anchor-name` its block carries — see `createContributorTagWidget`.
 */
export const buildContributorTagDom = (doc: Document, anchorName?: string): ContributorTagDom => {
	const labelId = generateLabelId();
	const root = createSpan(doc, constraintStyle);
	if (anchorName) {
		// Anchored to the block's own box, so the tag clears whatever margin its node type has — the
		// same `anchor()` insets the `IndicatorBar` uses. A browser without anchor positioning rejects
		// these values and keeps the `bottom: 100%` fallback above.
		root.style.setProperty('bottom', `anchor(--${anchorName} top)`);
		root.style.setProperty('inset-inline-start', `anchor(--${anchorName} left)`);
	}
	const tag = createSpan(doc, tagStyle, {
		class: CONTRIBUTOR_TAG_CLASS,
		'data-testid': CONTRIBUTOR_TAG_TESTID,
		// Named by the hidden label rather than `aria-label`, which would be a second copy of the same
		// sentence. `role="note"` takes its name from the author, not its contents, so without this
		// the tag is a focus stop with no accessible name.
		'aria-labelledby': labelId,
		role: 'note',
		// Focusable so keyboard and screen-reader users can reach the tag and its tooltip. Its focus
		// ring is drawn inward — see `contributorTagStyles` in editor-core.
		tabindex: '0',
	});
	const avatars = createSpan(doc, avatarsStyle);
	// `aria-hidden`: the hidden label restates this name in a full sentence, so leaving it in the
	// tree announced the contributor twice ("Priya Changed by Priya").
	const name = createSpan(doc, nameStyle, {
		'aria-hidden': 'true',
		'data-testid': CONTRIBUTOR_TAG_NAME_TESTID,
	});
	const srLabel = createSpan(doc, srLabelStyle, { id: labelId });

	tag.append(avatars, name, srLabel);
	root.appendChild(tag);

	return { avatars, name, root, srLabel, tag };
};
