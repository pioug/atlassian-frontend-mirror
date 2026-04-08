import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { token } from '@atlaskit/tokens';

export const traditionalInsertStyle: string = convertToInlineCss({
	background: token('color.background.accent.green.subtlest'),
	textDecoration: 'underline',
	textDecorationStyle: 'solid',
	textDecorationThickness: token('space.025'),
	textDecorationColor: token('color.border.accent.green'),
});

export const traditionalInsertStyleActive: string = convertToInlineCss({
	background: token('color.background.accent.green.subtler.pressed'),
	textDecoration: 'underline',
	textDecorationStyle: 'solid',
	textDecorationThickness: token('space.025'),
	textDecorationColor: token('color.text.accent.green'),
});

const deletedTraditionalInlineStyleBase = {
	textDecorationColor: token('color.border.accent.red'),
	textDecoration: 'line-through',
	position: 'relative',
	opacity: 1,
} as const;

const deletedTraditionalInlineStyleActiveBase = {
	...deletedTraditionalInlineStyleBase,
	textDecorationThickness: '2px',
	backgroundColor: token('color.background.accent.red.subtlest.pressed'),
} as const;

/** Strikethrough for traditional removed inline / widget content (non-marker decorations). */
export function getDeletedTraditionalInlineStyle(isActive: boolean): string {
	return isActive
		? convertToInlineCss(deletedTraditionalInlineStyleActiveBase)
		: convertToInlineCss(deletedTraditionalInlineStyleBase);
}

export const deletedTraditionalContentStyleUnbounded: string = convertToInlineCss({
	position: 'absolute',
	top: '50%',
	width: '100%',
	display: 'inline-block',
	borderTop: `1px solid ${token('color.border.accent.red')}`,
	pointerEvents: 'none',
	zIndex: 1,
});

/** Strikethrough line for traditional when active (background highlight on text wrapper) */
export const deletedTraditionalContentStyleUnboundedActive: string = convertToInlineCss({
	position: 'absolute',
	top: '50%',
	width: '100%',
	display: 'inline-block',
	borderTop: `2px solid ${token('color.border.accent.red')}`,
	pointerEvents: 'none',
	zIndex: 1,
});

export const deletedTraditionalStyleQuoteNode: string = convertToInlineCss({
	marginTop: token('space.150'),
	paddingTop: token('space.025'),
	paddingBottom: token('space.025'),
	paddingLeft: token('space.025'),
	boxShadow: `0 0 0 1px ${token('color.border.accent.red')}`,
	borderRadius: token('radius.small'),
});

export const deletedTraditionalStyleQuoteNodeActive: string = convertToInlineCss({
	marginTop: token('space.150'),
	paddingTop: token('space.025'),
	paddingBottom: token('space.025'),
	paddingLeft: token('space.025'),
	boxShadow: `0 0 0 4px ${token('color.background.accent.red.subtler.pressed')}`,
	borderRadius: token('radius.small'),
});

export const deletedTraditionalBlockOutline: string = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.red')}`,
	borderRadius: token('radius.small'),
});

export const deletedTraditionalBlockOutlineActive: string = convertToInlineCss({
	boxShadow: `0 0 0 4px ${token('color.background.accent.red.subtler.pressed')}`,
	borderRadius: token('radius.small'),
});

export const deletedTraditionalBlockOutlineRounded: string = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.red')}`,
	borderRadius: `calc(${token('radius.xsmall')} + 1px)`,
});

export const deletedTraditionalBlockOutlineRoundedActive: string = convertToInlineCss({
	boxShadow: `0 0 0 4px ${token('color.background.accent.red.subtler.pressed')}`,
	borderRadius: `calc(${token('radius.xsmall')} + 1px)`,
});

/** Scroll-navigation “new” emphasis: 4px ring (see {@link traditionalStyleNodeNew}). */
export const deletedTraditionalBlockOutlineNew: string = convertToInlineCss({
	boxShadow: `0 0 0 4px ${token('color.background.accent.red.subtlest')}`,
	borderRadius: token('radius.small'),
});

export const deletedTraditionalBlockOutlineRoundedNew: string = convertToInlineCss({
	boxShadow: `0 0 0 4px ${token('color.background.accent.red.subtlest')}`,
	borderRadius: `calc(${token('radius.xsmall')} + 1px)`,
});

export const deletedTraditionalRowStyle: string = convertToInlineCss({
	textDecorationColor: token('color.border.accent.red'),
	textDecoration: 'line-through',
	opacity: 0.6,
	display: 'table-row',
});

export const traditionalStyleQuoteNode: string = convertToInlineCss({
	borderLeft: `2px solid ${token('color.border.accent.green')}`,
});

export const traditionalStyleQuoteNodeNew: string = convertToInlineCss({
	borderLeft: `4px solid ${token('color.background.accent.green.subtlest')}`,
});

export const traditionalStyleQuoteNodeActive: string = convertToInlineCss({
	borderLeft: `4px solid ${token('color.background.accent.green.subtler.pressed')}`,
});

export const traditionalStyleRuleNode: string = convertToInlineCss({
	backgroundColor: token('color.border.accent.green'),
});

export const traditionalStyleRuleNodeNew: string = convertToInlineCss({
	backgroundColor: token('color.background.accent.green.subtlest'),
	border: 'none',
	height: '4px',
	borderRadius: token('radius.small'),
});

export const traditionalStyleRuleNodeActive: string = convertToInlineCss({
	backgroundColor: token('color.background.accent.green.subtler.pressed'),
	border: 'none',
	height: '4px',
	borderRadius: token('radius.small'),
});

export const traditionalStyleNode: string = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.green')}`,
	borderRadius: token('radius.small'),
});

export const traditionalStyleNodeNew: string = convertToInlineCss({
	boxShadow: `0 0 0 4px ${token('color.background.accent.green.subtlest')}`,
	borderRadius: token('radius.small'),
});

export const traditionalStyleNodeActive: string = convertToInlineCss({
	boxShadow: `0 0 0 4px ${token('color.background.accent.green.subtler.pressed')}`,
	borderRadius: token('radius.small'),
});

export const traditionalStyleCardBlockNode: string = convertToInlineCss({
	boxShadow: `0 0 0 1px ${token('color.border.accent.green')}`,
	borderRadius: token('radius.medium'),
});

export const traditionalStyleCardBlockNodeNew: string = convertToInlineCss({
	boxShadow: `0 0 0 4px ${token('color.background.accent.green.subtlest')}`,
	borderRadius: token('radius.medium'),
});

export const traditionalStyleCardBlockNodeActive: string = convertToInlineCss({
	boxShadow: `0 0 0 4px ${token('color.background.accent.green.subtler.pressed')}`,
	borderRadius: token('radius.medium'),
});

export const traditionalDecorationMarkerVariable: string = convertToInlineCss({
	'--diff-decoration-marker-color': token('color.border.accent.green'),
	'--diff-decoration-marker-ring-width': '1px',
});

export const traditionalDecorationMarkerVariableNew: string = convertToInlineCss({
	'--diff-decoration-marker-color': token('color.background.accent.green.subtlest'),
	'--diff-decoration-marker-ring-width': '4px',
});

export const traditionalDecorationMarkerVariableActive: string = convertToInlineCss({
	'--diff-decoration-marker-color': token('color.background.accent.green.subtler.pressed'),
	'--diff-decoration-marker-ring-width': '4px',
});

/** Inline deleted traditional styling plus diff marker CSS variables (extension / embedCard / listItem). */
export const traditionalDeletedDecorationMarkerVariable: string = convertToInlineCss({
	...deletedTraditionalInlineStyleBase,
	'--diff-decoration-marker-color': token('color.border.accent.red'),
	'--diff-decoration-marker-ring-width': '1px',
});

export const traditionalDeletedDecorationMarkerVariableNew: string = convertToInlineCss({
	...deletedTraditionalInlineStyleBase,
	'--diff-decoration-marker-color': token('color.background.accent.red.subtlest'),
	'--diff-decoration-marker-ring-width': '4px',
});

export const traditionalDeletedDecorationMarkerVariableActive: string = convertToInlineCss({
	...deletedTraditionalInlineStyleActiveBase,
	'--diff-decoration-marker-color': token('color.background.accent.red.subtler.pressed'),
	'--diff-decoration-marker-ring-width': '4px',
});

export const traditionalAddedCellOverlayStyle = convertToInlineCss({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	backgroundColor: `rgba(from ${token('color.background.accent.green.subtlest')} r g b / 0.5)`,
	zIndex: 1,
	outline: `1px solid ${token('color.border.accent.green')}`,
	pointerEvents: 'none',
});

export const traditionalAddedCellOverlayStyleNew = convertToInlineCss({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	backgroundColor: `rgba(from ${token('color.background.accent.green.subtlest')} r g b / 0.5)`,
	zIndex: 1,
	outline: `1px solid ${token('color.background.accent.green.subtler.pressed')}`,
	pointerEvents: 'none',
});

export const deletedTraditionalCellOverlayStyle = convertToInlineCss({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	backgroundColor: `rgba(from ${token('color.background.accent.gray.subtlest')} r g b / 0.5)`,
	zIndex: 1,
	outline: `1px solid ${token('color.border.disabled')}`,
	pointerEvents: 'none',
});
