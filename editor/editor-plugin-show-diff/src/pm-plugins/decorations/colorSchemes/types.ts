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

/** A public scheme or an attribution participant slot resolved internally for one change. */
export type ColorScheme = PublicColorScheme | AdsAccentColor;

/**
 * A show-diff colour scheme. Colour fields are ADS hues that `factory.ts` expands into token paths;
 * the rest encode structural differences no colour can express. Ring widths, padding, radius and
 * pointer-events are fixed in the factory, not per scheme.
 */
export type DiffColorScheme = {
	/** Stacking order of the square added-cell overlay. The rounded variant is always 2. */
	addedCellOverlayZIndex: 1 | 2;
	/** Deleted inline content, active/focused state. */
	deleteActiveColor: AdsAccentColor;
	/** Deleted inline content. */
	deleteColor: AdsAccentColor;
	/** Active deleted-block ring: pale `background.accent.*.subtler.pressed` vs saturated `border.accent.*`. */
	deletedBlockOutlineActiveEmphasis: 'background' | 'border';
	/** Deleted cell outline: `color.border.disabled` hairline vs opaque accent border. */
	deletedCellBorderProminence: 'subtle' | 'accent';
	/** Deleted cell overlays. Gray in both current schemes. */
	deletedCellColor: AdsAccentColor;
	/** Opacity of the deleted cell overlay background. Counterpart to `insertedCellOpacity`. */
	deletedCellOpacity: number;
	/** Bottom border tone for deleted text highlights. Defaults to accent. */
	deletedInlineBorderTone?: 'accent' | 'background';
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
	deleteTextColor?: AdsAccentColor;
	/** Inserted content, active/focused state. */
	insertActiveColor: AdsAccentColor;
	/** Inserted content, default state. */
	insertColor: AdsAccentColor;
	/** Opacity of the inserted cell overlay background. */
	insertedCellOpacity: number;
	/** Bottom border tone for inserted text highlights. Defaults to accent. */
	insertedInlineBorderTone?: 'accent' | 'backgroundHovered';
	/** Inserted content under the extended experience: underline, or a border-bottom rule with padding. */
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
