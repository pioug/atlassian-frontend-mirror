import {
	PARTICIPANT_COLOR_SCHEMES,
	type AdsAccentColor,
	type ColorScheme,
	type DiffColorScheme,
	type PublicColorScheme,
} from './types';

/** Green insertions, red deletions. */
export const traditionalScheme: DiffColorScheme = {
	insertColor: 'green',
	insertUnderlineStyle: 'solid',
	insertActiveColor: 'green',
	deleteColor: 'red',
	deleteActiveColor: 'red',
	deletedCellColor: 'gray',
	deletedCellOpacity: 0.5,
	deletedLozengeColor: 'gray',
	deletedLozengeTextTone: 'inverse',
	deletedMediaRingColor: 'red',
	deletedRowTreatment: 'strikeColor',
	insertedCellOpacity: 0.5,
	deletedQuoteNodeShape: 'ring',
	deletedCellBorderProminence: 'subtle',
	deletedBlockOutlineActiveEmphasis: 'background',
	addedCellOverlayZIndex: 1,
	roundedAddedCellOverlayInheritsBorder: true,
	insertedInlineTreatment: 'underline',
	deletedInlineTreatment: 'strikethrough',
	insertedNodeEmphasis: 'stateful',
	deletedNodeEmphasis: 'stateful',
	deletedQuoteNodeActiveTone: 'backgroundPressed',
	strikesDeletedEmbedCard: true,
};

/** Purple insertions, gray deletions (red on active). */
export const standardScheme: DiffColorScheme = {
	insertColor: 'purple',
	insertUnderlineStyle: 'dotted',
	insertActiveColor: 'purple',
	deleteColor: 'gray',
	deleteActiveColor: 'red',
	deletedCellColor: 'gray',
	deletedCellOpacity: 0.5,
	deletedLozengeColor: 'gray',
	deletedLozengeTextTone: 'inverse',
	// Red, not `deleteColor`'s gray: a11y-fixes rings deleted media red in both schemes.
	deletedMediaRingColor: 'red',
	deletedRowTreatment: 'textTint',
	insertedCellOpacity: 0.2,
	deletedQuoteNodeShape: 'borderLeft',
	deletedCellBorderProminence: 'accent',
	deletedBlockOutlineActiveEmphasis: 'border',
	addedCellOverlayZIndex: 2,
	roundedAddedCellOverlayInheritsBorder: false,
	insertedInlineTreatment: 'borderBottom',
	deletedInlineTreatment: 'glyphTint',
	insertedNodeEmphasis: 'static',
	deletedNodeEmphasis: 'static',
	deletedQuoteNodeActiveTone: 'borderAccent',
	strikesDeletedEmbedCard: false,
};

const createAttributionScheme = (color: AdsAccentColor): DiffColorScheme => {
	return {
		...standardScheme,
		insertColor: color,
		insertedInlineBorderTone: 'backgroundHovered',
		insertActiveColor: color,
		deleteColor: color,
		deletedInlineBorderTone: 'background',
		deleteTextColor: 'gray',
		deleteActiveColor: color,
		deletedCellColor: color,
	};
};

const attributionColorSchemes = Object.fromEntries(
	PARTICIPANT_COLOR_SCHEMES.map((color) => [color, createAttributionScheme(color)]),
) as Record<AdsAccentColor, DiffColorScheme>;

/** Maps public schemes and attribution-only participant slots to their data objects. */
export const colorSchemeRegistry: Record<ColorScheme, DiffColorScheme> = {
	...attributionColorSchemes,
	traditional: traditionalScheme,
	standard: standardScheme,
};

/** Attribution accents are impossible in the refactor-off cohort; fall back defensively. */
export const getLegacyColorScheme = (
	colorScheme: ColorScheme | undefined,
): PublicColorScheme | undefined =>
	colorScheme === 'standard' || colorScheme === 'traditional' ? colorScheme : undefined;
