import type { AgentBrandColorScheme } from '@atlaskit/agent-color/agent-presence-color-types';

/** Schemes consumers may explicitly request through the show-diff API. */
export type PublicColorScheme = 'standard' | 'traditional';

/** Attribution-only participant slots selected by the plugin, never by consumers. */
export const PARTICIPANT_COLOR_SCHEMES = [
	'red',
	'blue',
	'green',
	'yellow',
	'purple',
	'magenta',
	'teal',
	'orange',
	'lime',
	'gray',
] as const;

/** ADS accent hues used by the public and participant colour schemes. */
export type AdsAccentColor = (typeof PARTICIPANT_COLOR_SCHEMES)[number];

export type AccentColor = AdsAccentColor | AgentBrandColorScheme;
export type ColorScheme = PublicColorScheme | AccentColor;

/**
 * A show-diff colour scheme. Colour fields are ADS hues that `factory.ts` expands into token paths;
 * the rest encode structural differences no colour can express. Ring widths, padding, radius and
 * pointer-events are fixed in the factory, not per scheme.
 */
export type DiffColorScheme = {
	/** Stacking order of the square added-cell overlay. The rounded variant is always 2. */
	addedCellOverlayZIndex: 1 | 2;
	/** Deleted inline content, active/focused state. */
	deleteActiveColor: AccentColor;
	/** Deleted inline content. */
	deleteColor: AccentColor;
	/** Active deleted-block ring: pale `background.accent.*.subtler.pressed` vs saturated `border.accent.*`. */
	deletedBlockOutlineActiveEmphasis: 'background' | 'border';
	/** Deleted cell outline: `color.border.disabled` hairline vs opaque accent border. */
	deletedCellBorderProminence: 'subtle' | 'accent';
	/** Deleted cell overlays. Gray in both current schemes. */
	deletedCellColor: AccentColor;
	/** Opacity of the deleted cell overlay background. Counterpart to `insertedCellOpacity`. */
	deletedCellOpacity: number;
	/**
	 * Emphasised deleted text — hovered or active: deepen the highlight, or hold the resting tint and
	 * darken the bottom border instead. Defaults to 'background'. Only the attribution schemes take
	 * 'underline', so it reaches no one outside their gates.
	 */
	deletedInlineActiveEmphasis?: 'background' | 'underline';
	/** Bottom border tone for deleted text highlights. Defaults to accent. */
	deletedInlineBorderTone?: 'accent' | 'background';
	/**
	 * Deleted text highlight: painted at rest, or only once the change is active or hovered. See
	 * `DELETED_HIGHLIGHT_BG_VAR` for how 'onEmphasis' resolves the hovered half.
	 */
	deletedInlineHighlight: 'always' | 'onEmphasis';
	/** Deleted inline content: tint the strikethrough, or tint and dim the glyph itself. */
	deletedInlineTreatment: 'strikethrough' | 'glyphTint';
	/** Resting "REMOVED" lozenge tint. Gray in both current schemes; the active state uses `deleteActiveColor`. */
	deletedLozengeColor: AdsAccentColor;
	/**
	 * "REMOVED" lozenge label, in both states: a fixed inverse tone that reads on any tint, or the
	 * accent text colour matching `deletedLozengeColor`.
	 */
	deletedLozengeTextTone: 'inverse' | 'accent';
	/**
	 * Resting ring colour for a deleted media/embed card under the a11y-fixes treatment. Its own role
	 * rather than a derivation of `deleteColor`: that treatment rings red even for gray deletes.
	 */
	deletedMediaRingColor: AdsAccentColor;
	/** Deleted block ring: 4px stateful ring plus marker variables, or one resting treatment. */
	deletedNodeEmphasis: 'stateful' | 'static';
	/** Active deleted-blockquote ring tone, for the nodeview-wrapped case only. */
	deletedQuoteNodeActiveTone: 'backgroundPressed' | 'borderAccent';
	/** Deleted blockquote default state: 1px ring with padding, or a 2px left border. Active is always a ring. */
	deletedQuoteNodeShape: 'ring' | 'borderLeft';
	/** Deleted row de-emphasis: tint the line-through, or tint the row text. Both read `deleteColor`. */
	deletedRowTreatment: 'strikeColor' | 'textTint';
	/** Optional text and strikethrough hue, independent of deletion borders. */
	deleteTextColor?: AccentColor;
	/** Inserted content, active/focused state. */
	insertActiveColor: AccentColor;
	/** Inserted content, default state. */
	insertColor: AccentColor;
	/** Opacity of the inserted cell overlay background. */
	insertedCellOpacity: number;
	/** Bottom border tone for inserted text highlights. Defaults to accent. */
	insertedInlineBorderTone?: 'accent' | 'backgroundHovered';
	/** Inserted content: underline, or a border-bottom rule with padding. */
	insertedInlineTreatment: 'underline' | 'borderBottom';
	/** Inserted block ring: 4px stateful ring, or one static 1px accent ring. */
	insertedNodeEmphasis: 'stateful' | 'static';
	/** `text-decoration-style` for the inserted-text underline. */
	insertUnderlineStyle: 'solid' | 'dotted';
	/** Whether the rounded added-cell overlay inherits the cell's `border`. Deleted always does. */
	roundedAddedCellOverlayInheritsBorder: boolean;
	/** Whether a deleted embedCard gets a strike at all. Standard draws none. */
	strikesDeletedEmbedCard: boolean;
};
