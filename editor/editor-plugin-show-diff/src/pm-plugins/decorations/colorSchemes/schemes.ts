import { agentBrandColorSchemes } from '@atlaskit/agent-color/agent-brand-color-schemes';
import type { AgentBrandColorScheme } from '@atlaskit/agent-color/agent-presence-color-types';

import {
	PARTICIPANT_COLOR_SCHEMES,
	type AccentColor,
	type AdsAccentColor,
	type ColorScheme,
	type DiffColorScheme,
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
	deletedInlineHighlight: 'always',
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
	deletedInlineHighlight: 'always',
	insertedNodeEmphasis: 'static',
	deletedNodeEmphasis: 'static',
	deletedQuoteNodeActiveTone: 'borderAccent',
	strikesDeletedEmbedCard: false,
};

const createAttributionScheme = (
	color: AccentColor,
	blendInlineHighlight = false,
): DiffColorScheme => {
	return {
		...standardScheme,
		blendInlineHighlight,
		insertColor: color,
		insertActiveColor: color,
		deleteColor: color,
		deletedInlineBorderTone: 'background',
		// Like the public schemes, the highlight holds its resting tint when active.
		deletedInlineActiveEmphasis: 'underline',
		// The contributor's own hue, so deleted text reads as theirs without a highlight behind it.
		deleteTextColor: color,
		deletedInlineHighlight: 'onEmphasis',
		deleteActiveColor: color,
		deletedCellColor: color,
	};
};

const attributionColorSchemes = Object.fromEntries(
	PARTICIPANT_COLOR_SCHEMES.map((color) => [color, createAttributionScheme(color, true)]),
) as Record<AdsAccentColor, DiffColorScheme>;

const brandSchemes = Object.fromEntries(
	(Object.keys(agentBrandColorSchemes) as AgentBrandColorScheme[]).map((scheme) => [
		scheme,
		createAttributionScheme(scheme),
	]),
) as Record<AgentBrandColorScheme, DiffColorScheme>;

/** Maps public schemes and attribution-only participant slots to their data objects. */
export const colorSchemeRegistry: Record<ColorScheme, DiffColorScheme> = {
	...attributionColorSchemes,
	...brandSchemes,
	traditional: traditionalScheme,
	standard: standardScheme,
};
