import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { token } from '@atlaskit/tokens';

import type { AdsAccentColor, DiffColorScheme } from './types';
import { getStandardDeletedTextDecorationStyle } from './getStandardDeletedTextDecorationStyle';

// token() is a build-time transform needing static literals, so pre-compute every colour's
// tokens here and index by name at runtime.

const bgSubtlestMap: Record<AdsAccentColor, string> = {
	green: token('color.background.accent.green.subtlest'),
	teal: token('color.background.accent.teal.subtlest'),
	blue: token('color.background.accent.blue.subtlest'),
	purple: token('color.background.accent.purple.subtlest'),
	red: token('color.background.accent.red.subtlest'),
	orange: token('color.background.accent.orange.subtlest'),
	yellow: token('color.background.accent.yellow.subtlest'),
	magenta: token('color.background.accent.magenta.subtlest'),
	gray: token('color.background.accent.gray.subtlest'),
	lime: token('color.background.accent.lime.subtlest'),
};

const bgSubtlestHoveredMap: Record<AdsAccentColor, string> = {
	green: token('color.background.accent.green.subtlest.hovered'),
	teal: token('color.background.accent.teal.subtlest.hovered'),
	blue: token('color.background.accent.blue.subtlest.hovered'),
	purple: token('color.background.accent.purple.subtlest.hovered'),
	red: token('color.background.accent.red.subtlest.hovered'),
	orange: token('color.background.accent.orange.subtlest.hovered'),
	yellow: token('color.background.accent.yellow.subtlest.hovered'),
	magenta: token('color.background.accent.magenta.subtlest.hovered'),
	gray: token('color.background.accent.gray.subtlest.hovered'),
	lime: token('color.background.accent.lime.subtlest.hovered'),
};

const bgSubtlestPressedMap: Record<AdsAccentColor, string> = {
	green: token('color.background.accent.green.subtlest.pressed'),
	teal: token('color.background.accent.teal.subtlest.pressed'),
	blue: token('color.background.accent.blue.subtlest.pressed'),
	purple: token('color.background.accent.purple.subtlest.pressed'),
	red: token('color.background.accent.red.subtlest.pressed'),
	orange: token('color.background.accent.orange.subtlest.pressed'),
	yellow: token('color.background.accent.yellow.subtlest.pressed'),
	magenta: token('color.background.accent.magenta.subtlest.pressed'),
	gray: token('color.background.accent.gray.subtlest.pressed'),
	lime: token('color.background.accent.lime.subtlest.pressed'),
};

const bgSubtlerMap: Record<AdsAccentColor, string> = {
	green: token('color.background.accent.green.subtler'),
	teal: token('color.background.accent.teal.subtler'),
	blue: token('color.background.accent.blue.subtler'),
	purple: token('color.background.accent.purple.subtler'),
	red: token('color.background.accent.red.subtler'),
	orange: token('color.background.accent.orange.subtler'),
	yellow: token('color.background.accent.yellow.subtler'),
	magenta: token('color.background.accent.magenta.subtler'),
	gray: token('color.background.accent.gray.subtler'),
	lime: token('color.background.accent.lime.subtler'),
};

const bgSubtlerPressedMap: Record<AdsAccentColor, string> = {
	green: token('color.background.accent.green.subtler.pressed'),
	teal: token('color.background.accent.teal.subtler.pressed'),
	blue: token('color.background.accent.blue.subtler.pressed'),
	purple: token('color.background.accent.purple.subtler.pressed'),
	red: token('color.background.accent.red.subtler.pressed'),
	orange: token('color.background.accent.orange.subtler.pressed'),
	yellow: token('color.background.accent.yellow.subtler.pressed'),
	magenta: token('color.background.accent.magenta.subtler.pressed'),
	gray: token('color.background.accent.gray.subtler.pressed'),
	lime: token('color.background.accent.lime.subtler.pressed'),
};

const bgBolderMap: Record<AdsAccentColor, string> = {
	green: token('color.background.accent.green.bolder'),
	teal: token('color.background.accent.teal.bolder'),
	blue: token('color.background.accent.blue.bolder'),
	purple: token('color.background.accent.purple.bolder'),
	red: token('color.background.accent.red.bolder'),
	orange: token('color.background.accent.orange.bolder'),
	yellow: token('color.background.accent.yellow.bolder'),
	magenta: token('color.background.accent.magenta.bolder'),
	gray: token('color.background.accent.gray.bolder'),
	lime: token('color.background.accent.lime.bolder'),
};

const borderAccentMap: Record<AdsAccentColor, string> = {
	green: token('color.border.accent.green'),
	teal: token('color.border.accent.teal'),
	blue: token('color.border.accent.blue'),
	purple: token('color.border.accent.purple'),
	red: token('color.border.accent.red'),
	orange: token('color.border.accent.orange'),
	yellow: token('color.border.accent.yellow'),
	magenta: token('color.border.accent.magenta'),
	gray: token('color.border.accent.gray'),
	lime: token('color.border.accent.lime'),
};

const textAccentMap: Record<AdsAccentColor, string> = {
	green: token('color.text.accent.green'),
	teal: token('color.text.accent.teal'),
	blue: token('color.text.accent.blue'),
	purple: token('color.text.accent.purple'),
	red: token('color.text.accent.red'),
	orange: token('color.text.accent.orange'),
	yellow: token('color.text.accent.yellow'),
	magenta: token('color.text.accent.magenta'),
	gray: token('color.text.accent.gray'),
	lime: token('color.text.accent.lime'),
};

function bgSubtlest(color: AdsAccentColor): string {
	return bgSubtlestMap[color];
}

function bgSubtlestPressed(color: AdsAccentColor): string {
	return bgSubtlestPressedMap[color];
}

function bgSubtler(color: AdsAccentColor): string {
	return bgSubtlerMap[color];
}

function bgBolder(color: AdsAccentColor): string {
	return bgBolderMap[color];
}

function bgSubtlerPressed(color: AdsAccentColor): string {
	return bgSubtlerPressedMap[color];
}

function borderAccent(color: AdsAccentColor): string {
	return borderAccentMap[color];
}

function textAccent(color: AdsAccentColor): string {
	return textAccentMap[color];
}

/**
 * Presentation tokens for a contributor tag in one diff colour.
 *
 * A `bolder` fill rather than the `subtlest` tint the highlight uses: the tag is a label on the
 * change, and at tag size a tint reads as a second, weaker highlight sitting above the real one.
 * `inverse` is the only text tone that reads on a bolder fill, and it needs no per-colour map —
 * which is also why the tag carries no border: the fill alone bounds it.
 */
export function getAccentTokens(color: AdsAccentColor): {
	background: string;
	text: string;
} {
	return {
		background: bgBolder(color),
		text: token('color.text.inverse'),
	};
}

/** Ring colour for an active (scroll-target) deleted block outline. */
function deletedBlockOutlineActiveRing(colors: DiffColorScheme): string {
	return colors.deletedBlockOutlineActiveEmphasis === 'border'
		? borderAccent(colors.deleteActiveColor)
		: bgSubtlerPressed(colors.deleteActiveColor);
}

/** Outline colour for deleted table-cell overlays. */
function deletedCellOutline(colors: DiffColorScheme): string {
	return colors.deletedCellBorderProminence === 'subtle'
		? token('color.border.disabled')
		: borderAccent(colors.deletedCellColor);
}

// --- Inserted content styles ---

function insertedInlineBorderColor(colors: DiffColorScheme): string {
	return colors.insertedInlineBorderTone === 'backgroundHovered'
		? bgSubtlestHoveredMap[colors.insertColor]
		: borderAccent(colors.insertColor);
}

/** Inline inserted content — default state. */
export function buildInsertStyle(colors: DiffColorScheme): string {
	return convertToInlineCss({
		background: bgSubtlest(colors.insertColor),
		textDecoration: 'underline',
		textDecorationStyle: colors.insertUnderlineStyle,
		textDecorationThickness: token('space.025'),
		textDecorationColor: borderAccent(colors.insertColor),
	});
}

/** Inline insert style for content within a block node (no background, underline only). */
export function buildInsertStyleInBlock(colors: DiffColorScheme): string {
	return convertToInlineCss({
		textDecoration: 'underline',
		textDecorationStyle: colors.insertUnderlineStyle,
		textDecorationThickness: token('space.025'),
		textDecorationColor: borderAccent(colors.insertColor),
	});
}

/** Extended insert style — background + border-bottom underline. */
export function buildInsertStyleExtended(colors: DiffColorScheme): string {
	return convertToInlineCss({
		background: bgSubtlest(colors.insertColor),
		borderBottom: `2px solid ${insertedInlineBorderColor(colors)}`,
		padding: `1px 0 2px`,
	});
}

/** Extended insert style for content within a block node (border-bottom only, no background). */
export function buildInsertStyleInBlockExtended(colors: DiffColorScheme): string {
	return convertToInlineCss({
		borderBottom: `2px solid ${insertedInlineBorderColor(colors)}`,
		padding: `1px 0 2px`,
	});
}

/** Active state of the extended insert style. */
export function buildInsertStyleExtendedActive(colors: DiffColorScheme): string {
	return convertToInlineCss({
		background: bgSubtlerPressed(colors.insertActiveColor),
		borderBottom: `2px solid ${borderAccent(colors.insertColor)}`,
		padding: `1px 0 2px`,
	});
}

/** Extended insert style without underline — background + padding only. */
export function buildInsertStyleExtendedNoUnderline(colors: DiffColorScheme): string {
	return convertToInlineCss({
		background: bgSubtlest(colors.insertColor),
		padding: `1px 0 2px`,
	});
}

/** Active state of the no-underline extended insert style. */
export function buildInsertStyleExtendedNoUnderlineActive(colors: DiffColorScheme): string {
	return convertToInlineCss({
		background: bgSubtlerPressed(colors.insertActiveColor),
		padding: `1px 0 2px`,
	});
}

/** No-underline extended insert style for block content (padding only). */
export function buildInsertStyleInBlockExtendedNoUnderline(_colors: DiffColorScheme): string {
	return convertToInlineCss({
		padding: `1px 0 2px`,
	});
}

/** Inline inserted content — active/focused state. */
export function buildInsertStyleActive(colors: DiffColorScheme): string {
	return convertToInlineCss({
		background: bgSubtlerPressed(colors.insertActiveColor),
		textDecoration: 'underline',
		textDecorationStyle: colors.insertUnderlineStyle,
		textDecorationThickness: token('space.025'),
		textDecorationColor: textAccent(colors.insertActiveColor),
	});
}

// --- Deleted inline content styles ---

/** Base deleted-inline-style object, shared by several exports. */
function deletedInlineStyleBase(colors: DiffColorScheme): Record<string, string | number> {
	return {
		textDecorationColor: borderAccent(colors.deleteTextColor ?? colors.deleteColor),
		textDecoration: 'line-through',
		position: 'relative',
		opacity: 1,
	};
}

/** Active deleted-inline-style object, extending the base. */
function deletedInlineStyleActiveBase(colors: DiffColorScheme): Record<string, string | number> {
	return {
		...deletedInlineStyleBase(colors),
		textDecorationThickness: '2px',
		backgroundColor: bgSubtlestPressed(colors.deleteActiveColor),
	};
}

/** Strikethrough for removed inline / widget content (non-marker decorations). */
export function buildDeletedInlineStyle(colors: DiffColorScheme, isActive: boolean): string {
	return isActive
		? convertToInlineCss(deletedInlineStyleActiveBase(colors))
		: convertToInlineCss(deletedInlineStyleBase(colors));
}

/** Strikethrough line (unbounded span) for deleted content — default state. */
export function buildDeletedContentStyleUnbounded(colors: DiffColorScheme): string {
	return convertToInlineCss({
		position: 'absolute',
		top: '50%',
		width: '100%',
		display: 'inline-block',
		borderTop: `1px solid ${borderAccent(colors.deleteColor)}`,
		pointerEvents: 'none',
		zIndex: 1,
	});
}

/** Strikethrough line (unbounded span) for deleted content — active state. */
export function buildDeletedContentStyleUnboundedActive(colors: DiffColorScheme): string {
	return convertToInlineCss({
		position: 'absolute',
		top: '50%',
		width: '100%',
		display: 'inline-block',
		borderTop: `2px solid ${borderAccent(colors.deleteColor)}`,
		pointerEvents: 'none',
		zIndex: 1,
	});
}

// --- Deleted block node styles — quote node ---

/** Unbounded strikethrough overlay for deleted inline content (absolute positioned line). */
export function buildDeletedInlineStyleUnbounded(colors: DiffColorScheme): string {
	return convertToInlineCss({
		position: 'absolute',
		top: '50%',
		width: '100%',
		display: 'inline-block',
		borderTop: `1px solid ${textAccent(colors.deleteTextColor ?? colors.deleteColor)}`,
		pointerEvents: 'none',
		zIndex: 1,
	});
}

/** Deleted lozenge-style quote node with box-shadow ring. */
export function buildDeletedStyleQuoteNodeWithLozenge(colors: DiffColorScheme): string {
	return convertToInlineCss({
		marginTop: token('space.150'),
		paddingTop: token('space.025'),
		paddingBottom: token('space.025'),
		paddingLeft: token('space.025'),
		boxShadow: `0 0 0 1px ${borderAccent(colors.deleteColor)}`,
		borderRadius: token('radius.small'),
	});
}

/** Active state of the deleted lozenge-style quote node — stronger ring. */
export function buildDeletedStyleQuoteNodeWithLozengeActive(colors: DiffColorScheme): string {
	return convertToInlineCss({
		marginTop: token('space.150'),
		paddingTop: token('space.025'),
		paddingBottom: token('space.025'),
		paddingLeft: token('space.025'),
		boxShadow: `0 0 0 4px ${borderAccent(colors.deleteActiveColor)}`,
		borderRadius: token('radius.small'),
	});
}

export function buildDeletedStyleQuoteNode(colors: DiffColorScheme): string {
	if (colors.deletedQuoteNodeShape === 'borderLeft') {
		return convertToInlineCss({
			borderLeft: `2px solid ${borderAccent(colors.deleteColor)}`,
		});
	}
	return convertToInlineCss({
		marginTop: token('space.150'),
		paddingTop: token('space.025'),
		paddingBottom: token('space.025'),
		paddingLeft: token('space.025'),
		boxShadow: `0 0 0 1px ${borderAccent(colors.deleteColor)}`,
		borderRadius: token('radius.small'),
	});
}

/** Quote node outline for deleted content — active state. */
export function buildDeletedStyleQuoteNodeActive(colors: DiffColorScheme): string {
	return convertToInlineCss({
		marginTop: token('space.150'),
		paddingTop: token('space.025'),
		paddingBottom: token('space.025'),
		paddingLeft: token('space.025'),
		boxShadow: `0 0 0 4px ${bgSubtlerPressed(colors.deleteActiveColor)}`,
		borderRadius: token('radius.small'),
	});
}

// --- Deleted block node styles — generic block outline ---

/** Generic block node outline for deleted content — default state (small radius). */
export function buildDeletedBlockOutline(colors: DiffColorScheme): string {
	return convertToInlineCss({
		boxShadow: `0 0 0 1px ${borderAccent(colors.deleteColor)}`,
		borderRadius: token('radius.small'),
	});
}

/** Generic block node outline for deleted content — active state (small radius). */
export function buildDeletedBlockOutlineActive(colors: DiffColorScheme): string {
	return convertToInlineCss({
		boxShadow: `0 0 0 4px ${deletedBlockOutlineActiveRing(colors)}`,
		borderRadius: token('radius.small'),
	});
}

/** Generic block node outline for deleted content — default state (rounded/xsmall+1px radius). */
export function buildDeletedBlockOutlineRounded(colors: DiffColorScheme): string {
	return convertToInlineCss({
		boxShadow: `0 0 0 1px ${borderAccent(colors.deleteColor)}`,
		borderRadius: `calc(${token('radius.xsmall')} + 1px)`,
	});
}

/** Generic block node outline for deleted content — active state (rounded/xsmall+1px radius). */
export function buildDeletedBlockOutlineRoundedActive(colors: DiffColorScheme): string {
	return convertToInlineCss({
		boxShadow: `0 0 0 4px ${deletedBlockOutlineActiveRing(colors)}`,
		borderRadius: `calc(${token('radius.xsmall')} + 1px)`,
	});
}

/** Scroll-navigation "new" emphasis: 4px ring — default state (small radius). */
export function buildDeletedBlockOutlineNew(colors: DiffColorScheme): string {
	return convertToInlineCss({
		boxShadow: `0 0 0 4px ${bgSubtlest(colors.deleteColor)}`,
		borderRadius: token('radius.small'),
	});
}

/** Scroll-navigation "new" emphasis: 4px ring — default state (rounded radius). */
export function buildDeletedBlockOutlineRoundedNew(colors: DiffColorScheme): string {
	return convertToInlineCss({
		boxShadow: `0 0 0 4px ${bgSubtlest(colors.deleteColor)}`,
		borderRadius: `calc(${token('radius.xsmall')} + 1px)`,
	});
}

// --- Deleted table row style ---

/** Table row style for deleted rows. */
export function buildDeletedRowStyle(colors: DiffColorScheme): string {
	// Each branch emits exactly the CSS the pre-factory shim did for its scheme.
	return colors.deletedRowTreatment === 'textTint'
		? convertToInlineCss({
				color: textAccent(colors.deleteTextColor ?? colors.deleteColor),
				...getStandardDeletedTextDecorationStyle(),
				opacity: 0.6,
				display: 'table-row',
			})
		: convertToInlineCss({
				textDecorationColor: borderAccent(colors.deleteColor),
				textDecoration: 'line-through',
				opacity: 0.6,
				display: 'table-row',
			});
}

// --- Inserted block node styles — quote, rule, generic node, card ---

/** Quote node (blockquote) left-border style for inserted content — default state. */
export function buildInsertStyleQuoteNode(colors: DiffColorScheme): string {
	return convertToInlineCss({
		borderLeft: `2px solid ${borderAccent(colors.insertColor)}`,
	});
}

/** Quote node left-border style for inserted content — "new" scroll-nav state. */
export function buildInsertStyleQuoteNodeNew(colors: DiffColorScheme): string {
	return convertToInlineCss({
		borderLeft: `4px solid ${bgSubtlest(colors.insertColor)}`,
	});
}

/** Quote node left-border style for inserted content — active state. */
export function buildInsertStyleQuoteNodeActive(colors: DiffColorScheme): string {
	return convertToInlineCss({
		borderLeft: `4px solid ${bgSubtlerPressed(colors.insertActiveColor)}`,
	});
}

/** Horizontal rule style for inserted content — default state. */
export function buildInsertStyleRuleNode(colors: DiffColorScheme): string {
	return convertToInlineCss({
		backgroundColor: borderAccent(colors.insertColor),
	});
}

/** Horizontal rule style for inserted content — "new" scroll-nav state. */
export function buildInsertStyleRuleNodeNew(colors: DiffColorScheme): string {
	return convertToInlineCss({
		backgroundColor: bgSubtlest(colors.insertColor),
		border: 'none',
		height: '4px',
		borderRadius: token('radius.small'),
	});
}

/** Horizontal rule style for inserted content — active state. */
export function buildInsertStyleRuleNodeActive(colors: DiffColorScheme): string {
	return convertToInlineCss({
		backgroundColor: bgSubtlerPressed(colors.insertActiveColor),
		border: 'none',
		height: '4px',
		borderRadius: token('radius.small'),
	});
}

/** Generic node outline for inserted content — default state (small radius). */
export function buildInsertStyleNode(colors: DiffColorScheme): string {
	return convertToInlineCss({
		boxShadow: `0 0 0 1px ${borderAccent(colors.insertColor)}`,
		borderRadius: token('radius.small'),
	});
}

/** Generic node outline for inserted content — "new" scroll-nav state (small radius). */
export function buildInsertStyleNodeNew(colors: DiffColorScheme): string {
	return convertToInlineCss({
		boxShadow: `0 0 0 4px ${bgSubtlest(colors.insertColor)}`,
		borderRadius: token('radius.small'),
	});
}

/** Generic node outline for inserted content — active state (small radius). */
export function buildInsertStyleNodeActive(colors: DiffColorScheme): string {
	return convertToInlineCss({
		boxShadow: `0 0 0 4px ${bgSubtlerPressed(colors.insertActiveColor)}`,
		borderRadius: token('radius.small'),
	});
}

/** Card block node outline for inserted content — default state (medium radius). */
export function buildInsertStyleCardBlockNode(colors: DiffColorScheme): string {
	return convertToInlineCss({
		boxShadow: `0 0 0 1px ${borderAccent(colors.insertColor)}`,
		borderRadius: token('radius.medium'),
	});
}

/** Card block node outline for inserted content — "new" scroll-nav state (medium radius). */
export function buildInsertStyleCardBlockNodeNew(colors: DiffColorScheme): string {
	return convertToInlineCss({
		boxShadow: `0 0 0 4px ${bgSubtlest(colors.insertColor)}`,
		borderRadius: token('radius.medium'),
	});
}

/** Card block node outline for inserted content — active state (medium radius). */
export function buildInsertStyleCardBlockNodeActive(colors: DiffColorScheme): string {
	return convertToInlineCss({
		boxShadow: `0 0 0 4px ${bgSubtlerPressed(colors.insertActiveColor)}`,
		borderRadius: token('radius.medium'),
	});
}

// ---------------------------------------------------------------------------
// CSS custom property variables (for nodes styled via global stylesheet)
// These are applied as inline styles on the decoration wrapper element and
// cascade down to child/pseudo-element selectors in the global stylesheet.
// ---------------------------------------------------------------------------

/** CSS variables for an inserted node decoration marker — default state. */
export function buildDecorationMarkerVariable(colors: DiffColorScheme): string {
	return convertToInlineCss({
		'--diff-decoration-marker-color': borderAccent(colors.insertColor),
		'--diff-decoration-marker-ring-width': '1px',
	});
}

/** CSS variables for an inserted node decoration marker — "new" scroll-nav state. */
export function buildDecorationMarkerVariableNew(colors: DiffColorScheme): string {
	return convertToInlineCss({
		'--diff-decoration-marker-color': bgSubtlest(colors.insertColor),
		'--diff-decoration-marker-ring-width': '4px',
	});
}

/** CSS variables for an inserted node decoration marker — active state. */
export function buildDecorationMarkerVariableActive(colors: DiffColorScheme): string {
	return convertToInlineCss({
		'--diff-decoration-marker-color': bgSubtlerPressed(colors.insertActiveColor),
		'--diff-decoration-marker-ring-width': '4px',
	});
}

/** Deleted node decoration marker (extension / embedCard / listItem) — default state. */
export function buildDeletedDecorationMarkerVariable(colors: DiffColorScheme): string {
	return convertToInlineCss({
		...deletedInlineStyleBase(colors),
		'--diff-decoration-marker-color': borderAccent(colors.deleteColor),
		'--diff-decoration-marker-ring-width': '1px',
	});
}

/** Opacity only, no position or strikethrough. Used by 'static' schemes. */
export function buildDeletedDecorationMarkerVariableSimple(colors: DiffColorScheme): string {
	return convertToInlineCss({
		opacity: 0.8,
		'--diff-decoration-marker-color': borderAccent(colors.deleteColor),
		'--diff-decoration-marker-ring-width': '1px',
	});
}

/**
 * 'glyphTint' deleted inline style — tints the glyph itself via `color:`. Opacity ramps 0.6
 * default, 0.83 "new", 1 active.
 */
/** Extended deleted inline style — background highlight with an accent or background-matched bottom border. */
export function buildDeletedInlineContentStyleExtended(
	colors: DiffColorScheme,
	isActive: boolean = false,
): string {
	const backgroundColor =
		isActive && colors.deletedInlineBorderTone === 'background'
			? bgSubtlerPressed(colors.deleteActiveColor)
			: bgSubtlest(colors.deleteColor);

	return convertToInlineCss({
		backgroundColor,
		borderBottom: `2px solid ${
			colors.deletedInlineBorderTone === 'background'
				? backgroundColor
				: borderAccent(colors.deleteColor)
		}`,
		padding: `1px 0 2px`,
	});
}

export function buildDeletedInlineStyleStandard(
	colors: DiffColorScheme,
	state: 'default' | 'new' | 'active',
): string {
	if (state === 'active') {
		return convertToInlineCss({
			color: colors.deleteTextColor ? textAccent(colors.deleteTextColor) : token('color.text'),
			...getStandardDeletedTextDecorationStyle(),
			textDecorationColor: textAccent(colors.deleteTextColor ?? colors.deleteColor),
			position: 'relative',
			opacity: colors.deleteTextColor ? 0.83 : 1,
		});
	}
	return convertToInlineCss({
		color: textAccent(colors.deleteTextColor ?? colors.deleteColor),
		...getStandardDeletedTextDecorationStyle(),
		position: 'relative',
		opacity: colors.deleteTextColor || state === 'new' ? 0.83 : 0.6,
	});
}

/** Deleted node decoration marker — "new" state. */
export function buildDeletedDecorationMarkerVariableNew(colors: DiffColorScheme): string {
	return convertToInlineCss({
		...deletedInlineStyleBase(colors),
		'--diff-decoration-marker-color': bgSubtlest(colors.deleteColor),
		'--diff-decoration-marker-ring-width': '4px',
	});
}

/** Deleted node decoration marker — active state. */
export function buildDeletedDecorationMarkerVariableActive(colors: DiffColorScheme): string {
	return convertToInlineCss({
		...deletedInlineStyleActiveBase(colors),
		'--diff-decoration-marker-color': bgSubtlerPressed(colors.deleteActiveColor),
		'--diff-decoration-marker-ring-width': '4px',
	});
}

// --- Table cell overlay styles ---

/** Cell overlay for added table cells — default state (zIndex 1). */
export function buildAddedCellOverlayStyle(colors: DiffColorScheme): string {
	return convertToInlineCss({
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: `rgba(from ${bgSubtlest(colors.insertColor)} r g b / ${colors.insertedCellOpacity})`,
		zIndex: colors.addedCellOverlayZIndex,
		outline: `1px solid ${borderAccent(colors.insertColor)}`,
		pointerEvents: 'none',
	});
}

/** Cell overlay for added table cells — rounded variant (zIndex 2, inherits border/radius). */
export function buildAddedCellOverlayRoundedStyle(colors: DiffColorScheme): string {
	return convertToInlineCss({
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: `rgba(from ${bgSubtlest(colors.insertColor)} r g b / ${colors.insertedCellOpacity})`,
		zIndex: 2,
		outline: `1px solid ${borderAccent(colors.insertColor)}`,
		pointerEvents: 'none',
		...(colors.roundedAddedCellOverlayInheritsBorder ? { border: 'inherit' } : {}),
		borderRadius: 'inherit',
	});
}

/** Cell overlay for added table cells — "new" scroll-nav state. */
export function buildAddedCellOverlayStyleNew(colors: DiffColorScheme): string {
	return convertToInlineCss({
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: `rgba(from ${bgSubtlest(colors.insertColor)} r g b / ${colors.insertedCellOpacity})`,
		zIndex: 1,
		outline: `1px solid ${bgSubtlerPressed(colors.insertActiveColor)}`,
		pointerEvents: 'none',
	});
}

/** Cell overlay for deleted table cells — default state (zIndex 1). Uses deletedCellColor. */
export function buildDeletedCellOverlayStyle(colors: DiffColorScheme): string {
	return convertToInlineCss({
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: `rgba(from ${bgSubtlest(colors.deletedCellColor)} r g b / ${colors.deletedCellOpacity})`,
		zIndex: 1,
		outline: `1px solid ${deletedCellOutline(colors)}`,
		pointerEvents: 'none',
	});
}

/** Cell overlay for deleted table cells — rounded variant (zIndex 2, inherits border/radius). */
export function buildDeletedCellOverlayRoundedStyle(colors: DiffColorScheme): string {
	return convertToInlineCss({
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: `rgba(from ${bgSubtlest(colors.deletedCellColor)} r g b / ${colors.deletedCellOpacity})`,
		zIndex: 2,
		outline: `1px solid ${deletedCellOutline(colors)}`,
		pointerEvents: 'none',
		border: 'inherit',
		borderRadius: 'inherit',
	});
}

// ---------------------------------------------------------------------------
// CSS custom property variables for deleted node global stylesheet
//
// These are set as inline styles on the deleted node wrapper element and cascade
// down to child/pseudo-element selectors in the global smartCardStyles stylesheet.
// The stylesheet reads var(--diff-delete-color) etc. — one set of selectors for
// all schemes, written once, never needs to change when new schemes are added.
// ---------------------------------------------------------------------------

// --- Inline content style dispatch ---

/**
 * Inserted inline content under the extended diff experience. `insertedInlineTreatment` picks
 * `text-decoration` vs a `border-bottom` rule; only the latter honours `hideAddedDiffsUnderline`.
 */
export function buildInsertedInlineStyle(
	colors: DiffColorScheme,
	isActive: boolean,
	hideAddedDiffsUnderline: boolean,
): string {
	if (colors.insertedInlineTreatment === 'underline') {
		return isActive ? buildInsertStyleActive(colors) : buildInsertStyle(colors);
	}

	if (isActive) {
		return hideAddedDiffsUnderline
			? buildInsertStyleExtendedNoUnderlineActive(colors)
			: buildInsertStyleExtendedActive(colors);
	}

	return hideAddedDiffsUnderline
		? buildInsertStyleExtendedNoUnderline(colors)
		: buildInsertStyleExtended(colors);
}

/**
 * The colours `buildInsertedInlineStyle()` above would paint, for the reveal to animate towards.
 *
 * MUST mirror that function: the reveal replaces the flat highlight with a sized gradient, so a
 * divergence here means the animation settles on a different colour than a static render produces.
 * `revealStyles.ts` in the test package asserts the two agree across the isActive /
 * hideAddedDiffsUnderline matrix.
 *
 * A transparent border is how "no underline" is expressed: the box still reserves the 2px so the
 * text does not shift when the underline arrives.
 */
export function getInsertedInlineRevealColors(
	colors: DiffColorScheme,
	isActive: boolean,
	hideAddedDiffsUnderline: boolean,
): { background: string; border: string } {
	return {
		background: isActive
			? bgSubtlerPressed(colors.insertActiveColor)
			: bgSubtlest(colors.insertColor),
		border: hideAddedDiffsUnderline ? 'transparent' : borderAccent(colors.insertColor),
	};
}

/**
 * The colours `buildDeletedInlineContentStyleExtended()` paints, for the reveal to animate towards.
 * Deleted content's highlight does not vary with the active state — only its text does, which the
 * reveal keeps as-is.
 */
export function getDeletedInlineRevealColors(colors: DiffColorScheme): {
	background: string;
	border: string;
} {
	return {
		background: bgSubtlest(colors.deleteColor),
		border: borderAccent(colors.deleteColor),
	};
}

/** The three visual states deleted inline content can be in. */
export type DeletedInlineState = 'active' | 'default' | 'new';

/**
 * Deleted inline content in a given state. 'strikethrough' renders 'default' and 'new'
 * identically; the 'new' step exists only for the 'glyphTint' opacity ramp.
 */
export function buildDeletedInlineContentStyle(
	colors: DiffColorScheme,
	state: DeletedInlineState,
): string {
	return colors.deletedInlineTreatment === 'strikethrough'
		? buildDeletedInlineStyle(colors, state === 'active')
		: buildDeletedInlineStyleStandard(colors, state);
}

/**
 * The positioned line across deleted content spanning an unbounded range. 'stateful' thickens
 * 1px to 2px when active and tints with the border accent; 'static' uses the text accent always.
 */
export function buildDeletedStrikethroughLine(colors: DiffColorScheme, isActive: boolean): string {
	if (colors.deletedNodeEmphasis !== 'stateful') {
		return buildDeletedInlineStyleUnbounded(colors);
	}

	return isActive
		? buildDeletedContentStyleUnboundedActive(colors)
		: buildDeletedContentStyleUnbounded(colors);
}

// --- Deleted-content "REMOVED" lozenge ---

/** Structural CSS shared by both lozenge states — everything except the tint and the label colour. */
const deletedLozengeBase = {
	display: 'inline-flex',
	boxSizing: 'border-box',
	position: 'static',
	blockSize: 'min-content',
	borderRadius: token('radius.small'),
	overflow: 'hidden',
	paddingInlineStart: token('space.050'),
	paddingInlineEnd: token('space.050'),
	font: token('font.body.small'),
	fontWeight: token('font.weight.bold'),
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
} as const;

/**
 * Label colour for both lozenge states. `inverse` is a fixed tone that reads on any tint, which is
 * why the resting lozenge could get away with a hardcoded gray background; a scheme that tints the
 * lozenge itself needs `accent` instead.
 */
function deletedLozengeTextColor(colors: DiffColorScheme): string {
	return colors.deletedLozengeTextTone === 'accent'
		? textAccent(colors.deletedLozengeColor)
		: token('color.text.warning.inverse');
}

/** The "REMOVED" lozenge on a deleted block node — resting state, tinted with deletedLozengeColor. */
export function buildDeletedLozengeStyle(colors: DiffColorScheme): string {
	return convertToInlineCss({
		...deletedLozengeBase,
		color: deletedLozengeTextColor(colors),
		backgroundColor: bgSubtler(colors.deletedLozengeColor),
	});
}

/** The "REMOVED" lozenge — active state, tinted with the scheme's deleteActiveColor. */
export function buildDeletedLozengeActiveStyle(colors: DiffColorScheme): string {
	return convertToInlineCss({
		...deletedLozengeBase,
		color: deletedLozengeTextColor(colors),
		backgroundColor: bgSubtlerPressed(colors.deleteActiveColor),
	});
}

// ---------------------------------------------------------------------------
// Block node style dispatch
//
// A block node's decoration shape is a property of the *node type* — every scheme draws a
// blockquote with a left border and a horizontal rule as a filled bar. What varies per scheme
// is the emphasis and, for deleted content, which of the treatments below is used. Keeping that
// table here rather than in the decoration consumers means adding a scheme stays a change to
// `schemes.ts` alone.
// ---------------------------------------------------------------------------

/** The decoration shape an inserted block node takes. Determined by node type, not by scheme. */
export type InsertedBlockNodeShape = 'cardBlock' | 'marker' | 'node' | 'quote' | 'rule';

/**
 * Outline for an inserted block node. `insertedNodeEmphasis`: 'stateful' draws a 4px ring
 * (`subtlest` at rest, `subtler.pressed` when focused), 'static' one 1px accent ring.
 */
export function buildInsertedBlockNodeStyle(
	colors: DiffColorScheme,
	shape: InsertedBlockNodeShape,
	isActive: boolean,
): string {
	const isStateful = colors.insertedNodeEmphasis === 'stateful';

	switch (shape) {
		case 'quote':
			if (!isStateful) {
				return buildInsertStyleQuoteNode(colors);
			}
			return isActive
				? buildInsertStyleQuoteNodeActive(colors)
				: buildInsertStyleQuoteNodeNew(colors);
		case 'rule':
			if (!isStateful) {
				return buildInsertStyleRuleNode(colors);
			}
			return isActive
				? buildInsertStyleRuleNodeActive(colors)
				: buildInsertStyleRuleNodeNew(colors);
		case 'cardBlock':
			if (!isStateful) {
				return buildInsertStyleCardBlockNode(colors);
			}
			return isActive
				? buildInsertStyleCardBlockNodeActive(colors)
				: buildInsertStyleCardBlockNodeNew(colors);
		case 'marker':
			if (!isStateful) {
				return buildDecorationMarkerVariable(colors);
			}
			return isActive
				? buildDecorationMarkerVariableActive(colors)
				: buildDecorationMarkerVariableNew(colors);
		case 'node':
		default:
			if (!isStateful) {
				return buildInsertStyleNode(colors);
			}
			return isActive ? buildInsertStyleNodeActive(colors) : buildInsertStyleNodeNew(colors);
	}
}

/**
 * The category a deleted block node falls into — by node type, not by scheme.
 *
 * 'container' — media, panel: content is a child element, so the node is only dimmed.
 * 'listItem'  — listItem: reads the marker variables via editor-core's list styles.
 * 'marker'    — extension, embedCard: same, via extension and smart-card styles.
 * 'quote'     — blockquote.
 * 'generic'   — rule, blockCard, everything else.
 */
export type DeletedBlockNodeCategory = 'container' | 'generic' | 'listItem' | 'marker' | 'quote';

/**
 * Outline for a deleted block node, driven by `deletedInlineTreatment` (strike vs tint) and
 * `deletedNodeEmphasis` (whether the outline tracks scroll state and emits marker variables).
 */
export function buildDeletedBlockNodeStyle(
	colors: DiffColorScheme,
	category: DeletedBlockNodeCategory,
	isActive: boolean,
): string {
	const isStrikethrough = colors.deletedInlineTreatment === 'strikethrough';
	const statefulMarker = () =>
		isActive
			? buildDeletedDecorationMarkerVariableActive(colors)
			: buildDeletedDecorationMarkerVariableNew(colors);

	switch (category) {
		case 'quote':
			// Both emphases share one builder here — `deletedQuoteNodeShape` already carries the
			// only variance (a ring versus a left border).
			return buildDeletedStyleQuoteNode(colors);
		case 'container':
			return isStrikethrough
				? buildDeletedInlineStyle(colors, false)
				: buildDeletedDecorationMarkerVariableSimple(colors);
		case 'listItem':
			return colors.deletedNodeEmphasis === 'stateful'
				? statefulMarker()
				: buildDeletedDecorationMarkerVariableSimple(colors);
		case 'marker':
			return colors.deletedNodeEmphasis === 'stateful'
				? statefulMarker()
				: buildDeletedInlineStyleStandard(colors, 'new');
		case 'generic':
		default:
			return isStrikethrough
				? buildDeletedInlineStyle(colors, false)
				: buildDeletedInlineStyleStandard(colors, 'new');
	}
}

/**
 * Deleted blockquote inside a lozenge wrapper (the nodeview path). Always a ring, since the
 * lozenge needs an enclosed shape, so `deletedQuoteNodeShape` does not apply — only
 * `deletedQuoteNodeActiveTone`, which picks the active ring's tone.
 */
export function buildDeletedQuoteNodeWithLozengeStyle(
	colors: DiffColorScheme,
	isActive: boolean,
): string {
	if (!isActive) {
		return buildDeletedStyleQuoteNodeWithLozenge(colors);
	}

	return colors.deletedQuoteNodeActiveTone === 'backgroundPressed'
		? buildDeletedStyleQuoteNodeActive(colors)
		: buildDeletedStyleQuoteNodeWithLozengeActive(colors);
}

/**
 * Outline for a deleted block node via the nodeview wrapper (expand, decisionList, panel,
 * codeBlock). Every scheme shares the active state; `deletedNodeEmphasis` changes only the
 * resting one — 'stateful' a 4px subtlest ring, 'static' a 1px accent ring.
 */
export function buildDeletedWrappedBlockOutline(
	colors: DiffColorScheme,
	{ isActive, isRounded }: { isActive: boolean; isRounded: boolean },
): string {
	if (isActive) {
		return isRounded
			? buildDeletedBlockOutlineRoundedActive(colors)
			: buildDeletedBlockOutlineActive(colors);
	}

	if (colors.deletedNodeEmphasis === 'stateful') {
		return isRounded
			? buildDeletedBlockOutlineRoundedNew(colors)
			: buildDeletedBlockOutlineNew(colors);
	}

	return isRounded ? buildDeletedBlockOutlineRounded(colors) : buildDeletedBlockOutline(colors);
}

/**
 * Accent colour for atomic inline changed nodes (date, emoji, mention, status). Set inline on the
 * decoration span and read by the `.show-diff-atomic-inline-changed-*` selectors in
 * EditorContentContainer, on the decorated element or a descendant, so it must inherit. Being
 * inline it beats the stylesheet's fallback, making the plugin the only source of the colour.
 */
export function buildAtomicInlineChangedCSSVariables(colors: DiffColorScheme): string {
	return convertToInlineCss({
		'--show-diff-atomic-inline-changed-border-color': borderAccent(colors.insertColor),
	});
}

/**
 * Deleted-node wrapper variables, one per visual role in editor-core's `showDiffDeletedNodeStyles`.
 * Emitted by `wrapBlockNodeView` alongside `show-diff-deleted-node-vars` — the class is named for
 * these properties — so one set of selectors in editor-core covers both schemes.
 *
 * The three `stateful`-only variables are omitted for `static` (standard) so editor-core's fallback
 * wins, which is what standard rendered before:
 * - `--diff-delete-opacity` — the fallback is 0.6 or 0.8 depending on
 *   `platform_editor_enghealth_a11y_jan_fixes`, a split the scheme must not flatten.
 * - `--diff-delete-ring-width` — traditional's deleted media ring tracks the inherited marker ring
 *   width instead of a fixed 1px.
 * - `--diff-delete-text-decoration-color` — standard's blockquote strike must stay `currentColor`.
 *
 * `--diff-delete-media-ring-color` is emitted for every scheme: the a11y-fixes treatment rings
 * deleted media red even where `deleteColor` is gray, so it needs its own role.
 *
 * `--diff-delete-embed-strike-line` carries the *presence* of the deleted-embedCard strike, not its
 * colour — standard draws none. Encoding it as `line-through`/`none` is what lets the ON cohort drop
 * the `-traditional` class entirely.
 *
 * Only reached when `platform_editor_show_diff_color_scheme_refactor` is on; the OFF cohort takes
 * its values from the per-scheme selectors in editor-core instead.
 */
export function buildDeletedNodeCSSVariables(colors: DiffColorScheme): string {
	return convertToInlineCss({
		'--diff-delete-color': borderAccent(colors.deleteColor),
		'--diff-delete-color-new': bgSubtlest(colors.deleteColor),
		'--diff-delete-color-active': bgSubtlerPressed(colors.deleteActiveColor),
		'--diff-delete-media-ring-color': borderAccent(colors.deletedMediaRingColor),
		'--diff-delete-embed-strike-line': colors.strikesDeletedEmbedCard ? 'line-through' : 'none',
		...(colors.deletedNodeEmphasis === 'stateful'
			? {
					'--diff-delete-opacity': '1',
					'--diff-delete-ring-width': 'var(--diff-decoration-marker-ring-width, 1px)',
					'--diff-delete-text-decoration-color': borderAccent(colors.deleteColor),
				}
			: {}),
	});
}
